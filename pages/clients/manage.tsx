import { nanoid } from 'nanoid'
import { NextPage } from 'next'
import Router from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Client } from '../../assembly/main'
import { Role } from '../../assembly/model'
import Alert from '../../components/Alert'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import { DbContext } from '../../context/DbContext'
import { NearContext } from '../../context/NearContext'
import { validateClient } from '../../validators/client'

const ManageClients: NextPage = () => {
  const { db } = useContext(DbContext)
  const { contract, currentUser } = useContext(NearContext)
  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [displayKey, setDisplayKey] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState<string>('')
  const [validationSummary, setValidationSummary] = useState<string[]>([])

  useEffect(() => {
    setTransactionHashes(Router.query.transactionHashes as string)
    init()
  }, [])

  const init = (): void => {
    if (!contract) {
      setContractedLoaded(false)
      return
    }
  
    setContractedLoaded(true)
    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }
  
    contract.getClients().then((clients: Client[]) => {
      setClients(clients)
    })
  }

  const editClient = async (client: Client): Promise<void> => {
    if (!contract) {
      return
    }

    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }

    Router.push('/clients/[slug]', `/clients/${client.slug}`)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!contract) {
      return
    }

    const client: Client = {
      slug: nanoid(),
      name,
      owner
    }

    const validationResult = validateClient(client)
    if (!validationResult.isValid) {
      setValidationSummary(validationResult.validationMessages)
      return
    }

    handleSetApiKey(client)
    await contract.setClient({
      args: { clientUpdate: client }, 
      callbackUrl: `${process.env.baseUrl}/clients/manage`,
    })
  }

  const handleSetApiKey = async (client: Client): Promise<void> => {
    db.get('client').get(`${client.slug}`).get('apiKey').put(nanoid(32))
  }

  const handleShowModal = (client: Client): void => {
    db.get('client').get(`${client.slug}`).get('apiKey').on((data: string) => {
      setDisplayKey(data)
      setModalOpen(true)

      setTimeout(() => {
        setModalOpen(false)
      }, 5000)
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title mb-5">Manage Clients</h1>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>API Key</h2>
              <p>{displayKey}</p>
            </div>
          </div>
        </div>
      )}

      {(!contract || !currentUser) && <div>Loading...</div>}

      {validationSummary.length > 0 && (
        <Alert heading="Error!" messages={validationSummary} />
      )}

      {transactionHashes && (
        <Alert heading="Success!" transactionHashes={transactionHashes} />
      )}

      {contract && currentUser && !contractLoaded && <LoadButton initFunction={init} />}
      
      {contract && contractLoaded && !clients.length && (
        <div>
          No clients.
        </div>
      )}
      
      {contract && contractLoaded && clients.length > 0 && (
        <table className="table-auto min-w-full divide-y divide-gray">
          <thead className="bg-gray">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Actions</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Client ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Owner</th>
            </tr>
          </thead>
          <tbody className="bg-gray-medium text-gray">
            {clients.map((client, index) => (
              <tr key={client.slug} className={index % 2 === 0 ? 'bg-gray-light' : ''}>
                <td>
                  <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue bg-blue shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => editClient(client)}>Edit</button>
                  <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => handleSetApiKey(client)}>Regenerate</button>
                  <button className="px-3 py-2 my-3 mr-3 x-4 border border-yellow shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => handleShowModal(client)}>Key</button>
                </td>
                <td>{client.slug}</td>
                <td>{client.name}</td>
                <td>{client.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <div className="my-3">
        <label htmlFor="name">Client Name</label>
        <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="owner">Owner Address</label>
        <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={owner} onChange={(e) => setOwner(e.target.value)} />

        <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Add Client</button>
      </div>
    </Layout>
  )
}

export default ManageClients
