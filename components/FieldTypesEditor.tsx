import { useState } from "react"
import { fieldTypeOptions } from "../assembly/model"
import { FieldTypesEditorProps } from "../types/components"

const FieldTypesEditor = ({ fields, setFields }: FieldTypesEditorProps) => {
  const [fieldType, setFieldType] = useState('String')
  const [fieldName, setFieldName] = useState('')
  
  const handleFieldNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFieldName(event.target.value)
  }

  const handleFieldTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setFieldType(event.target.value)
  }

  const handleAddField = (): void => {
    const newField = {
      name: fieldName,
      fieldType,
      value: ''
    }

    setFields([...fields, newField])
    setFieldName('')
    setFieldType('String')
  }

  return (
    <div>
      <input className="block px-3 py-2 mb-3 w-full" type="text" value={fieldName} onChange={(e) => handleFieldNameChange(e)} />
      <select className="block px-3 py-2 mb-3 w-full" onChange={(e) => handleFieldTypeChange(e)}>
        {fieldTypeOptions.map((key) => {
          return (
            <option value={key.value} key={key.value}>{key.label}</option>
          )
        })}
      </select>
      <button className="px-3 py-2 my-3 mr-3 x-4 border border-blue shadow-sm text-gray-light bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={handleAddField} disabled={!fieldName.length}>Add Field</button>
    </div>
  )
}

export default FieldTypesEditor
