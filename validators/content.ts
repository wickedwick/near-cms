import { Content, Field } from "../assembly/main"
import { ValidationResult } from "../types/validation"

export const validateContent = (content: Content, fields: Field[]): ValidationResult => {
  const validationMessages: string[] = []

  if (!content.slug) {
    validationMessages.push("Content slug is required")
  }
  
  if (!content.name) {
    validationMessages.push("Content name is required")
  }

  if (!content.type) {
    validationMessages.push("Content type is required")
  }

  if (!fields.length) {
    validationMessages.push("Content fields are required")
  }

  return {
    isValid: validationMessages.length === 0,
    validationMessages,
  }
}
