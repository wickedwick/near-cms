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

const ManageUsers: NextPage = () => {
  const { db } = useContext(DbContext)
  const { contract, currentUser } = useContext(NearContext)
  const [accountId, setAccountId] = useState('')
  const [role, setRole] = useState<number>(Role.Public)
  const [users, setUsers] = useState<UserRole[]>([])
  const [validationSummary, setValidationSummary] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [displayKey, setDisplayKey] = useState('')

  useEffect(() => {
    if (!contract) {
      setTimeout(() => {
        init()
      }, 5000)

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

    contract.getUsers().then((userRoles: UserRole[]) => {
      setUsers(userRoles)
    })
  }

  const editUserRole = (userRole: UserRole): void => {
    if (!contract) {
      return
    }

    Router.push('/users/manage/[id]', `/users/manage/${userRole.username}`)
  }

  const handleSubmit = async (): Promise<void> => {
    setValidationSummary('')

    if (!contract) {
      setValidationSummary('Contract is not available')
      return
    }

    const user = await contract.getUser({ username: accountId })
    if (user) {
      setValidationSummary('User already exists')
      return
    }

    const userRole: UserRole = {
      username: accountId,
      role 
    }
    
    await contract.setUser(userRole)
    handleSetApiKey(user)
    setUsers([...users, userRole])
  }

  const handleSetApiKey = async (userRole: UserRole): Promise<void> => {
    db.get(`${userRole.username}`).get('apiKey').put(nanoid(32))
  }

  const handleShowModal = (userRole: UserRole): void => {
    db.get(`${userRole.username}`).get('apiKey').on(data => {
      setDisplayKey(data)
      setModalOpen(true)

      setTimeout(() => {
        setModalOpen(false)
      }, 5000)
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title">Manage Users</h1>

      {validationSummary && <p>{validationSummary}</p>}
      
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

      {contract && !users.length && <LoadButton initFunction={init} />}
      {contract && users.length > 0 && (
        <table className="my-3">
          <thead>
            <tr>
              <th>Actions</th>
              <th>Account ID</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username}>
                <td>
                  <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue bg-blue shadow-sm text-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => editUserRole(user)}>Edit</button>
                  <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => handleSetApiKey(user)}>Regenerate</button>
                  <button className="px-3 py-2 my-3 x-4 border border-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => handleShowModal(user)}>Key</button>
                </td>
                <td>{user.username}</td>
                <td>{roleOptions[user.role].label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <hr />
      <div className="my-3">
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
    </Layout>
  )
}

export default ManageUsers
