import * as React from 'react';
import { shallow, render } from 'enzyme';

import {
  ReactAdvancedDataTable,
  ReactAdvancedDataTableProps as Props,
  DEFAULT_COUNT_OF_ROWS_PER_PAGE,
} from 'components/container';
import { Table } from 'components/table';

const baseProps: Props = {
  data: [
    {a: 1, b: 2},
    {a: 3, b: 4},
    {a: 5, b: 6},
  ],
  columnsConfig: [
    {name: 'a', dataKey: 'a'},
    {name: 'b', dataKey: 'b', width: 300},
    {name: 'c', render: (data: any) => data}
  ],
};

test('renders without crashing', () => {
  render(<ReactAdvancedDataTable {...baseProps} />);
});

describe('works correctly with data split base on pagination', () => {
  test('works without crashing when data is `null`', () => {
    render(
      <ReactAdvancedDataTable
        data={null}
        columnsConfig={baseProps.columnsConfig}
      />
    );
  });

  test('splitted data should be `undefined` when data is `null`', () => {
    const wrapper = shallow(
      <ReactAdvancedDataTable
        data={null}
        columnsConfig={baseProps.columnsConfig}
      />
    );
    const propsOfTable = wrapper.find(Table).at(0).props();

    expect(propsOfTable.data).toBe(undefined);
  });

  test('works without crashing when data is `undefined`', () => {
    render(
      <ReactAdvancedDataTable
        data={undefined}
        columnsConfig={baseProps.columnsConfig}
      />
    );
  });

  test('splitted data should be `undefined` when data is `undefined`', () => {
    const wrapper = shallow(
      <ReactAdvancedDataTable
        data={undefined}
        columnsConfig={baseProps.columnsConfig}
      />
    );
    const propsOfTable = wrapper.find(Table).at(0).props();

    expect(propsOfTable.data).toBe(undefined);
  });

  test('don\'t split data when the length of data is small', () => {
    const rawData = baseProps.data;
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={rawData}
        rowsPerPage={100}
      />
    );
    const processedData = wrapper.find(Table).at(0).props().data;

    expect(processedData).toBe(rawData);
  });

  test('don\'t split data when the length of data is equals to the `rowsPerPage`', () => {
    const rawData = baseProps.data;
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={rawData}
        rowsPerPage={(rawData as any[]).length}
      />
    );
    const processedData = wrapper.find(Table).at(0).props().data;

    expect(processedData).toBe(rawData);
  });

  test('split data correctly when data length is greater than `rowsPerPage`', () => {
    const rawData: Props['data'] = Array.from(
      {length: 18},
      (_, index) => ({ number: index }),
    );
    const rowsPerPage = 10;
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={rawData}
        rowsPerPage={rowsPerPage}
      />
    );
    const processedData = wrapper.find(Table).at(0).props().data;

    expect(processedData).toEqual(rawData.slice(0, rowsPerPage));
  });

  test('use default `rowsPerPage` when `rowsPerPage` is not passed', () => {
    const rawData: Props['data'] = Array.from(
      {length: 200},
      (_, index) => ({ number: index }),
    );

    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={rawData}
      />
    );

    const processedData = wrapper.find(Table).at(0).props().data;

    expect(processedData).toEqual(rawData.slice(0, DEFAULT_COUNT_OF_ROWS_PER_PAGE));
  });

  test('split data correctly when flipping pages', () => {
    const rawData: Props['data'] = Array.from(
      {length: 18},
      (_, index) => ({ number: index }),
    );
    const rowsPerPage = 10;
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={rawData}
        rowsPerPage={rowsPerPage}
      />
    );
    wrapper.setState({
      currentPage: 2,
    });
    const processedData = wrapper.find(Table).at(0).props().data;

    expect(processedData).toEqual(rawData.slice(rowsPerPage));
  });

  test('split data correctly when received a new `data` prop', () => {
    const rowsPerPage = 10;
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={baseProps.data}
        rowsPerPage={rowsPerPage}
      />
    );
    const newData: Props['data'] = Array.from(
      {length: 18},
      (_, index) => ({ number: index }),
    );
    wrapper.setProps({
      data: newData,
    });
    const processedData = wrapper.find(Table).at(0).props().data;

    expect(processedData).toEqual(newData.slice(0, rowsPerPage));
  });

  test('split data correctly when received a new `rowsPerPage` prop', () => {
    const data: Props['data'] = Array.from(
      {length: 18},
      (_, index) => ({ number: index }),
    );
    const oldRowsPerPage = 3;
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={data}
        rowsPerPage={oldRowsPerPage}
      />
    );
    const newRowsPerPage = 5;
    wrapper.setProps({
      rowsPerPage: newRowsPerPage,
    });
    const processedData = wrapper.find(Table).at(0).props().data;

    expect(processedData).toEqual(data.slice(0, newRowsPerPage));
  });

  test('split data correctly when received a new column config', () => {
    const data: Props['data'] = Array.from(
      {length: 18},
      (_, index) => ({ number: index }),
    );
    const rowsPerPage = 5;
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={data}
        rowsPerPage={rowsPerPage}
      />
    );

    const processedDataBefore = wrapper.find(Table).at(0).props().data;
    expect(processedDataBefore).toEqual(data.slice(0, rowsPerPage));

    const newcolumnsConfig: Props['columnsConfig'] = [
      {name: 'name', dataKey: 'name'},
    ];
    wrapper.setProps({
      columnsConfig: newcolumnsConfig,
    });

    const processedDataAfter = wrapper.find(Table).at(0).props().data;
    expect(processedDataAfter).toEqual(data.slice(0, rowsPerPage));
  });

  test('cache the splitted data', () => {
    let countOfSpilt = 0;
    const data: Props['data'] = Array.from(
      {length: 150},
      (_, index) => ({ number: index }),
    );
    data.slice = function () {
      countOfSpilt++;
      return Array.prototype.slice.apply(data, arguments);
    };
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={data}
        rowsPerPage={7}
      />
    );

    const calledCount1 = countOfSpilt;
    expect(calledCount1).not.toBe(0);

    wrapper.setState({ currentPage: 2 });
    const calledCount2 = countOfSpilt;
    expect(calledCount2).not.toBe(calledCount1);

    wrapper.setState({ currentPage: 3 });
    const calledCount3 = countOfSpilt;
    expect(calledCount3).not.toBe(calledCount2);

    wrapper.setState({ currentPage: 1 });
    const calledCount4 = countOfSpilt;
    expect(calledCount4).toBe(calledCount3);

    wrapper.setState({ currentPage: 3 });
    const calledCount5 = countOfSpilt;
    expect(calledCount5).toBe(calledCount4);
  });
});

