import { NavBase } from './Nav.base';
import { INavProps, INavStyleProps, INavStyles } from './Nav.types';

export function getStyles(props: INavStyleProps): INavStyles {
  const { theme } = props;
  const { palette, fonts, semanticColors } = theme;

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