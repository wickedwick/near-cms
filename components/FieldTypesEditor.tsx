import { useState } from "react"
import { Fieldtype, fieldTypeOptions } from "../assembly/model"
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
      <button className="block px-3 py-2 mb-3 w-full" onClick={handleAddField}>Add Field</button>
    </div>
  )
}

export default FieldTypesEditor
