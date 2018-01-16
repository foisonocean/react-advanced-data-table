import * as React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import memoize from 'lodash-es/memoize';

import { Column, isGroupedColumn, DEFAULT_COLUMN_WIDTH } from 'components/column';

import { ColumnsConfig } from 'utils/types';

import './style.styl';

export const CLASSNAMES = {
  container: 'clsprefix-table-container',
};

export interface TableProps {
  columnsConfig: ColumnsConfig;

  data?: {
    [key: string]: any;
  }[];

  enableDrag?: boolean;
}

export interface TableState {
  orderedColumnIndex: number[];
}

export class Table extends React.Component<TableProps, TableState> {
  public state = {
    orderedColumnIndex: this.getInitStateOfOrder(),
  }

  private $container: (HTMLDivElement | null) = null;

  public componentWillReceiveProps(nextProps: Readonly<TableProps>) {
    if (nextProps.columnsConfig !== this.props.columnsConfig) {
      this.getColumnWidth.cache.clear();
      this.setState({
        orderedColumnIndex: this.getInitStateOfOrder(),
      });
    }
  }

  private getInitStateOfOrder(): TableState['orderedColumnIndex'] {
    return Array.from({length: this.props.columnsConfig.length}, (_, columnIndex) => columnIndex);
  }

  private handleDragEnd: (result: DropResult) => void = result => {
    if (result.destination != null) {
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      const copyedColumnIndex = [...this.state.orderedColumnIndex];
      const [movingItem] = copyedColumnIndex.splice(sourceIndex, 1);
      copyedColumnIndex.splice(destinationIndex, 0, movingItem);
      this.setState({
        orderedColumnIndex: copyedColumnIndex,
      });
    }
  }

  private getColumnWidth = memoize((columnIndex: number) => {
    const columnConfig = this.props.columnsConfig[columnIndex];
    if (isGroupedColumn(columnConfig)) {
      return columnConfig.columns.map(({ width }) => width || DEFAULT_COLUMN_WIDTH);
    } else {
      return columnConfig.width || DEFAULT_COLUMN_WIDTH;
    }
  });

  public render() {
    if (this.props.data == null || this.props.columnsConfig.length === 0) {
      return null;
    }

    return (
      <DragDropContext
        onDragEnd={this.handleDragEnd}
      >
        <Droppable droppableId="droppable" direction="horizontal">
          {
            (provided, snapshot) => (
              <div
                ref={element => {
                  this.$container = element;
                  provided.innerRef(element);
                }}
                className={CLASSNAMES.container}
              >
                {
                  this.state.orderedColumnIndex.map(columnIndex => (
                    <Draggable
                      key={this.props.columnsConfig[columnIndex].index}
                      draggableId={`${this.props.columnsConfig[columnIndex].index}`}
                    >
                      {
                        (provided, snapshot) => (
                          <Column
                            provided={provided}
                            snapshot={snapshot}
                            columnIndex={columnIndex}
                            config={this.props.columnsConfig[columnIndex]}
                            data={this.props.data as {[key: string]: any}[]}
                            width={this.getColumnWidth(columnIndex)}
                          />
                        )
                      }
                    </Draggable>
                  ))
                }
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    );
  }
}
