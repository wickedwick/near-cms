import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import { UserRole } from '../../assembly/main'
import { Role, roleOptions } from '../../assembly/model'
import { NearContext } from '../../context/NearContext'

const ManageUsers: NextPage = () => {
  const { contract } = useContext(NearContext)
  const [accountId, setAccountId] = useState('')
  const [role, setRole] = useState<number>(Role.Public)
  const [users, setUsers] = useState<UserRole[]>([])
  const [validationSummary, setValidationSummary] = useState<string>([])

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

    contract.getUsers().then((userRoles: UserRole[]) => {
      setUsers(userRoles)
    })
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

    await contract.setUser({ user: { accountId, balance: '0' }, role })
    Router.push('/users')
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Manage Users</h1>
        <a href="/">Back to dashboard</a>
        {validationSummary && <p>{validationSummary}</p>}
        <table>
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{roleOptions[user.role].label}</td>
                <td>
                  <button>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <label htmlFor="accountId">Account ID</label>
        <input className="block px-3 py-2 mb-3 w-full" type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
        <select className="block px-3 py-2 mb-3 w-full" value={role} onChange={(e) => setRole(parseInt(e.target.value, 10))}>
          {roleOptions.map((key) => {
            return (
              <option value={key.value} key={key.value}>{key.label}</option>
            )
          })}
        </select>
        <button className="block px-3 py-2 mb-3 w-full" onClick={handleSubmit}>Add User</button>
      </main>
    </div>
  )
}

export default ManageUsers
