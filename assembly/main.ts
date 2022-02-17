import { context, PersistentUnorderedMap } from "near-sdk-as"
import { MediaType, Role } from "./model"

export function getContentTypes(): ContentType[] {
  return contentTypes.values() as ContentType[]
}

export function getContentType(name: string): ContentType | null {
  return contentTypes.get(name) as ContentType
}

export function setContentType(contentType: ContentType): void {
  if (!senderIsAdmin()) {
    throw new Error("Unauthorized")
  }

  if (!contentType.name) {
    throw new Error("Content type name is required")
  }

  if (!contentType.fields.length) {
    throw new Error("Content type fields are required")
  }

  contentTypes.set(contentType.name || '', contentType)
}

export function deleteContentType(name: string): void {
  if (!senderIsAdmin()) {
    throw new Error("Unauthorized")
  }

  contentTypes.delete(name)
}

export function getUserRole(name: string): UserRole | null {
  return userRegistry.get(name) as UserRole
}

export function setUserRole(role: UserRole): void {
  if (!senderIsAdmin()) {
    throw new Error("Unauthorized")
  }

  userRegistry.set(role.username, role)
}

export function deleteUserRole(name: string): void {
  if (!senderIsAdmin()) {
    throw new Error("Unauthorized")
  }

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
  if (!senderIsEditor()) {
    throw new Error("Unauthorized")
  }

  if (!content.slug) {
    throw new Error("Content slug is required")
  }
  
  if (!content.name) {
    throw new Error("Content name is required")
  }

  if (!content.type) {
    throw new Error("Content type is required")
  }

  contents.set(content.slug || '', content)
}

export function deleteContent(content: Content): void {
  if (!senderIsEditor()) {
    throw new Error("Unauthorized")
  }

  contents.delete(content.slug || '')
}

export function getClient(slug: string): Client {
  return clientRegistry.get(slug) as Client
}

export function setClient(client: Client): void {
  if (!senderIsAdmin()) {
    throw new Error("Unauthorized")
  }

  if (!client.slug) {
    throw new Error("Client slug is required")
  }

  if (!client.name) {
    throw new Error("Client name is required")
  }

  if (!client.owner) {
    throw new Error("Client owner is required")
  }

  clientRegistry.set(client.slug || '', client)
}

export function deleteClient(slug: string): void {
  if (!senderIsAdmin()) {
    throw new Error("Unauthorized")
  }

  clientRegistry.delete(slug)
}

export function getClients(): Client[] {
  return clientRegistry.values() as Client[]
}

export function getUser(username: string): UserRole | null {
  return userRegistry.get(username)
}

export function getUsers(): UserRole[] {
  return userRegistry.values() as UserRole[]
}

export function getMedia(): Media[] {
  return mediaCollection.values() as Media[]
}

export function getMediaBySlug(slug: string): Media | null {
  return mediaCollection.get(slug) as Media
}

export function setMedia(media: Media): void {
  if (!senderIsEditor()) {
    throw new Error("Unauthorized")
  }

  if (!media.name) {
    throw new Error("Media name is required")
  }
  
  if (!media.slug) {
    throw new Error("Media slug is required")
  }

  if (!media.cid) {
    throw new Error("Media cid is required")
  }

  if (!media.filename) {
    throw new Error("Media filename is required")
  }

  mediaCollection.set(media.slug || '', media)
}

export function deleteMedia(slug: string): void {
  if (!senderIsEditor()) {
    throw new Error("Unauthorized")
  }

  mediaCollection.delete(slug || '')
}

const senderIsAdmin = (): boolean => {
  const sender: string = context.sender
  if (sender === context.contractName) return true

  const userWithRole: UserRole | null = userRegistry.get(sender)
  
  if (!userWithRole) return false

  return userWithRole.role === Role.Admin
}

const senderIsEditor = (): boolean => {
  const sender: string = context.sender
  if (senderIsAdmin()) return true

  const userWithRole = userRegistry.get(sender)
  
  if (!userWithRole) return false

  return userWithRole.role <= Role.Editor
}

export const clientRegistry = new PersistentUnorderedMap<string, Client>('clientRegistry')
export const userRegistry = new PersistentUnorderedMap<string, UserRole>('ku2DjgA6tMcswJ3Y')
export const contentTypes = new PersistentUnorderedMap<string, ContentType>("pfB4RNkXKt66x5Wd")
export const contents = new PersistentUnorderedMap<string, Content>("r6g9FALgD8KNf3QE")
export const mediaCollection = new PersistentUnorderedMap<string, Media>("mZXUuB86uwqkhAe7")

@nearBindgen
class ContentType {
  fields: Field[] = []
  name: string = ''
}

@nearBindgen
class Field {
  id: string = ''
  fieldType: string = ''
  name: string = ''
  value: string = ''
  required: boolean = false
  maxLength: i64 = 0
}

@nearBindgen
class Content {
  name: string = ''
  slug: string = ''
  type: ContentType = {
    fields: [],
    name: ''
  }
  isPublic: boolean = false
  isEncrypted: boolean = false
  createdAt: string = ''
  updatedAt: string = ''
}

@nearBindgen
class Media {
  name: string = ''
  url: string = ''
  slug: string = ''
  cid: string = ''
  uploadedAt: string = ''
  mediaType: MediaType = MediaType.Image
  filename: string = ''
}

@nearBindgen
class UserRole {
  role: Role = Role.Public
  username: string = ''
}

@nearBindgen
class User {
  accountId: string = ''
  balance: string = ''
}

@nearBindgen
class Client {
  slug: string = ''
  name: string = ''
  owner: string = ''
}

export { ContentType, Field, Content, User, UserRole, Client, Media }