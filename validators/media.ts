import { Media } from "../assembly/main"
import { ValidationResult } from "../types/validation"

export const validateMedia = (media: Media): ValidationResult => {
  const validationMessages: string[] = []

  if (!media.name) {
    validationMessages.push("Media name is required")
  }
  
  if (!media.slug) {
    validationMessages.push("Media slug is required")
  }

  if (!media.cid) {
    validationMessages.push("Media cid is required")
  }

  if (!media.filename) {
    validationMessages.push("Media filename is required")
  }

  return {
    isValid: validationMessages.length === 0,
    validationMessages,
  }
}
