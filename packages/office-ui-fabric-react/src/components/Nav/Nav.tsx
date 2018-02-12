import { styled } from '../../Utilities';
import { NavBase } from './Nav.base';
import { INavProps } from './Nav.types';
import { getStyles } from './Nav.styles';

export const Nav = styled(
  NavBase,
  getStyles
);