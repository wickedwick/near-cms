import { useContext, useState, useEffect } from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router, { useRouter } from "next/router"
import { Field, Content, ContentType } from "../../assembly/main"
import FieldsEditor from "../../components/FieldsEditor"
import { NearContext } from "../../context/NearContext"
import { get, put } from "../../services/db"
import { Role } from "../../assembly/model"
import { DbContext } from "../../context/DbContext"
import Layout from "../../components/Layout"

const EditContent: NextPage = () => {
  const { db } = useContext(DbContext)
  const { contract, currentUser } = useContext(NearContext)
  const [name, setName] = useState('')
  const [fields, setFields] = useState<Field[]>([])
  const [isPublic, setIsPublic] = useState(false)
  const [currentContent, setCurrentContent] = useState<Content | null>(null)
  
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    if (!contract) {
      setTimeout(() => {
        init
      }
      , 5000)

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

    const ct: Content = await contract.getContent({ slug })
    setName(ct.name)
    setIsPublic(ct.isPublic)
    
    console.log('content', ct)
    const contentType: ContentType = await contract.getContentType({ name: ct.type.name })
    const savedFields: Field[] = []
    
    contentType.fields.forEach(f => {
      db.get('content').get(`${ct.slug}`).get('fields').get(`${f.name}`).on(data => {
        savedFields.push(data)
      })
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
      db.get('content').get(`${slug}`).get('fields').get(`${f.name}`).put(f)
    })

    contract.setContent({ content }).then(() => {
      Router.push('/content')
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title">Edit Your Content</h1>
      <label htmlFor="name">Name</label>
      <input className="block px-3 py-2 mb-3 w-full" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      
      {fields && (
        <>
          <label htmlFor="fields">Fields</label>
          <FieldsEditor fields={fields} setFields={setFields} />
        </>
      )}

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
      <Link href="/content">
        <a>Back</a>
      </Link>
    </Layout>
  )
}

export default EditContent
