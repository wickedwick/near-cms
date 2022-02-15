import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Router from 'next/router'
import { UserRole } from '../../assembly/main'
import { Role, roleOptions } from '../../assembly/model'
import { NearContext } from '../../context/NearContext'
import { nanoid } from 'nanoid'
import { DbContext } from '../../context/DbContext'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import Alert from '../../components/Alert'
import { validateUserRole } from '../../validators/user'

const ManageUsers: NextPage = () => {
  const { db } = useContext(DbContext)
  const { contract, currentUser } = useContext(NearContext)
  const [accountId, setAccountId] = useState('')
  const [role, setRole] = useState<number>(Role.Public)
  const [users, setUsers] = useState<UserRole[]>([])
  const [validationSummary, setValidationSummary] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [displayKey, setDisplayKey] = useState('')
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState<string>('')

  useEffect(() => {
    setTransactionHashes(Router.query.transactionHashes as string)
    init()
  }, [])

  const init = async (): Promise<void> => {
    if (!contract) {
      setContractedLoaded(false)
      return
    }

    setContractedLoaded(true)
    // if (!currentUser || currentUser.role !== Role.Admin) {
    //   Router.push('/')
    // }

    const userRoles = await contract.getUsers()
    setUsers(userRoles)
  }

  const editUserRole = (userRole: UserRole): void => {
    if (!contract) {
      return
    }

    Router.push('/users/manage/[id]', `/users/manage/${userRole.username}`)
  }

  const handleSubmit = async (): Promise<void> => {
    setValidationSummary([])
    const valSummary = [...validationSummary]

    if (!contract) {
      valSummary.push('Contract is not loaded')
      setValidationSummary(valSummary)
      return
    }

    const user = await contract.getUser({ username: accountId })
    if (user) {
      valSummary.push('User already exists')
      setValidationSummary(valSummary)
      return
    }

    const userRole: UserRole = {
      username: accountId,
      role 
    }
    
    const validationResult = validateUserRole(userRole)
    if (!validationResult.isValid) {
      setValidationSummary(validationResult.validationMessages)
      return
    }

    handleSetApiKey(user)
    await contract.setUserRole({ role: userRole })
  }

  const handleSetApiKey = async (userRole: UserRole): Promise<void> => {
    db.get(`${userRole.username}`).get('apiKey').put(nanoid(32))
  }

  const handleShowModal = (userRole: UserRole): void => {
    db.get(`${userRole.username}`).get('apiKey').on((data: string) => {
      setDisplayKey(data)
      setModalOpen(true)

      setTimeout(() => {
        setModalOpen(false)
      }, 5000)
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title mb-3">Manage Users</h1>

      {validationSummary.length > 0 && (
        <Alert heading="Error!" messages={validationSummary} />
      )}

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

      {transactionHashes && (
        <Alert heading="Success!" transactionHashes={transactionHashes} />
      )}

      {contract && !contractLoaded && <LoadButton initFunction={init} />}
      {contract && contractLoaded && users.length > 0 && (
        <table className="table-auto min-w-full divide-y divide-gray">
          <thead className="bg-gray">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Actions</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Account ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-light uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-gray-medium text-gray">
            {users.map((user, index) => (
              <tr key={user.username} className={index % 2 === 0 ? 'bg-gray-light' : ''}>
                <td>
                  <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue bg-blue shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => editUserRole(user)}>Edit</button>
                  <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => handleSetApiKey(user)}>Regenerate</button>
                  <button className="px-3 py-2 my-3 x-4 border border-yellow shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => handleShowModal(user)}>Key</button>
                </td>
                <td>{user.username}</td>
                <td>{roleOptions[user.role].label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {contract && contractLoaded && (
        <>
          <hr />
          <div className="mb-3 mt-5">
            <h3 className="text-xl">Add a new user</h3>
            <label htmlFor="accountId">Account ID</label>
            <input className="block px-3 py-2 mb-3 w-full" type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
            <select className="block px-3 py-2 mb-3 w-full" value={role} onChange={(e) => setRole(parseInt(e.target.value, 10))}>
              {roleOptions.map((key) => {
                return (
                  <option value={key.value} key={key.value}>{key.label}</option>
                  )
                })}
            </select>
            <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Add User</button>
          </div>
        </>
      )}
    </Layout>
  )
}

export default ManageUsers
