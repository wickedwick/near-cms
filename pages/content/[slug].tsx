import { useContext, useState, useEffect } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { Field, Content } from '../../assembly/main'
import FieldsEditor from '../../components/FieldsEditor'
import { NearContext } from '../../context/NearContext'
import { Role } from '../../assembly/model'
import { DbContext } from '../../context/DbContext'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import { SEA } from 'gun'
import Alert from '../../components/Alert'
import { validateContent } from '../../validators/content'

const EditContent: NextPage = () => {
  const { db } = useContext(DbContext)
  const { contract, currentUser } = useContext(NearContext)
  const [name, setName] = useState('')
  const [fields, setFields] = useState<Field[]>([])
  const [isPublic, setIsPublic] = useState(false)
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [currentContent, setCurrentContent] = useState<Content | null>(null)
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [validationSummary, setValidationSummary] = useState<string[]>([])
  
  const router = useRouter()
  const { slug } = router.query
  
  const gunFields = db.get('content').get(`${slug}`).get('fields')

  useEffect(() => {
    init()
  }, [])
  
  const init = async (): Promise<void> => {
    if (!contract) {
      setContractedLoaded(false)
      return
    }

    setContractedLoaded(true)
    if (!currentUser || currentUser.role > Role.Editor) {
      Router.push('/')
    }

    const ct: Content = await contract.getContent({ slug })
    setName(ct.name)
    setIsPublic(ct.isPublic)
    setIsEncrypted(ct.isEncrypted)
    
    let savedFields: Field[] = []

    await gunFields.map().on(async (data, id) => {
      let field: Field = {...data, id}
      
      if (ct.isEncrypted) {
        field.value = await SEA.decrypt(field.value, 'xgzSmRn5XJcJJefH') as string
      }

      savedFields.push(field)
    })

    savedFields = savedFields.filter((f, index) => {
      const firstField = savedFields.find((f2) => f.name === f2.name && f.value === f.value) as Field
      return savedFields.indexOf(firstField) === index
    })

    setFields(savedFields)
    setCurrentContent(ct)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!contract) {
      return
    }
    
    const content: Content = { ...currentContent as Content, name, isPublic, isEncrypted, updatedAt: new Date().toISOString() }
    
    const validationResult = validateContent(content, fields)
    if (!validationResult.isValid) {
      setValidationSummary(validationResult.validationMessages)
      return
    }

    fields.forEach(async (f) => {
      if (content.isEncrypted) {
        f.value = await SEA.encrypt(f.value, 'xgzSmRn5XJcJJefH')
      }
      
      db.get('content').get(`${slug}`).get('fields').get(f.id).get('value').put(f)
    })

    await contract.setContent({
      args: { content }, 
      callbackUrl: `${process.env.baseUrl}/content`,
    })

    Router.push('/content')
  }

  return (
    <Layout home={false}>
      <h1 className="title">Edit Your Content</h1>
      {!contract && <div>Loading...</div>}

      {validationSummary.length > 0 && (
        <Alert heading="Error!" messages={validationSummary} />
      )}

      {contract && !contractLoaded && !fields.length && <LoadButton initFunction={init} />}
      {contract && contractLoaded && fields.length && (
        <>
          <label htmlFor="name">Name</label>
          <input className="block px-3 py-2 mb-3 w-full" type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <FieldsEditor fields={fields} setFields={setFields} />

          <label className="block">
            Public?&nbsp;
            <input
              className='ml-2'
              name="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(!isPublic)}
              />
          </label>

          <label className="block">
            Encrypt?&nbsp;
            <input
              className='ml-2'
              name="isEncrypted"
              type="checkbox"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(!isEncrypted)}
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
