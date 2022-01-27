import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import { ContentType } from '../../assembly/main'
import { Role } from '../../assembly/model'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import { NearContext } from '../../context/NearContext'

const ContentTypes: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])

  useEffect(() => {
    if (!contract) {
      return
    }

    init()
  }, [])
  
  const init = (): void => {
    if (!contract) {
      return
    }

    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }

    contract.getContentTypes().then((ct: ContentType[]) => {
      setContentTypes(ct)
    })
  }

  const deleteContentType = (ct: ContentType): void => {
    if (!contract) {
      return
    }

    contract.deleteContentType({ name: ct.name }).then(() => {
      init()
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title">Content Types</h1>
      {!contract && <div>Loading...</div>}
      {contract && !contentTypes.length && <LoadButton initFunction={init} />}
      {contract && contentTypes.length > 0 && (
        <>
          <div className="my-3">
            <Link href="/contentTypes/new">
              <a className="px-3 py-2 my-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">Create New</a>
            </Link>
          </div>
          <table className="table-auto min-w-full divide-y divide-gray">
            <thead className="bg-gray">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Actions</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Name</th>
              </tr>
            </thead>
            <tbody className="bg-gray-medium text-gray">
            {contract && contentTypes && contentTypes.map((ct, index) => {
              return (
                <tr key={ct.name} className={index % 2 === 0 ? 'bg-gray-light' : ''}>
                  <td><button className="px-3 py-2 my-3 x-4 border border-yellow shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => deleteContentType(ct)}>Delete</button></td>
                  <td>{ct.name}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </>
      )}
    </Layout>
  )
}

export default ContentTypes
