import { IButtonStyles } from '../Button.types';
import {
  ITheme,
  concatStyleSets
} from '../../../Styling';
import { memoizeFunction } from '../../../Utilities';
import {
  getStyles as getBaseButtonStyles
} from '../BaseButton.styles';
import {
  getStyles as getSplitButtonStyles
} from '../SplitButton/SplitButton.styles';

export const getStyles = memoizeFunction((
  theme: ITheme,
  customStyles?: IButtonStyles
): IButtonStyles => {
  const baseButtonStyles: IButtonStyles = getBaseButtonStyles(theme);
  const splitButtonStyles: IButtonStyles = getSplitButtonStyles(theme);
  const iconButtonStyles: IButtonStyles = {
    root: {
      padding: '0 4px',
      width: '32px',
      height: '32px',
      backgroundColor: 'transparent'
    },

    rootHovered: {
      color: theme.palette.themeDarker
    },

    rootPressed: {
      color: theme.palette.themePrimary
    },

    rootExpanded: {
      color: theme.palette.themePrimary
    },

    rootChecked: {
      backgroundColor: theme.palette.neutralTertiaryAlt,
    },

    rootCheckedHovered: {
      backgroundColor: theme.palette.neutralLight
    },

    rootDisabled: {
      color: theme.palette.neutralTertiary
    }
  };

  return concatStyleSets(baseButtonStyles, iconButtonStyles, splitButtonStyles, customStyles)!;
});
