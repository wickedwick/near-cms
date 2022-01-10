import { Dispatch, SetStateAction } from "react";
import { Field } from "../assembly/main";

export type FieldTypesEditorProps = {
  fields: Field[],
  setFields: Dispatch<SetStateAction<Field[]>>
}