import { useContext, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { Content } from '../../assembly/main'
import { Role } from '../../assembly/model'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import LoadingIndicator from '../../components/LoadingIndicator'
import { NearContext } from '../../context/NearContext'
import Alert from '../../components/Alert'

const Contents: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [content, setContent] = useState<Content[]>([])
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState<string>('')
  const { query } = useRouter()
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    init()
  }, [])
  
  const init = async (): Promise<void> => {
    setTransactionHashes(query.transactionHashes as string)
    
    if (!contract) {
      return
    }

    setLoading(true)
    setContractedLoaded(true)
    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }

    const ct: Content[] = await contract.getContents()
    setContent(ct)
    setLoading(false)
  }

  const deleteContent = (ct: Content): void => {
    if (!contract) {
      return
    }

    setLoading(true)
    // TODO: delete in gun
    contract.deleteContent({ content: ct }).then(() => {
      const newContent = content.filter(c => c.slug !== ct.slug)
      setContent(newContent)
      setLoading(false)
    })
  }

  const editContent = (ct: Content): void => {
    if (!contract) {
      return
    }

    Router.push('/content/[slug]', `/content/${ct.slug}`)
  }

  return (
    <Layout home={false}>
      <h1 className="title">Content</h1>
      {!contract && <div>Loading...</div>}
      
      {transactionHashes && (
        <Alert heading="Success!" transactionHashes={transactionHashes} />
      )}

      {contract && !contractLoaded && !content.length && <LoadButton initFunction={init} />}
      {contract && contractLoaded && !content.length && (
        <div>
          No content
        </div>
      )}

      <div className="my-3">
        <Link href="/content/new">
          <a className="px-3 py-2 my-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue">Create New</a>
        </Link>
      </div>

      {contract && content.length > 0 && loading && (
        <LoadingIndicator />
      )}
      
      {contract && content.length > 0 && !loading && (
        <table className="table-auto min-w-full divide-y divide-gray">
          <thead className="bg-gray">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Actions</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Content Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Public</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Encrypted</th>
            </tr>
          </thead>
          <tbody className="bg-gray-medium text-gray">
          {contract && content && content.map((ct, index) => {
            return (
              <tr key={`${ct.slug}-${ct.name}`} className={index % 2 === 0 ? 'bg-gray-light' : ''}>
                <td>
                  <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => editContent(ct)}>Edit</button>
                  <button className="px-3 py-2 my-3 x-4 border border-yellow shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => deleteContent(ct)}>Delete</button>
                </td>
                <td>{ct.name}</td>
                <td>{ct.type.name}</td>
                <td>{ct.isPublic ? 'Yes' : 'No'}</td>
                <td>{ct.isEncrypted ? 'Yes' : 'No'}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      )}
    </Layout>
  )
}

export default Contents
