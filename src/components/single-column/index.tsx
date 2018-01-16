import * as React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';

import { ColumnProps } from 'components/column';
import { SingleColumnConfig } from 'utils/types';
import { CLASSNAMES as columnClassnames } from 'components/column';
import { classNames } from 'utils/classnames';

import './style.styl';

export const CLASSNAMES = {
  container: 'clsprefix-single-column-container',
  header: 'clsprefix-single-column-header',
  cell: 'clsprefix-single-column-cell',
};

export interface SingleColumnProps extends ColumnProps {
  width: number;
  config: SingleColumnConfig;
}

const handleHeaderClick = (
  props: SingleColumnProps,
) => (
  event: React.MouseEvent<HTMLDivElement>,
) => {
  if (props.provided.dragHandleProps != null) {
    props.provided.dragHandleProps.onClick(event);
  }
  if (props.onHeaderClick != null) {
    props.onHeaderClick();
  }
};

export const SingleColumn: React.SFC<SingleColumnProps> = props => (
  <div
    className={CLASSNAMES.container}
    style={{ width: props.width }}
  >
    <div
      ref={props.provided.innerRef}
      style={props.provided.draggableStyle}
    >
      <div
        className={classNames(columnClassnames.cell, CLASSNAMES.header)}
        {...props.provided.dragHandleProps}
        onClick={handleHeaderClick(props)}
      >
        { props.config.name }
      </div>
      {
        props.data.map((dataPerRow, rowIndex) => (
          <div key={rowIndex} className={classNames(columnClassnames.cell, CLASSNAMES.cell)}>
            {
              props.config.render != null ?
                props.config.render(
                  (props.config.dataKey && props.data[rowIndex][props.config.dataKey]),
                  {
                    columnIndex: props.columnIndex,
                    rowIndex,
                  }
                ) :
                (props.config.dataKey && dataPerRow[props.config.dataKey])
            }
          </div>
        ))
      }
    </div>
    { props.provided.placeholder }
  </div>
);
