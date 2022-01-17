import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Router from 'next/router'
import Link from 'next/link'
import { ContentType, Field } from '../../assembly/main'
import FieldTypesEditor from '../../components/FieldTypesEditor'
import { NearContext } from '../../context/NearContext'
import { Role } from '../../assembly/model'
import Layout from '../../components/Layout'

const NewContentType: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [contentTypeName, setContentTypeName] = useState('')
  const [fields, setFields] = useState<Field[]>([])

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
  
  const init = (): void => {
    if (!currentUser || currentUser.role !== Role.Admin) {
      Router.push('/')
    }
  }

  const handleContentTypeNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setContentTypeName(event.target.value)
  }

  const handleDeleteField = (index: number): void => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  }

  const handleSubmit = (): void => {
    if (!contract) {
      return
    }

    const contentType: ContentType = {
      name: contentTypeName,
      fields,
    }

    contract.setContentType({ contentType }).then(() => {
      Router.push('/contentTypes')
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title">Create a Content Type</h1>

      <input className="block px-3 py-2 mb-3 w-full" type="text" value={contentTypeName} onChange={(e) => handleContentTypeNameChange(e)} />
      <h2>Fields</h2>
      <div className="flex flex-wrap">
        {fields.map((field, index) => {
          return (
            <div key={`${field.name}-${index}`}>
              <p>{index}. {field.name} {field.fieldType}
                <button onClick={() => {handleDeleteField(index)}}>x</button>
              </p>
            </div>
          )
        })}
      </div>
      <FieldTypesEditor fields={fields} setFields={setFields} />

      <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleSubmit}>Submit</button>
      <Link href="/contentTypes">
        <a>Back</a>
      </Link>
    </Layout>
  )
}

export default NewContentType