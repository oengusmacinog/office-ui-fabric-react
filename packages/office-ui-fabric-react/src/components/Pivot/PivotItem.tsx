import * as React from 'react';
import {
  // @remove for prod
  IBaseProps,
  BaseComponent,
  getNativeProps,
  divProperties,
  // @remove for prod
  IComponentAs
} from '../../Utilities';
import { IPivotItemProps } from './PivotItem.types';

export class PivotItem extends BaseComponent<IPivotItemProps, {}> {

  public render() {
    const ElementType = getElementType<IPivotItemProps>(this.props.as, 'div');
    const ElementAttributes = getElementAttributes<IPivotItemProps>(this.props.as, this.props)
    return (
      <ElementType
        { ...ElementAttributes }
        { ...getNativeProps(this.props, divProperties) }
      >
        { this.props.children }
      </ElementType>
    );
  }
}

export function getElementType<P>(
  as: string | IComponentAs<P> | undefined,
  defaultElement?: string
): IComponentAs<P> | string {

  if (as) return as;

  if (defaultElement) {
    return defaultElement;
  }

  return 'div';
}

export function getElementAttributes<P extends IBaseProps>(
  as: string | IComponentAs<P> | undefined,
  props: P
): object | undefined {

  if (typeof as === 'function') {
    return props;
  }

  return props.with;
}