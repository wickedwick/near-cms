import { gql } from '@apollo/client';
import { NextPage } from 'next'
import Router from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Role } from '../../assembly/model'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import { NearContext } from '../../context/NearContext'
import client from '../../services/apollo'
import { ActionKind, Receipt } from '../../types/app'

const AnalyticsIndex: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [contractLoaded, setContractLoaded] = useState(false)
  const [skip, setSkip] = useState(0)
  const [first, setFirst] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    init()
  }, [])
  
  const previousPage = async (): Promise<void> => {
    if (skip <= 0) {
      return
    }

    const newSkip = skip - first
    setSkip(newSkip)
    await getReceipts()
  }
  
  const nextPage = async (): Promise<void> => {
    if (skip + first >= total) {
      return
    }

    const newSkip = skip + first
    setSkip(newSkip)
    await getReceipts()
  }

  const getReceiptsTotal = async (): Promise<void> => {
    const { data } = await client.query({
      query: gql`
        query Receipts {
          receipts(rderBy:id) {
            id
          }
        }
      `,
    })

    setTotal(data.receipts.length)
  }

  const getReceipts = async (): Promise<void> => {
    const { data } = await client.query({
      query: gql`
        query Receipts {
          receipts(orderBy:timestamp, orderDirection:desc, skip:${skip}, first:${first}) {
            id
            kind
            signerId
            data
            timestamp
            functionName
          }
        }
      `,
    })

    setReceipts(data.receipts)
    await getReceiptsTotal()
  }

  const init = async (): Promise<void> => {
    if (!contract) {
      return
    }

    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }

    setContractLoaded(true)
    await getReceipts()
  }

  return (
    <Layout home={false}>
      <h1 className="title">Transaction History</h1>
      <p className="text-blue text-center text-xl mb-5">Powered by The Graph.</p>

      {!contract && <div>Loading...</div>}
      {contract && !contractLoaded && <LoadButton initFunction={init} />}
      
      {contract && contractLoaded && !receipts.length && (
        <div>
          No receipts.
        </div>
      )}
      
      {contract && contractLoaded && receipts.length > 0 && (
        <>
          <table className="table-auto min-w-full divide-y divide-gray">
            <thead className="bg-gray">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Action Kind</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Signer ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Function Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-gray-medium text-gray">
              {receipts.map((receipt, index) => (
                <tr key={receipt.timestamp} className={index % 2 === 0 ? 'bg-gray-light' : ''}>
                  <td className="px-6 py-3">{ActionKind[receipt.kind]}</td>
                  <td>{receipt.signerId}</td>
                  <td>{receipt.functionName}</td>
                  <td>{new Date(Math.floor(receipt.timestamp/1000/1000)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={previousPage}>&lt;</button>
          <p className="inline mr-3">Showing {skip + 1} - {skip + first} of {total}</p>
          <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={nextPage}>&gt;</button>
        </>
      )}
    </Layout>
  )
}

export default AnalyticsIndex
