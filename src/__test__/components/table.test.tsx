import * as React from 'react';
import { shallow, render } from 'enzyme';

import { Table } from 'components/table';

const baseProps = {
  columnsConfig: [
    { name: 'a', dataKey: 'a', index: 0 },
    {
      groupName: 'group',
      columns: [
        { name: 'b', dataKey: 'b' },
        { name: 'c', dataKey: 'c' },
      ],
      index: 1,
    },
  ],
  data: [
    { a: 1, b: 2, c: 'hello' },
    { a: 3, b: 4, c: 'hello' },
    { a: 5, b: 6, c: 'hello' },
  ],
};

test('renders without crashing', () => {
  render(<Table {...baseProps} />);
});

test('should render `null` if data is `undefined`', () => {
  const wrapper = shallow(
    <Table
      columnsConfig={baseProps.columnsConfig}
      data={undefined}
    />
  );

  expect(wrapper.equals(null as any)).toBe(true);
});

test('should render `null` if the length of config is 0', () => {
  const wrapper = shallow(
    <Table
      columnsConfig={[]}
      data={baseProps.data}
    />
  );

  expect(wrapper.equals(null as any)).toBe(true);
});
