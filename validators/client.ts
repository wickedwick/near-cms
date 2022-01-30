import { Client } from "../assembly/main"
import { ValidationResult } from "../types/validation"

export const validateClient = (client: Client): ValidationResult => {
  const validationMessages: string[] = []

  if (!client.slug) {
    validationMessages.push("Client slug is required")
  }

  if (!client.name) {
    validationMessages.push("Client name is required")
  }

  if (!client.owner) {
    validationMessages.push("Client owner is required")
  }

  return {
    isValid: validationMessages.length === 0,
    validationMessages,
  }
}
