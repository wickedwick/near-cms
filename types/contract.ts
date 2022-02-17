import * as nearAPI from 'near-api-js'
import { Client, Content, ContentType, Media, UserRole } from '../assembly/main';

export interface CmsContract extends nearAPI.Contract {
  getUsers: () => Promise<UserRole[]>
  getUser: ({ username }: { username: string }) => Promise<UserRole>
  setUserRole: ({ role }: { role: UserRole }) => Promise<void>
  getContent: ({ slug }: { slug: string }) => Promise<Content>
  setContent: ({ args, callbackUrl}: { args: { content: Content }, callbackUrl: string }) => Promise<void>
  deleteContent: ({ content }: { content: Content }) => Promise<void>
  getMediaBySlug: ({ slug }: { slug: string }) => Promise<Media>
  getMedia: () => Promise<Media[]>
  setMedia: ({ args, callbackUrl }: { args: { media: Media }, callbackUrl: string }) => Promise<void>
  deleteMedia: ({ args, callbackUrl }: { args: { slug: string }, callbackUrl: string }) => Promise<void>
  getContents: () => Promise<Content[]>
  getPublicContent: ({ slug }: { slug: string }) => Promise<Content>
  getPublicContents: () => Promise<Content[]>
  getClient: ({ slug }: { slug: string }) => Promise<Client>
  setClient: ({ args, callbackUrl }: { args: { clientUpdate: Client }, callbackUrl: string }) => Promise<void>
  getClients: () => Promise<Client[]>
  getContentTypes: () => Promise<ContentType[]>
  setContentType: ({ args, callbackUrl }: { args: { contentType: ContentType }, callbackUrl: string }) => Promise<void>
  deleteContentType: ({ name }: { name: string }) => Promise<void>
  getUserRole: ({ name }: { name: string }) => Promise<UserRole>
}