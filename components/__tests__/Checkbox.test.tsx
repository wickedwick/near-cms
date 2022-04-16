import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { CheckboxProps } from '../../types/components'
import Checkbox from '../Checkbox'

configure({ adapter: new Adapter() })

const props: CheckboxProps = {
  label: 'test',
  name: 'test',
  checked: false,
  onChange: jest.fn(),
}

describe('<Checkbox />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Checkbox {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('handles onChange', () => {
    const wrapper = shallow(<Checkbox {...props} />)
    wrapper.find('input').simulate('change', { target: { checked: true } })
    expect(props.onChange).toHaveBeenCalledWith({ target: { checked: true } })
  })
})
