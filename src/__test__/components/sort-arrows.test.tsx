import * as React from 'react';
import { render } from 'react-dom';
import { shallow, ShallowWrapper } from 'enzyme';
import { spy } from 'sinon';

import { SortArrows, CLASSNAMES } from 'components/sort-arrows';

test('renders without crashing', () => {
  const div = document.createElement('div');
  render(<SortArrows type="top" />, div);
  render(<SortArrows type="bottom" />, div);
});

describe('render direction correctly', () => {
  test('strengthen top arrow then type is top', () => {
    const wrapper = shallow(<SortArrows type="top" />);
    expect(wrapper.find(`.${CLASSNAMES.topArrow}`).hasClass(CLASSNAMES.activeArrow)).toBe(true);
    expect(wrapper.find(`.${CLASSNAMES.bottomArrow}`).hasClass(CLASSNAMES.activeArrow)).toBe(false);
  });

  test('strengthen bottom arrow when type is bottom', () => {
    const wrapper = shallow(<SortArrows type="bottom" />);
    expect(wrapper.find(`.${CLASSNAMES.topArrow}`).hasClass(CLASSNAMES.activeArrow)).toBe(false);
    expect(wrapper.find(`.${CLASSNAMES.bottomArrow}`).hasClass(CLASSNAMES.activeArrow)).toBe(true);
  });

  test('don\'t strengthen any arrow when no type passed', () => {
    const wrapper = shallow(<SortArrows />);
    expect(wrapper.find(`.${CLASSNAMES.activeArrow}`).length).toBe(0);
  });
});

test('response click event', () => {
  const callback = spy();
  const wrapper = shallow(
    <SortArrows
      type="top"
      onClick={callback}
    />
  );
  wrapper.simulate('click');
  expect(callback.calledOnce).toBe(true);
});
