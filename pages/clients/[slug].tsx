import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useState, useEffect } from "react"
import Router from "next/router"
import { Client } from "../../assembly/main"
import { Role } from "../../assembly/model"
import { DbContext } from "../../context/DbContext"
import { NearContext } from "../../context/NearContext"
import Link from "next/link"
import Layout from "../../components/Layout"

const EditClient: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    if (!contract) {
      setTimeout(() => {
        init()
      }, 5000)

      return
    }

    init()
  }, [])

  const init = async (): Promise<void> => {
    if (!contract) {
      return
    }

    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }

    const client: Client = await contract.getClient({ slug })
    setName(client.name)
    setOwner(client.owner)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!contract) {
      return
    }

    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }

    const client: Client = await contract.getClient({ slug })
    if (!client) {
      return
    }

    const clientUpdate: Client = {...client, name, owner}
    await contract.setClient(clientUpdate)
    Router.push('/clients/manage')
  }

  return (
    <Layout home={false}>
      <h1 className="title">Edit Client</h1>

      <label htmlFor="name">Client Name</label>
      <input className="block px-3 py-2 mb-3 w-full" type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label htmlFor="owner">Owner Address</label>
      <input className="block px-3 py-2 mb-3 w-full" type="text" value={owner} onChange={(e) => setOwner(e.target.value)} />

      <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Add User</button>
      <Link href="/clients/manage">
        <a>Back</a>
      </Link>
    </Layout>
  )
}

export default EditClient
