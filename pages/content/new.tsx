import { useContext, useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import type { NextPage } from 'next'
import Link from 'next/link'
import Router from 'next/router'
import { Content, ContentType, Field } from '../../assembly/main'
import FieldsEditor from '../../components/FieldsEditor'
import { NearContext } from '../../context/NearContext'
import { Role } from '../../assembly/model'
import { DbContext } from '../../context/DbContext'
import Layout from '../../components/Layout'
import { SEA } from 'gun'
import LoadButton from '../../components/LoadButton'
import { validateContent } from '../../validators/content'
import Alert from '../../components/Alert'
import LoadingIndicator from '../../components/LoadingIndicator'

const NewField: NextPage = () => {
  const { db } = useContext(DbContext)
  const { contract, currentUser } = useContext(NearContext)
  const [name, setName] = useState('')
  const [fields, setFields] = useState<Field[]>([])
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [selectedContentType, setSelectedContentType] = useState<ContentType>()
  const [isPublic, setIsPublic] = useState(false)
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [validationSummary, setValidationSummary] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

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

    const ct = await contract.getContentTypes()
    setContentTypes(ct)
    setSelectedContentType(ct[0])
    setFields(ct[0].fields)
  }

  const handleSelectContentType = (name: string): void => {
    const contentType = contentTypes.find(ct => ct.name === name)

    if (!contentType) {
      return
    }

    setSelectedContentType(contentType)
    setFields(contentType.fields)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!contract) {
      return
    }

    setLoading(true)
    if (selectedContentType) {
      selectedContentType.fields = selectedContentType.fields.map(f => {
        return { ...f, value: '' }
      })
    }

    const slug = nanoid()
    const content: Content = {
      name,
      slug,
      type: selectedContentType as ContentType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic,
      isEncrypted,
    }

    const validationResult = validateContent(content, fields)
    if (!validationResult.isValid) {
      setValidationSummary(validationResult.validationMessages)
      setLoading(false)
      return
    }

    fields.forEach(async f => {
      let newField = { ...f }
      if (content.isEncrypted) {
        newField.value = await SEA.encrypt(f.value, 'xgzSmRn5XJcJJefH')
      }

      db.get('content').get(`${slug}`).get('fields').set(newField)
    })

    await contract.setContent({
      args: { content }, 
      callbackUrl: `${process.env.baseUrl}/content`,
    })

    Router.push('/content')
  }

  return (
    <Layout home={false}>
      <h1 className="title mb-5">Create Some Content</h1>
      {(!contract || !currentUser) && <div>Loading...</div>}

      {validationSummary.length > 0 && (
        <Alert heading="Error!" messages={validationSummary} />
      )}

      {contract && currentUser && !contractLoaded && <LoadButton initFunction={init} />}

      {contract && loading && (
        <LoadingIndicator />
      )}

      {contract && contractLoaded && (
        <>
          <label htmlFor="name">Name</label>
          <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          
          <label htmlFor="type">Content Type</label>
          <select className="block px-3 py-2 mb-3 w-1/2" value={selectedContentType?.name} onChange={(e) => handleSelectContentType(e.target.value)}>
            {contentTypes.map((ct) => {
              return (
                <option key={ct.name} value={ct.name}>{ct.name}</option>
                )
              })}
          </select>
          
          {fields && (
            <>
              <FieldsEditor fields={fields} setFields={setFields} />
            </>
          )}
          
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

          <label className="block py-2">
            Encrypt?&nbsp;
            <input
              className='ml-2'
              name="isEncrypted"
              type="checkbox"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(!isEncrypted)}
              />
          </label>

          <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Create</button>
          <Link href="/content">
            <a className="">Back</a>
          </Link>
        </>
      )}
    </Layout>
  )
}

export default NewField
