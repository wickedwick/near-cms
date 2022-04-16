import { Dispatch, SetStateAction } from "react";
import { ContentType, Field, UserRole } from "../assembly/main";
import { CmsContract } from "./contract";

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
  messages?: string[],
  transactionHashes?: string,
}

export type TextInputProps = {
  classes: string,
  for: string,
  label: string,
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export type TableProps = {
  headers: string[],
  data: any[],
}

export type CheckboxProps = {
  checked: boolean,
  label: string,
  name: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export type LoadingIndicatorProps = {
  loading: boolean,
}