import { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Router from 'next/router'
import Link from 'next/link'
import { ContentType, Field } from '../../assembly/main'
import { Role } from '../../assembly/model'
import Alert from '../../components/Alert'
import FieldTypesEditor from '../../components/FieldTypesEditor'
import Layout from '../../components/Layout'
import LoadButton from '../../components/LoadButton'
import { NearContext } from '../../context/NearContext'
import { validateContentType } from '../../validators/contentType'
import LoadingIndicator from '../../components/LoadingIndicator'

const NewContentType: NextPage = () => {
  const { contract, currentUser } = useContext(NearContext)
  const [contentTypeName, setContentTypeName] = useState('')
  const [fields, setFields] = useState<Field[]>([])
  const [contractLoaded, setContractedLoaded] = useState(false)
  const [validationSummary, setValidationSummary] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    init()
  }, [])
  
  const init = (): void => {
    if (!contract) {
      setContractedLoaded(false)
      return
    }

    setContractedLoaded(true)
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

    setLoading(true)
    const contentType: ContentType = {
      name: contentTypeName,
      fields,
    }

    const validationResult = validateContentType(contentType)
    if (!validationResult.isValid) {
      setValidationSummary(validationResult.validationMessages)
      setLoading(false)
      return
    }

    contract.setContentType({
      args: { contentType }, 
      callbackUrl: `${process.env.baseUrl}/contentTypes`,
    }).then(() => {
      Router.push('/contentTypes')
    })
  }

  return (
    <Layout home={false}>
      <h1 className="title mb-5">Create a Content Type</h1>
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
          <input className="block px-3 py-2 mb-5 w-1/2" type="text" value={contentTypeName} onChange={(e) => handleContentTypeNameChange(e)} />
          <h2>Fields</h2>
          <p className="text-blue text-sm mb-1">To add fields, enter a field name, select a field type, and click &apos;Add Field&apos;.</p>
          
          <div className="">
            {fields.map((field, index) => {
              return (
                <div key={`${field.name}-${index}`} className="block mb-3">
                  <p>{index + 1}. {field.name}: {field.fieldType} {field.required ? 'required' : ''} {field.maxLength ? `${field.maxLength} maximum` : ''} &nbsp;
                    <button className="bg-blue px-1" onClick={() => {handleDeleteField(index)}}>x</button>
                  </p>
                </div>
              )
            })}
            <FieldTypesEditor fields={fields} setFields={setFields} />
          </div>

          <button
            className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue"
            onClick={handleSubmit}
            disabled={!contentTypeName.length || !fields.length}
          >
            Submit
          </button>

          <Link href="/contentTypes">
            <a>Back</a>
          </Link>
        </>
      )}
    </Layout>
  )
}

export default NewContentType
