import * as React from 'react';
import {
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import { ColumnConfig, GroupedColumnConfig } from 'utils/types';

import { SingleColumn } from 'components/single-column';
import { GroupedColumn } from 'components/grouped-column';

import './style.styl';

export const CLASSNAMES = {
  cell: 'clsprefix-cell',
};

export const DEFAULT_COLUMN_WIDTH = 120;

export interface ColumnProps {
  provided: DraggableProvided;

  snapshot: DraggableStateSnapshot;

  width: number | number[];

  columnIndex: number;

  config: ColumnConfig;

  data: {
    [key: string]: any;
  }[];

  onHeaderClick?(): void;
}

export function isGroupedColumn (config: ColumnConfig): config is GroupedColumnConfig {
  if ((config as GroupedColumnConfig).columns != null) {
    return true;
  } else {
    return false;
  }
}

export const Column: React.SFC<ColumnProps> = props => {
  if (isGroupedColumn(props.config)) {
    return (
      <GroupedColumn
        columnIndex={props.columnIndex}
        provided={props.provided}
        snapshot={props.snapshot}
        config={props.config}
        width={props.width as number[]}
        data={props.data}
        onHeaderClick={props.onHeaderClick}
      />
    );
  } else {
    return (
      <SingleColumn
        columnIndex={props.columnIndex}
        provided={props.provided}
        snapshot={props.snapshot}
        config={props.config}
        width={props.width as number}
        data={props.data}
        onHeaderClick={props.onHeaderClick}
      />
    );
  }
};
