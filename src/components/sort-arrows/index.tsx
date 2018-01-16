import * as React from 'react';
import { classNames } from 'utils/classnames';

import './style.styl';

export const CLASSNAMES = {
  container: 'clsprefix-sort-arrows',
  arrow: 'clsprefix-sort-arrow',
  topArrow: 'clsprefix-sort-arrow-top',
  bottomArrow: 'clsprefix-sort-arrow-bottom',
  activeArrow: 'clsprefix-sort-arrow-active',
};

export interface SortArrowsProps {
  type?: 'top' | 'bottom';
  onClick?: () => void;
}

export const SortArrows: React.SFC<SortArrowsProps> = props => (
  <div className={CLASSNAMES.container} onClick={props.onClick}>
    <div
      className={classNames(
        CLASSNAMES.arrow,
        CLASSNAMES.topArrow,
        {
          [CLASSNAMES.activeArrow]: props.type === 'top',
        },
      )}
    />
    <div
      className={classNames(
        CLASSNAMES.arrow,
        CLASSNAMES.bottomArrow,
        {
          [CLASSNAMES.activeArrow]: props.type === 'bottom',
        },
      )}
    />
  </div>
);
