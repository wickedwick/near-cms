import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { TextInputProps } from '../../types/components'
import TextInput from '../TextInput'

configure({ adapter: new Adapter() })

const props: TextInputProps = {
  classes: 'test',
  for: 'test',
  label: 'test',
  value: 'test',
  onChange: jest.fn(),
}

describe('<TextInput />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<TextInput {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('handles onChange', () => {
    const wrapper = shallow(<TextInput {...props} />)
    wrapper.find('input').simulate('change', { target: { value: 'test2' } })
    expect(props.onChange).toHaveBeenCalledWith({ target: { value: 'test2' } })
  })
})
