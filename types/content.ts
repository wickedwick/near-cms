import { context, u128, PersistentUnorderedMap } from "near-sdk-as"

@nearBindgen
export class ContentType {
  name: string
  fields: Field[]
}

export class Field {
  name: string
  fieldType: Fieldtype
}

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
  Custom
}

export const contentTypes = new PersistentUnorderedMap<string, ContentType>("pfB4RNkXKt66x5Wd")
