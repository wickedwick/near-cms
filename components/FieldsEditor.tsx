import { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Media } from '../assembly/main'
import MediaModal from './MediaModal'
import { FieldTypesEditorProps } from '../types/components'

import "react-datepicker/dist/react-datepicker.css"

const FieldsEditor = ({ fields, setFields }: FieldTypesEditorProps) => {
  const editorRef = useRef<{ CKEditor: any; ClassicEditor: any; }>()
  const [editorLoaded, setEditorLoaded] = useState(false)
  const { CKEditor, ClassicEditor } = editorRef.current || { CKEditor: null, ClassicEditor: null }
  const [showMediaModal, setShowMediaModal] = useState(false)

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    }
    setEditorLoaded(true)
  }, [])

  const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement>): void => {
    const newFields = [...fields]
    newFields[index].value = event.target.value
    setFields(newFields)
  }

  const handleMediaChange = (index: number, media: Media): void => {
    const newFields = [...fields]
    newFields[index].value = media.slug
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
              <DatePicker className="mb-3 px-3 py-2" selected={field.value ? new Date(field.value) : null} onChange={(date) => handleFieldChange(index, { target: { value: date.toISOString() } })} />
            )}

            {field.fieldType.toLowerCase() === 'image' && (
              <>
                {field.value && (
                  <p>File {field.value}</p>
                )}
                <button className="block px-3 py-2 mb-3 bg-blue text-gray-light hover:text-gray-light focus:outline-none focus:text-gray-dark transition ease-in-out duration-150" onClick={() => setShowMediaModal(true)}>Select Image</button>
                {showMediaModal && (
                  <MediaModal mediaType={'image'} setSelectedMedia={handleMediaChange} onClose={() => setShowMediaModal(false)} index={index} />
                )}
              </>
            )}

            {field.fieldType.toLowerCase() === 'richtext' && (
              <div className="mb-3">
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value}
                  onChange={( event, editor ) => {
                    const data = editor.getData()
                    handleFieldChange(index, { target: { value: data } })
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default FieldsEditor
