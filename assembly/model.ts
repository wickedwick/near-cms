export enum Fieldtype {
  String,
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

export class FieldTypeOption {
  label: string
  value: string
}

export const fieldTypeOptions: FieldTypeOption[] = [
  { label: 'String', value: 'String' },
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
