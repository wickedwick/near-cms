import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ContentType } from '../../assembly/main'
import { NearContext } from '../../context/NearContext'
import Router from 'next/router'
import { Role } from '../../assembly/model'
import Layout from '../../components/Layout'

const ContentTypes: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])

  useEffect(() => {
    if (!contract) {
      setTimeout(() => {
        init
      }
      , 5000)

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
      {contract && !contentTypes.length && <button onClick={init}>Load</button>}
      <div className="my-3">
        <Link href="/contentTypes/new">
          <a className="px-3 py-2 my-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">Create New</a>
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
        {contract && contentTypes && contentTypes.map((ct) => {
          return (
            <tr key={ct.name}>
              <td><button className="px-3 py-2 my-3 x-4 border border-blue bg-yellow shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => deleteContentType(ct)}>Delete</button></td>
              <td>{ct.name}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </Layout>
  )
}

export default ContentTypes
