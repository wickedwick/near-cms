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

  fields.forEach(field => {
    if (field.required && !field.value) {
      validationMessages.push(`Field ${field.name} is required`)
    }

    if (field.maxLength > 0 && field.value && field.value.length > field.maxLength) {
      validationMessages.push(`Field ${field.name} is too long`)
    }
  })

  return {
    isValid: validationMessages.length === 0,
    validationMessages,
  }
}
