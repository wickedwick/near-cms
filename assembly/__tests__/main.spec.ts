import { ContentType, Fieldtype } from "../../types/content"
import { setContentType, getContentType, deleteContentType } from "../main"

const contentType: ContentType = {
  name: 'content-type-1',
  fields: [
    {
      name: 'field-1',
      fieldType: Fieldtype.String,
    }
  ]
}

beforeEach(() => {
  setContentType(contentType)
})

describe('Content types CRUD methods', () => {
  it('Sets and gets a content type', () => {
    const storedValue: ContentType = getContentType('field-1') as ContentType
    expect(storedValue.name).toBe(contentType.name)
  })

  it('Deletes a content type', () => {
    deleteContentType(contentType.name)
    const storedValue: ContentType | null = getContentType('field-1')
    expect(storedValue).toBeNull()
  })
})
