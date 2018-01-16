import * as React from 'react';
import { shallow, render } from 'enzyme';
import {
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import { SingleColumn, CLASSNAMES } from 'components/single-column';

const mock = {
  provided: {
    innerRef: () => {},
  },
  snapshot: {
    isDragging: false,
  },
};

const baseProps = {
  provided: mock.provided,
  snapshot: mock.snapshot,
  width: 100,
  columnIndex: 0,
  config: {
    name: 'name',
    dataKey: 'name',
    index: 0,
  },
  data: [
    {name: 'javascript'},
    {name: 'typescript'},
    {name: 'react'},
  ],
};

test('renders without crashing', () => {
  render(<SingleColumn {...baseProps} />);
});

test('handle click correctly when click header', () => {
  const handleClick = jest.fn();
  const wrapper = shallow(
    <SingleColumn
      {...baseProps}
      onHeaderClick={handleClick}
    />
  );
  wrapper.find(`.${CLASSNAMES.header}`).at(0).simulate('click');

  expect(handleClick.mock.calls.length).toBe(1);
});
