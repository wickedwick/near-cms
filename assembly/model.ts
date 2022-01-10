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
  value: Fieldtype
}

export const fieldTypeOptions: FieldTypeOption[] = [
  { label: 'String', value: Fieldtype.String },
  { label: 'Int', value: Fieldtype.Int },
  { label: 'Float', value: Fieldtype.Float },
  { label: 'Boolean', value: Fieldtype.Boolean },
  { label: 'Date', value: Fieldtype.Date },
  { label: 'DateTime', value: Fieldtype.DateTime },
  { label: 'Time', value: Fieldtype.Time },
  { label: 'Password', value: Fieldtype.Password },
  { label: 'Email', value: Fieldtype.Email },
  { label: 'URL', value: Fieldtype.URL },
  { label: 'Phone', value: Fieldtype.Phone },
  { label: 'Postal Code', value: Fieldtype.PostalCode },
  { label: 'IP', value: Fieldtype.IP },
  { label: 'Custom', value: Fieldtype.Custom }
]

export enum Role {
  Admin,
  Editor,
  Viewer,
  Public,
}
