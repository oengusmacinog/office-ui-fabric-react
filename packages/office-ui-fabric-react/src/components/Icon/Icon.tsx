/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { IIconProps, IconType } from './Icon.types';
import { Image } from '../Image/Image';
import {
  css,
  getNativeProps,
  htmlElementProperties
} from '../../Utilities';
import { getIcon, IIconRecord } from '../../Styling';
import { getClassNames } from './Icon.classNames';

export const Icon = (props: IIconProps): JSX.Element => {
  const {
    ariaLabel,
    className,
    styles,
    iconName
   } = props;
  const classNames = getClassNames(
    styles
  );

  if (props.iconType === IconType.image || props.iconType === IconType.Image) {
    const containerClassName = css(
      'ms-Icon-imageContainer',
      classNames.root,
      classNames.imageContainer,
      className
    );

    return (
      <div
        className={
          css(
            containerClassName,
            classNames.root
          ) }
      >
        <Image { ...props.imageProps as any } />
      </div>
    );
  } else if (typeof iconName === 'string' && iconName.length === 0) {
    return (
      <i
        aria-label={ ariaLabel }
        { ...(ariaLabel ? {} : {
          role: 'presentation',
          'aria-hidden': true
        }) }
        { ...getNativeProps(props, htmlElementProperties) }
        className={
          css(
            'ms-Icon-placeHolder',
            classNames.rootHasPlaceHolder,
            props.className
          ) }
      />
    );
  } else {
    const iconDefinition = getIcon(iconName) || {
      subset: {
        className: undefined
      },
      code: undefined
    };

    return (
      <i
        aria-label={ ariaLabel }
        { ...(ariaLabel ? {} : {
          role: 'presentation',
          'aria-hidden': true,
          'data-icon-name': iconName,
        }) }
        { ...getNativeProps(props, htmlElementProperties) }
        className={
          css(
            iconDefinition.subset.className,
            classNames.root,
            props.className
          ) }
      >
        { iconDefinition.code }
      </i>
    );
  }
};
