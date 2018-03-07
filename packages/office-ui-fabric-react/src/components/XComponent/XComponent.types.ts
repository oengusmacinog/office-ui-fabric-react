import * as React from 'react';
import { XComponent } from './XComponent';

export interface IXComponentProps extends React.Props<XComponent> {
	/**
	 * Get the component ref.
	 */
	componentRef?: () => void;
	beans: number;
	games: number[];
	title: string;
}