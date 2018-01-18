import * as React from 'react';
import { BaseComponent } from '../../Utilities';
import { IXComponentProps } from './XComponent.types';

export class XComponent extends BaseComponent<IXComponentProps, {}> {
	render() {
		return(
			<div>Hello X</div>
		);
	}
}