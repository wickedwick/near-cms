import { useEffect, useRef, useState } from "react";
// import { CKEditor } from '@ckeditor/ckeditor5-react'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import DatePicker from "react-datepicker";
import { FieldTypesEditorProps } from "../types/components"

import "react-datepicker/dist/react-datepicker.css";

const FieldsEditor = ({ fields, setFields }: FieldTypesEditorProps) => {
  const editorRef = useRef()
  const [editorLoaded, setEditorLoaded] = useState(false)
  const { CKEditor, ClassicEditor } = editorRef.current || { CKEditor: null, ClassicEditor: null }

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    }
    setEditorLoaded(true)
  }, [])

  console.log('FieldsEditor', fields)
  const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement>): void => {
    const newFields = [...fields]
    newFields[index].value = event.target.value
    setFields(newFields)
  }

  return (
    <div>
      {editorLoaded && fields && fields.map((field, index) => {
        return (
          <div key={index}>
            <label htmlFor={`${field.name}-value`}>{field.name}</label>
            {field.fieldType.toLowerCase() === 'string' && (
              <input
                id={`${field.name}-value`}
                className="block px-3 py-2 mb-3 w-full"
                type="text" value={field.value}
                onChange={(e) => handleFieldChange(index, e)}
              />
            )}

            {(field.fieldType.toLowerCase() === 'date' || field.fieldType.toLowerCase() === 'datetime') && (
              <DatePicker selected={field.value ? new Date(field.value) : null} onChange={(date) => handleFieldChange(index, { target: { value: date.toISOString() } })} />
            )}

            {field.fieldType.toLowerCase() === 'richtext' && (
              <CKEditor
                editor={ClassicEditor}
                data={field.value}
                onChange={( event, editor ) => {
                  const data = editor.getData();
                  handleFieldChange(index, { target: { value: data } })
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default FieldsEditor
