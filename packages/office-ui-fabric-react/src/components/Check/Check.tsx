import * as React from 'react';
import { styled } from '../../Utilities';
import { CheckBase } from './Check.base';
import { getStyles } from './Check.styles';
import { ICheckProps, ICheckStyleProps, ICheckStyles } from './Check.types';

export const Check: React.StatelessComponent<ICheckProps> = styled<ICheckProps, ICheckStyleProps, ICheckStyles>(
  CheckBase,
  getStyles,
  undefined,
  { scope: 'Check' }
);
