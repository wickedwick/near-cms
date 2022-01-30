import { Dispatch, SetStateAction } from "react";
import { ContentType, Field } from "../assembly/main";

export type FieldTypesEditorProps = {
  fields: Field[],
  setFields: Dispatch<SetStateAction<Field[]>>
}

export type SchemaModalProps = {
  contentType: ContentType,
  setContentType: Dispatch<SetStateAction<ContentType | null>>
}

export type AlertProps = {
  heading: string,
  transactionHashes?: string,
  messages?: string[],
}
