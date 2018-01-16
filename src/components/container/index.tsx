import * as React from 'react';
import memoize from 'lodash-es/memoize';

import { SortArrows } from 'components/sort-arrows';
import { Pagination, PaginationConfig } from 'components/pagination';
import { Table } from 'components/table';

import { RawColumnsConfig, ColumnsConfig } from 'utils/types';

export const DEFAULT_COUNT_OF_ROWS_PER_PAGE = 30;

export interface ReactAdvancedDataTableProps extends Partial<PaginationConfig> {
  columnsConfig: RawColumnsConfig;
  data?: {
    [key: string]: any;
  }[] | null;
  rowsPerPage?: number;
}

export interface ReactAdvancedDataTableState {
  currentPage: number;
}

const initialSate: ReactAdvancedDataTableState = {
  currentPage: 1,
};

export class ReactAdvancedDataTable extends React.PureComponent<ReactAdvancedDataTableProps, ReactAdvancedDataTableState> {
  public state = initialSate;

  public componentWillReceiveProps(nextProps: Readonly<ReactAdvancedDataTableProps>) {
    // reset state if data or config changed
    if (
      this.props.data !== nextProps.data ||
        this.props.rowsPerPage !== nextProps.rowsPerPage
    ) {
      this.resetPageInfo();
    }
  }

  private resetPageInfo() {
    this.setState(initialSate);
    this.getTotalPages.cache.clear();
    this.getSplitedDataByPage.cache.clear();
  }

  private getProcessedColumnsConfigWithIndex: (configs: RawColumnsConfig) => ColumnsConfig = memoize((rowColumnConfig: RawColumnsConfig) => rowColumnConfig.map((config, index) => ({
    ...config,
    index,
  })))

  private getTotalPages = memoize(() => {
    if (this.props.data == null) {
      return 1;
    }
    const rowsPerPage = this.props.rowsPerPage || DEFAULT_COUNT_OF_ROWS_PER_PAGE;
    return Math.ceil(this.props.data.length / rowsPerPage);
  });

  private getSplitedDataByPage = memoize(
    () => {
      const pageNum = this.state.currentPage
      if (this.props.data == null) {
        return undefined;
      }
      const totalPages = this.getTotalPages();
      if (totalPages <= 1) {
        return this.props.data
      }
      const rowsPerPage = this.props.rowsPerPage || DEFAULT_COUNT_OF_ROWS_PER_PAGE;
      const countOfSkipped = rowsPerPage * (pageNum - 1);

      return this.props.data.slice(countOfSkipped, countOfSkipped + rowsPerPage);
    },
    () => this.state.currentPage,
  );

  private handlePageClick = (pageNum: number) => {
    this.setState({
      currentPage: pageNum,
    });
  }

  render() {
    return (
      <>
        <Table
          columnsConfig={this.getProcessedColumnsConfigWithIndex(this.props.columnsConfig)}
          data={this.getSplitedDataByPage()}
        />
        <Pagination
          currentPage={this.state.currentPage}
          totalPages={this.getTotalPages()}
          onPageClick={this.handlePageClick}
          // config of pagination
          pageThreshold={this.props.pageThreshold}
          showFlipButtons={this.props.showFlipButtons}
          locale={this.props.locale}
        />
      </>
    );
  }
}
