import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { LoadingIndicatorProps } from '../../types/components';
import LoadingIndicator from '../LoadingIndicator';

configure({ adapter: new Adapter() })

const props: LoadingIndicatorProps = {
  loading: false,
  contract: null,
  currentUser: undefined,
}

describe('<LoadingIndicator />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<LoadingIndicator {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
