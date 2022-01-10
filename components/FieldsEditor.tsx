import { FieldTypesEditorProps } from "../types/components"

const FieldsEditor = ({ fields, setFields }: FieldTypesEditorProps) => {
  const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement>): void => {
    const newFields = [...fields]
    newFields[index].value = event.target.value
    setFields(newFields)
  }

  return (
    <div>
      {fields && fields.map((field, index) => {
        return (
          <div key={index}>
            <label htmlFor={`${field.name}-value`}>{field.name}</label>
            <input id={`${field.name}-value`} className="block px-3 py-2 mb-3 w-full" type="text" value={field.value} onChange={(e) => handleFieldChange(index, e)} />
          </div>
        )
      })}
    </div>
  )
}

export default FieldsEditor
