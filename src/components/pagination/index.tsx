import * as React from 'react';
import { classNames } from 'utils/classnames';

import './style.styl';

export const CLASSNAMES = {
  container: 'clsprefix-pagination',
  page: 'clsprefix-pagination-page',
  currentPage: 'clsprefix-pagination-current-page',
  button: 'clsprefix-pagination-button',
  ellipsis: 'clsprefix-pagination-ellipsis',
  flipButton: 'clsprefix-flip-button',
};

export const defaultLocale = {
  prev: 'prev',
  next: 'next',
};

export const DEFAULT_THRESHOLD = 7;

export interface PaginationConfig {
  // NOTE: `pageThreshold` must be an odd number, at least 7
  pageThreshold: number;
  showFlipButtons: boolean;
  locale: {
    prev: string;
    next: string;
  }
}

export type OnClick = (pageNumber: number) => any;
export interface PaginationProps extends Partial<PaginationConfig> {
  totalPages: number;

  currentPage: number;

  pageThreshold?: number;

  onPageClick?: OnClick;

  showFlipButtons?: boolean;

  locale?: {
    prev: string;
    next: string;
  };
}

const ellipsisCode = {
  left: 'ellipsis-left',
  right: 'ellipsis-right',
}

type pagesCode = number | string;
type ListOfPagesCode = pagesCode[];
function isEllipsisCode (code: pagesCode): code is string {
  return code === ellipsisCode.left || code === ellipsisCode.right;
}

export const Pagination: React.SFC<PaginationProps> = props => {
  // NOTE: `threshold` must be an odd number, at least 7
  if (process.env.NODE_ENV !== 'production' && props.pageThreshold != null) {
    if (props.pageThreshold < 7) {
      console.warn(`the prop \`pageThreshold\` of <Pagination> can not less than 7, now use default value(${DEFAULT_THRESHOLD}) instead.`);
    } else if (props.pageThreshold % 2 === 0) {
      console.warn(`the prop \`pageThreshold\` of <Pagination> must be an odd number, now use default value(${DEFAULT_THRESHOLD}) instead.`);
    }
  }
  const threshold = (props.pageThreshold != null && props.pageThreshold >= 7 && props.pageThreshold % 2 !== 0) ? props.pageThreshold : DEFAULT_THRESHOLD;
  let listOfPagesCode: ListOfPagesCode;
  if (props.totalPages <= threshold) {
    /**
     * because the number of the total pages is too small,
     * we just display all the pages.
     */
    listOfPagesCode = Array.from(
      { length: props.totalPages },
      (_: void, index) => index + 1,
    );
  } else if (props.currentPage <= (threshold - 1) / 2) {
    /**
     * the current page is in the first few page,
     * so we don't need to render the left ellipsis.
     */
    listOfPagesCode = [
      ...Array.from({ length: threshold - 2 }, (_: void, index) => index + 1),
      ellipsisCode.right,
      props.totalPages,
    ];
  } else if (props.currentPage >= props.totalPages - (threshold - 1) / 2 + 1) {
    /**
     * the current page is in the last few page,
     * so we don't need to render the right ellipsis.
     */
    listOfPagesCode = [
      1,
      ellipsisCode.left,
      ...Array.from(
        { length: threshold - 2 },
        (_: void, index) => props.totalPages - threshold + 3 + index,
      ),
    ];
  } else {
    // normal rendering
    listOfPagesCode = [props.currentPage];
    for (let i = 1; i <= (threshold - 1) / 2 - 2; ++i) {
      listOfPagesCode.push(props.currentPage + i);
      listOfPagesCode.unshift(props.currentPage - i);
    }
    listOfPagesCode.push(ellipsisCode.right);
    listOfPagesCode.unshift(ellipsisCode.left);
    listOfPagesCode.push(props.totalPages);
    listOfPagesCode.unshift(1);
  }

  return (
    <div className={CLASSNAMES.container}>
      {
        (props.showFlipButtons === true && props.currentPage !== 1) && (
          <div
            className={classNames(CLASSNAMES.flipButton, CLASSNAMES.button)}
            /**
             * NOTE: have to force convert type due to this issue:
             * https://github.com/Microsoft/TypeScript/issues/20816
             */
            onClick={props.onPageClick && (() => {(props.onPageClick as any)(props.currentPage - 1)})}
          >
            {
              props.locale != null ? props.locale.prev : defaultLocale.prev
            }
          </div>
        )
      }
      {
        listOfPagesCode.map(code => {
          if (isEllipsisCode(code)) {
            return (
              <span
                key={code}
                className={classNames(CLASSNAMES.page, CLASSNAMES.ellipsis)}
              >
                …
              </span>
            );
          }
          if (code === props.currentPage) {
            return (
              <span
                key={code}
                className={classNames(CLASSNAMES.page, CLASSNAMES.currentPage)}
              >
                {props.currentPage}
              </span>
            );
          }

          const handleClick = props.onPageClick &&
            function() {
              (props.onPageClick as OnClick)(code);
            };
          return (
            <button
              key={code}
              className={classNames(CLASSNAMES.page, CLASSNAMES.button)}
              onClick={handleClick}
            >
              {code}
            </button>
          );
        })
      }
      {
        (props.showFlipButtons === true && props.currentPage !== props.totalPages) && (
          <div
            className={classNames(CLASSNAMES.flipButton, CLASSNAMES.button)}
            // NOTE: same as previous button
            onClick={props.onPageClick && (() => {(props.onPageClick as any)(props.currentPage + 1)})}
          >
            {
              props.locale != null ? props.locale.next : defaultLocale.next
            }
          </div>
        )
      }
    </div>
  );
};
