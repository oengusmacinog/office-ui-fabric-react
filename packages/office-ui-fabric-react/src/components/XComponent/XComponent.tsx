import * as React from 'react';
import { BaseComponent, css, classNamesFunction } from '../../Utilities';
import { IXComponentProps } from './XComponent.types';
import { getStyles, IXComponentStylingProps, IXComponentStyles } from './XComponent.styles';

export interface IXComponentState {
	bgColor: string;
}

export class XComponent extends BaseComponent<IXComponentProps, {}> {
	render() {
		const getClassNames = classNamesFunction<IXComponentStylingProps, IXComponentStyles>();
		const classNames = getClassNames(getStyles, {
			isTestProp: true,
			bgColor: "#000000"
		});

		return (
			<div
				className={ css(classNames.root) }
			>Hello World!</div>
		);
	}
}