import * as React from 'react';

export type RawSingleColumnConfig = {
  width?: number;
  name: string;
  dataKey?: string;
  render?: (
    data: {[key: string]: any},
    info: { columnIndex: number; rowIndex: number; }
  ) => React.ReactNode;
};

export type SingleColumnConfig = RawSingleColumnConfig & { index: number; };

export type RawGroupedColumnConfig = {
  groupName: string;
  columns: RawSingleColumnConfig[];
};

export type GroupedColumnConfig = RawGroupedColumnConfig & { index: number; };

export type RawColumnConfig = RawSingleColumnConfig | RawGroupedColumnConfig;

export type ColumnConfig = SingleColumnConfig | GroupedColumnConfig;

export type RawColumnsConfig = RawColumnConfig[];

export type ColumnsConfig = ColumnConfig[];
