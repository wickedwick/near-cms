import { Fieldtype } from "./model"
import { PersistentMap } from "near-sdk-as"

export function setContentType(contentType: ContentType): void {
  console.log('setContentType', contentType)
  contentTypes.set(contentType.name || '', contentType)
}

export function getContentType(name: string): ContentType | null {
  return contentTypes.get(name) as ContentType
}

export function deleteContentType(name: string): void {
  contentTypes.delete(name)
}

// export function getContentTypes(): ContentType[] {
//   return contentTypes.
// }

export const contentTypes = new PersistentMap<string, ContentType>("pfB4RNkXKt66x5Wd")
export const content = new PersistentMap<string, Content>("r6g9FALgD8KNf3QE")

@nearBindgen
export class ContentType {
  name: string | undefined
  fields: string[] | undefined
}

@nearBindgen
export class Field {
  name: string | undefined
  fieldType: string | undefined
  value: any | undefined
}

@nearBindgen
export class Content {
  type: ContentType | undefined
  fields: Field[] | undefined
  createdAt: Date | undefined
  updatedAt: Date | undefined
}
