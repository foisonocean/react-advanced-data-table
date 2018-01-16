import * as React from 'react';

import { ColumnProps } from 'components/column';
import { GroupedColumnConfig } from 'utils/types';
import { CLASSNAMES as columnClassnames } from 'components/column';
import { classNames } from 'utils/classnames';

import './style.styl';

export const CLASSNAMES = {
  container: 'clsprefix-grouped-column-container',
  header: {
    groupName: 'clsprefix-grouped-column-header-name',
  },
  body: {
    container: 'clsprefix-grouped-body',
    columnContainer: 'clsprefix-grouped-column-container',
    header: 'clsprefix-grouped-column-body-header',
    columnCell: 'clsprefix-grouped-column-cell',
  },
};

export interface GroupedColumnProps extends ColumnProps {
  width: number[];
  config: GroupedColumnConfig;
}

const handleGroupNameClick = (
  props: GroupedColumnProps,
) => (
  event: React.MouseEvent<HTMLDivElement>,
) => {
  if (props.provided.dragHandleProps != null) {
    props.provided.dragHandleProps.onClick(event);
  }
  if (props.onHeaderClick != null) {
    props.onHeaderClick();
  }
}

export const GroupedColumn: React.SFC<GroupedColumnProps> = props => (
  <div
    className={CLASSNAMES.container}
    style={{ width: props.width.reduce((a, b) => a + b, 0) }}
  >
    <div
      ref={props.provided.innerRef}
      style={props.provided.draggableStyle}
    >
      <div
        className={classNames(columnClassnames.cell, CLASSNAMES.header.groupName)}
        {...props.provided.dragHandleProps}
        onClick={handleGroupNameClick(props)}
      >
        { props.config.groupName }
      </div>
      <div className={CLASSNAMES.body.container}>
        {
          props.config.columns.map((columnConfig, groupedIndex) => (
            <div
              key={groupedIndex}
              className={CLASSNAMES.body.columnContainer}
              style={{ width: props.width[groupedIndex] }}
            >
              <div key={groupedIndex} className={classNames(columnClassnames.cell, CLASSNAMES.body.header)}>
                { columnConfig.name }
              </div>
              {
                props.data.map((dataPerRow, rowIndex) => (
                  <div key={rowIndex} className={classNames(columnClassnames.cell, CLASSNAMES.body.columnCell)}>
                    {
                      columnConfig.render != null ?
                        columnConfig.render(
                          dataPerRow,
                          {
                            columnIndex: props.columnIndex,
                            rowIndex,
                          },
                        ) :
                        (columnConfig.dataKey && dataPerRow[columnConfig.dataKey])
                    }
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
    { props.provided.placeholder }
  </div>
);