describe('add additional `index` field to the `columnsConfig` prop', () => {
  test('should add `index` field correctly', () => {
    const wrapper = shallow(
      <ReactAdvancedDataTable
        columnsConfig={baseProps.columnsConfig}
        data={baseProps.data}
      />
    );
    const processedConfig: Props['columnsConfig'] = wrapper
      .find(Table).at(0).props().columnsConfig;

    expect(processedConfig).toEqual(baseProps.columnsConfig.map((rawConfig, index) => ({
      ...rawConfig,
      index,
    })));
  });

  test(
    'should add `index` field correctly after receiving new \
    `columnsConfig` prop',
    () => {
      const wrapper = shallow(
        <ReactAdvancedDataTable
          columnsConfig={baseProps.columnsConfig}
          data={baseProps.data}
        />
      );
      const newConfig: Props['columnsConfig'] = [
        {name: 'name', dataKey: 'name'},
        {name: 'react', dataKey: 'app'},
      ];
      wrapper.setProps({columnsConfig: newConfig});
      const processedConfig: Props['columnsConfig'] = wrapper
      .find(Table).at(0).props().columnsConfig;

      expect(processedConfig).toEqual(newConfig.map((rawConfig, index) => ({
        ...rawConfig,
        index,
      })));
    },
  )
});
