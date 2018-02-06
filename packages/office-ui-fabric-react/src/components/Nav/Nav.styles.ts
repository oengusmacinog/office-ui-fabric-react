import { NavBase } from './Nav.base';
import { INavProps, INavStylingProps, INavStyles } from './Nav.types';

export function getStyles(props: INavStylingProps): INavStyles {
  return {
    root: {
      overflowY: 'auto',
      // webkitOverflowScrolling: 'touch',
      userSelect: 'none'
    },
    rootIsOnTop: {
      position: 'absolute'
    }
  }
}