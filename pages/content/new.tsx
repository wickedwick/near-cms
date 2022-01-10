import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { NearContext } from '../../context/NearContext'
import { Content, ContentType, Field } from '../../assembly/main'
import Router from 'next/router'
import Link from 'next/link'
import FieldsEditor from '../../components/FieldsEditor'

const NewField: NextPage = () => {
  const { contract, currentUser, nearConfig, wallet, setCurrentUser } = useContext(NearContext)
  const [name, setName] = useState('')
  const [fields, setFields] = useState<Field[]>([])
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [selectedContentType, setSelectedContentType] = useState<ContentType>()

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
  
  const init = () => {
    if (!contract) {
      return
    }

    contract.getContentTypes().then((ct: ContentType[]) => {
      setContentTypes(ct)
    })
  }

  const handleSelectContentType = (name: string): void => {
    const contentType = contentTypes.find(ct => ct.name === name)

    if (!contentType) {
      return
    }

    setSelectedContentType(contentType)
    setFields(contentType.fields)
  }

  const handleSubmit = (): void => {
    if (!contract) {
      return
    }

    const content: Content = {
      name,
      fields,
      slug: '', // TODO: slugify name
      type: selectedContentType as ContentType,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    contract.setContent({ content }).then(() => {
      Router.push('/content')
    })
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Create some content</h1>
        <label htmlFor="name">Name</label>
        <input className="block px-3 py-2 mb-3 w-full" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        
        <label htmlFor="type">Content Type</label>
        <select className="block px-3 py-2 mb-3 w-full" value={selectedContentType?.name} onChange={(e) => handleSelectContentType(e.target.value)}>
          {contentTypes.map((ct) => {
            return (
              <option key={ct.name} value={ct.name}>{ct.name}</option>
            )
          })}
        </select>
        
        {fields && (
          <>
            <label htmlFor="fields">Fields</label>
            <FieldsEditor fields={fields} setFields={setFields} />
          </>
        )}
        
        <button className="block px-3 py-2 m-3 x-4 border border-green shadow-sm text-gray-light bg-green hover:bg-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green" onClick={handleSubmit}>Create</button>
        <Link href="/content">
          <a className="block">Back</a>
        </Link>
      </main>
    </div>
  )
}

export default NewField
