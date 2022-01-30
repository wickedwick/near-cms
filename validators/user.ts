import { UserRole } from "../assembly/main"
import { ValidationResult } from "../types/validation"

export const validateUserRole = (userRole: UserRole): ValidationResult => {
  const validationMessages: string[] = []

  if (!userRole.username) {
    validationMessages.push("Username is required")
  }
  
  if (!userRole.role) {
    validationMessages.push("Role is required")
  }

  return {
    isValid: validationMessages.length === 0,
    validationMessages,
  }
}
