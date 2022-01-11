import { PersistentUnorderedMap } from "near-sdk-as"
import { Role } from "./model"

export function getContentTypes(): ContentType[] {
  return contentTypes.values() as ContentType[]
}

export function getContentType(name: string): ContentType | null {
  return contentTypes.get(name) as ContentType
}

export function setContentType(contentType: ContentType): void {
  contentTypes.set(contentType.name || '', contentType)
}

export function deleteContentType(name: string): void {
  contentTypes.delete(name)
}

export function getUserRole(name: string): UserRole | null {
  return userRegistry.get(name) as UserRole
}

export function setUserRole(role: UserRole): void {
  userRegistry.set(role.username, role)
}

export function deleteUserRole(name: string): void {
  userRegistry.delete(name)
}

export function getContents(): Content[] {
  return contents.values() as Content[]
}

export function getContent(slug: string): Content | null {
  return contents.get(slug) as Content
}

export function setContent(content: Content): void {
  contents.set(content.slug || '', content)
}

export function deleteContent(content: Content): void {
  contents.delete(content.slug || '')
}

export const userRegistry = new PersistentUnorderedMap<string, UserRole>('ku2DjgA6tMcswJ3Y')
export const contentTypes = new PersistentUnorderedMap<string, ContentType>("pfB4RNkXKt66x5Wd")
export const contents = new PersistentUnorderedMap<string, Content>("r6g9FALgD8KNf3QE")

@nearBindgen
class ContentType {
  name: string
  fields: Field[]
}

@nearBindgen
class Field {
  name: string
  fieldType: string
  value: string
}

@nearBindgen
class Content {
  slug: string
  name: string
  type: ContentType
  fields: Field[]
  createdAt: string
  updatedAt: string
}

@nearBindgen
class UserRole {
  username: string
  role: Role
}

export { ContentType, Field, Content }