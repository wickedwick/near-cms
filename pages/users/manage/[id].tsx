import { NextPage } from "next"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import { useContext, useState, useEffect } from "react"
import { UserRole } from "../../../assembly/main"
import { Role, roleOptions } from "../../../assembly/model"
import Alert from "../../../components/Alert"
import Layout from "../../../components/Layout"
import LoadButton from "../../../components/LoadButton"
import { NearContext } from "../../../context/NearContext"

const EditUserRole: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [role, setRole] = useState<number>(Role.Public)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [validationSummary, setValidationSummary] = useState<string[]>([])
  const [contractLoaded, setContractedLoaded] = useState(false)
  
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    init()
  }, [])

  const init = async (): Promise<void> => {
    if (!contract) {
      setContractedLoaded(false)
      return
    }
    
    setContractedLoaded(true)
    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }

    const userRole: UserRole = await contract.getUserRole({ name: id })
    setUserRole(userRole)
    setRole(userRole.role)
  }

  const handleSubmit = async (): Promise<void> => {
    setValidationSummary([])

    if (!contract) {
      const valSummary = [...validationSummary]
      valSummary.push('Contract is not loaded')
      setValidationSummary(valSummary)
      return
    }

    Router.push('/users/manage')
  }

  return (
    <Layout home={false}>
      <h1 className="title mb-5">Update Role for {userRole?.username}</h1>
      
      {(!contract || !currentUser) && <div>Loading...</div>}

      {contract && currentUser && !contractLoaded && <LoadButton initFunction={init} />}
      
      {validationSummary.length > 0 && (
        <Alert heading="Error!" messages={validationSummary} />
      )}

      {contract && contractLoaded && (
        <>
          <select className="block px-3 py-2 mb-3 w-1/2" value={role} onChange={(e) => setRole(parseInt(e.target.value, 10))}>
            {roleOptions.map((key) => {
              return (
                <option value={key.value} key={key.value}>{key.label}</option>
                )
              })}
          </select>
          <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Add User</button>
        </>
      )}

      <Link href="/users/manage">
        <a>Back</a>
      </Link>
    </Layout>
  )
}

export default EditUserRole
