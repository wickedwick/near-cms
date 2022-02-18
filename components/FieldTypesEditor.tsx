import { useState } from "react"
import { fieldTypeOptions } from "../assembly/model"
import { FieldTypesEditorProps } from "../types/components"

const FieldTypesEditor = ({ fields, setFields }: FieldTypesEditorProps) => {
  const [fieldType, setFieldType] = useState('String')
  const [fieldName, setFieldName] = useState('')
  const [required, setRequired] = useState(false)
  const [length, setLength] = useState('')
  
  const handleAddField = (): void => {
    const newField = {
      name: fieldName,
      fieldType,
      value: '',
      required,
      maxLength: length
    }

    setFields([...fields, newField])
    setFieldName('')
    setFieldType('String')
    setRequired(false)
    setLength('')
  }

  return (
    <div className="border border-white p-5">
      <label htmlFor="fieldName">Field Name</label>
      <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
      
      <label htmlFor="fieldType">Field Type</label>
      <select className="block px-3 py-2 mb-3 w-1/2" onChange={(e) => setFieldType(e.target.value)}>
        {fieldTypeOptions.map((key) => {
          return (
            <option value={key.value} key={key.value}>{key.label}</option>
          )
        })}
      </select>

      {(fieldType === 'String' || fieldType === 'Int' || fieldType === 'Float') && (
        <>
          <label htmlFor="fieldName">Max Length (optional)</label>
          <input className="block px-3 py-2 mb-3 w-1/2" type="text" value={length} onChange={(e) => setLength(e.target.value)} />
        </>
      )}
      
      <label className="block py-2">
        Required?&nbsp;
        <input
          className='ml-2'
          name="isEncrypted"
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(!required)}
          />
      </label>
      <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleAddField} disabled={!fieldName.length}>Add Field</button>
    </div>
  )
}

export default FieldTypesEditor
