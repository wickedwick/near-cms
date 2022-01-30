import { ContentType } from "../assembly/main"
import { ValidationResult } from "../types/validation"

export const validateContentType = (contentType: ContentType): ValidationResult => {
  const validationMessages: string[] = []

  if (!contentType.name) {
    validationMessages.push("Content type name is required")
  }
  
  if (!contentType.fields.length) {
    validationMessages.push("Content type fields are required")
  }

  return {
    isValid: validationMessages.length === 0,
    validationMessages,
  }
}
