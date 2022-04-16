import { CheckboxProps } from "../types/components"

const Checkbox = (props: CheckboxProps): JSX.Element => {
  return (
    <label className="block">
      {props.label}&nbsp;
      <input
        className='ml-2'
        name={props.name}
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        />
    </label>
  )
}

export default Checkbox
