import { TextInputProps } from "../types/components"

const TextInput = (props: TextInputProps): JSX.Element => {
  return (
    <>
      <label htmlFor={props.for}>{props.label}</label>
      <input className={props.classes} type="text" value={props.value} onChange={props.onChange} />
    </>
  )
}

export default TextInput
