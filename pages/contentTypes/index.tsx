import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import { ContentType } from '../../assembly/main'
import { Role } from '../../assembly/model'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import { NearContext } from '../../context/NearContext'
import SchemaModal from '../../components/SchemaModal'
import Alert from '../../components/Alert'
import LoadingIndicator from '../../components/LoadingIndicator'

const ContentTypes: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [transactionHashes, setTransactionHashes] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    init()
  }, [])
  
  const init = async (): Promise<void> => {
    setTransactionHashes(Router.query.transactionHashes as string)
    
    if (!contract) {
      setContractedLoaded(false)
      return
    }

    setLoading(true)
    setContractedLoaded(true)
    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }

    const ct = await contract.getContentTypes()
    setContentTypes(ct)
    setLoading(false)
  }

  const deleteContentType = (ct: ContentType): void => {
    if (!contract) {
      return
    }

    setLoading(true)
    contract.deleteContentType({ name: ct.name }).then(() => {
      const newContentTypes = contentTypes.filter(c => c.name !== ct.name)
      setContentTypes(newContentTypes)
      setLoading(false)
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title mb-5">Content Types</h1>
      <p className="text-blue text-center text-xl mb-5">Define your data schema.</p>

      {(!contract || !currentUser) && <div>Loading...</div>}

      {transactionHashes && (
        <Alert heading="Success!" transactionHashes={transactionHashes} />
      )}

      {contract && currentUser && !contractLoaded && <LoadButton initFunction={init} />}

      <div className="my-6">
        <Link href="/contentTypes/new">
          <a className="px-3 py-2 my-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">Create New</a>
        </Link>
        <p className="pl-5 inline text-blue">Let&apos;s create a new content type!</p>
      </div>

      <SchemaModal contentType={contentType as ContentType} setContentType={setContentType} />

      <LoadingIndicator loading={(contract && contractLoaded && loading && contentTypes.length > 0)} />

      {contract && contractLoaded && contentTypes.length > 0 && (
        <>
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
                  <td>
                    <button className="px-3 py-2 my-3 x-4 border border-blue bg-blue shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => setContentType(ct)}>Show</button>
                    <button className="px-3 py-2 my-3 x-4 border border-yellow shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => deleteContentType(ct)}>Delete</button>
                  </td>
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
