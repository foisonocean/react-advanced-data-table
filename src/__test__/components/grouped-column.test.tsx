import * as React from 'react';
import { shallow, render } from 'enzyme';
import {
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import { GroupedColumn, CLASSNAMES } from 'components/grouped-column';


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
  width: [100, 400],
  columnIndex: 0,
  config: {
    groupName: 'group',
    columns: [
      {
        name: 'name',
        dataKey: 'name',
      },
      {
        name: 'hello',
        render: (data: any) => `hello, ${data.name}`,
      },
    ],
    index: 0,
  },
  data: [
    {name: 'javascript'},
    {name: 'typescript'},
    {name: 'react'},
  ],
};

test('renders without crashing', () => {
  render(<GroupedColumn {...baseProps} />);
});

test('handle click correctly when click header', () => {
  const handleClick = jest.fn();
  const wrapper = shallow(
    <GroupedColumn
      {...baseProps}
      onHeaderClick={handleClick}
    />
  );
  wrapper.find(`.${CLASSNAMES.header.groupName}`).at(0).simulate('click');

  expect(handleClick.mock.calls.length).toBe(1);
});
