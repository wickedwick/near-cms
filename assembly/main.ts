import { ContentType, contentTypes } from "../types/content"

export function setContentType(contentType: ContentType): void {
  contentTypes.set(contentType.name, contentType)
}

export function getContentType(name: string): ContentType | null {
  return contentTypes.get(name) as ContentType
}

export function deleteContentType(name: string): void {
  contentTypes.delete(name)
}

export function getContentTypes(): ContentType[] {
  return contentTypes.values()
}
