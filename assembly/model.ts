import { Content, Field } from "./main"

export enum Fieldtype {
  String,
  RichText,
  Int,
  Float,
  Boolean,
  Date,
  DateTime,
  Time,
  Password,
  Email,
  URL,
  Phone,
  PostalCode,
  IP,
  Custom,
}

export class Option {
  label: string
  value: string
}

export const fieldTypeOptions: Option[] = [
  { label: 'String', value: 'String' },
  { label: 'RichText', value: 'RichText' },
  { label: 'Int', value: 'Int' },
  { label: 'Float', value: 'Float' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Date', value: 'Date' },
  { label: 'DateTime', value: 'DateTime' },
  { label: 'Time', value: 'Time' },
  { label: 'Password', value: 'Password' },
  { label: 'Email', value: 'Email' },
  { label: 'URL', value: 'URL' },
  { label: 'Phone', value: 'Phone' },
  { label: 'Postal Code', value: 'PostalCode' },
  { label: 'IP', value: 'IP' },
  { label: 'Custom', value: 'Custom' }
]

export enum Role {
  Admin,
  Editor,
  Viewer,
  Public,
}

export class RoleOption {
  label: string
  value: Role
}

export const roleOptions: RoleOption[] = [
  { label: 'Admin', value: Role.Admin },
  { label: 'Editor', value: Role.Editor },
  { label: 'Viewer', value: Role.Viewer },
  { label: 'Public', value: Role.Public }
]

export class ContentData {
  content: Content
  name: string
  values: Field[]
}
