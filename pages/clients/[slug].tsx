import { NextPage } from "next"
import { useRouter } from "next/router"
import { useContext, useState, useEffect } from "react"
import Router from "next/router"
import { Client } from "../../assembly/main"
import { Role } from "../../assembly/model"
import { NearContext } from "../../context/NearContext"
import Link from "next/link"
import Layout from "../../components/Layout"
import LoadButton from "../../components/LoadButton"
import { validateClient } from "../../validators/client"
import Alert from "../../components/Alert"
import TextInput from "../../components/TextInput"

const EditClient: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [name, setName] = useState('')
  const [owner, setOwner] = useState('')
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [validationSummary, setValidationSummary] = useState<string[]>([])
  const [slugString, setSlugString] = useState('')

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    setSlugString(slug as string)
    if (!contract) {
      setContractedLoaded(false)
      return
    }

    init()
  }, [])

  const init = async (): Promise<void> => {
    if (!contract) {
      return
    }

    setContractedLoaded(true)
    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }

    const client: Client = await contract.getClient({ slug: slugString })
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

    const client: Client = await contract.getClient({ slug: slugString })
    if (!client) {
      return
    }

    const clientUpdate: Client = {...client, name, owner}
    const validationResult = validateClient(clientUpdate)
    if (!validationResult.isValid) {
      setValidationSummary(validationResult.validationMessages)
      return
    }

    await contract.setClient({
      args: { clientUpdate }, 
      callbackUrl: `${process.env.baseUrl}/clients/manage`,
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title mb-5">Edit Client</h1>
      {(!contract || !currentUser) && <div>Loading...</div>}

      {validationSummary.length > 0 && (
        <Alert heading="Error!" messages={validationSummary} />
      )}

      {contract && currentUser && !contractLoaded && <LoadButton initFunction={init} />}

      {currentUser && contract && contractLoaded && (
        <>
          <TextInput
            classes="block px-3 py-2 mb-3 w-1/2"
            for="name"
            label="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextInput
            classes="block px-3 py-2 mb-3 w-1/2"
            for="owner"
            label="Owner Address"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />

          <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Save Client</button>
          
          <Link href="/clients/manage">
            <a>Back</a>
          </Link>
        </>
      )}
    </Layout>
  )
}

export default EditClient
