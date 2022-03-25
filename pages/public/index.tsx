import { useContext, useEffect, useState } from 'react'
import { NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import { Content } from '../../assembly/main'
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
  const [loading, setLoading] = useState(false)
  const { query } = useRouter()
  
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

    const ct: Content[] = await contract.getPublicContents()
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

    setLoading(true)
    Router.push('/content/[slug]', `/content/${ct.slug}`)
  }

  return (
    <Layout home={false}>
      <h1 className="title">Public Content</h1>
      <p className="text-blue text-center text-xl mb-5">View all public content here.</p>

      {(!contract || !currentUser) && <div>Loading...</div>}
      
      {transactionHashes && (
        <Alert heading="Success!" transactionHashes={transactionHashes} />
      )}

      {contract && currentUser && !contractLoaded && !content.length && <LoadButton initFunction={init} />}
      
      {contract && contractLoaded && !content.length && (
        <div>
          No content
        </div>
      )}

      {contract && loading && (
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
