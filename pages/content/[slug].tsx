import { useContext, useState, useEffect } from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import { Field, Content } from "../../assembly/main"
import FieldsEditor from "../../components/FieldsEditor"
import { NearContext } from "../../context/NearContext"
import { Role } from "../../assembly/model"
import { DbContext } from "../../context/DbContext"
import Layout from "../../components/Layout"
import LoadButton from "../../components/LoadButton"

const EditContent: NextPage = () => {
  const { db } = useContext(DbContext)
  const { contract, currentUser } = useContext(NearContext)
  const [name, setName] = useState('')
  const [fields, setFields] = useState<Field[]>([])
  const [isPublic, setIsPublic] = useState(false)
  const [currentContent, setCurrentContent] = useState<Content | null>(null)
  
  const router = useRouter()
  const { slug } = router.query
  
  const gunFields = db.get('content').get(`${slug}`).get('fields')

  useEffect(() => {
    init()
  }, [])
  
  const init = async (): Promise<void> => {
    if (!contract) {
      return
    }

    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }

    const ct: Content = await contract.getContent({ slug })
    setName(ct.name)
    setIsPublic(ct.isPublic)
    
    const savedFields: Field[] = []
    
    gunFields.map().on((data, id) => {
      const field: Field = {...data, id}
      savedFields.push(field)
    })

    setFields(savedFields)
    setCurrentContent(ct)
  }

  // TODO: Get update working right.
  const handleSubmit = (): void => {
    if (!contract) {
      return
    }
    
    const content: Content = { ...currentContent as Content, name, isPublic, updatedAt: new Date().toISOString() }
    fields.forEach(f => {
      const {id, ...fieldWithoutId} = f
      gunFields.get(f.id).put(fieldWithoutId)
    })

    contract.setContent({ content }).then(() => {
      Router.push('/content')
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title">Edit Your Content</h1>
      {contract && currentUser && !fields.length && <LoadButton initFunction={init} />}
      {currentUser && contract && fields && (
        <>
          <label htmlFor="name">Name</label>
          <input className="block px-3 py-2 mb-3 w-full" type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label htmlFor="fields">Fields</label>
          <FieldsEditor fields={fields} setFields={setFields} />

          <label className="block">
            Public?&nbsp;
            <input
              name="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(!isPublic)}
              />
          </label>

          <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Update</button>
        </>
      )}
      <Link href="/content">
        <a>Back</a>
      </Link>
    </Layout>
  )
}

export default EditContent
