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

export function getPublicContents(): Content[] {
  const allContents: Content[] = contents.values()
  return allContents.filter(content => content.isPublic)
}

export function getPublicContent(slug: string): Content | null {
  const subject = getContent(slug)
  if (subject && subject.isPublic) {
    return subject
  }

  return null
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

export function getClient(slug: string): Client {
  return clientRegistry.get(slug) as Client
}

export function setClient(client: Client): void {
  clientRegistry.set(client.slug || '', client)
}

export function deleteClient(slug: string): void {
  clientRegistry.delete(slug)
}

export function getClients(): Client[] {
  return clientRegistry.values() as Client[]
}

export function setUser(user: User, role: Role): void {
  const userRole: UserRole = {
    username: user.accountId,
    role
  }
  
  userRegistry.set(userRole.username || '', userRole)
}

export function getUser(username: string): UserRole | null {
  return userRegistry.get(username)
}

export function getUsers(): UserRole[] {
  return userRegistry.values() as UserRole[]
}

export const clientRegistry = new PersistentUnorderedMap<string, Client>('clientRegistry')
export const userRegistry = new PersistentUnorderedMap<string, UserRole>('ku2DjgA6tMcswJ3Y')
export const contentTypes = new PersistentUnorderedMap<string, ContentType>("pfB4RNkXKt66x5Wd")
export const contents = new PersistentUnorderedMap<string, Content>("r6g9FALgD8KNf3QE")

@nearBindgen
class ContentType {
  fields: Field[]
  name: string
}

@nearBindgen
class Field {
  fieldType: string
  name: string
  value: string
}

@nearBindgen
class Content {
  name: string
  slug: string
  type: ContentType
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

@nearBindgen
class UserRole {
  role: Role
  username: string
}

@nearBindgen
class User {
  accountId: string
  balance: string
}

@nearBindgen
class Client {
  slug: string
  name: string
  owner: string
}

export { ContentType, Field, Content, User, UserRole, Client }