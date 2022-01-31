import { SchemaModalProps } from "../types/components"

const SchemaModal = ({ contentType, setContentType }: SchemaModalProps): JSX.Element => {
  return (
    <>
      {contentType && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white text-gray-dark px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="modal">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2 className="text-lg font-bold">{contentType.name} schema</h2>
                    </div>
                    <div className="modal-body">
                      {contentType.fields.map((field, index) => {
                        const { id, value, ...f } = field
                        return (
                          <div key={index}>
                            <pre>{'{'}</pre>
                            <pre>&nbsp;&nbsp;"Name": "{f.name}",</pre>
                            <pre>&nbsp;&nbsp;"FieldType": "{f.fieldType}",</pre>
                            <pre>&nbsp;&nbsp;"Required": {f.required ? 'true' : 'false'},</pre>
                            {f.maxLength.toString() !== '0' && <pre>&nbsp;&nbsp;"MaxLength": {f.maxLength},</pre>}
                            <pre>{'},'}</pre>
                          </div>
                        )
                      })}
                    </div>
                    <div className="modal-footer">
                      <button className="px-3 py-2 my-3 x-4 border border-yellow bg-blue shadow-sm text-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue" onClick={() => setContentType(null)}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SchemaModal
