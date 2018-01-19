import { IStyle } from '../../Styling';

export interface IXComponentStylingProps {
	isTestProp: boolean;
	bgColor: string;
}

export interface IXComponentStyles {
	 /**
	 * Style for the root element in the default enabled/unchecked state
	 */

	 root?: IStyle;
	 fooClass?: IStyle;
}

export function getStyles(props: IXComponentStylingProps): IXComponentStyles {
	return {
		root: {
			/**
			 * Style properties go here
			 */
			 backgroundColor: props.bgColor,
			 selectors: {
			 	":hover": {
			 		backgroundColor: "#0000ff"
			 	}
			 }
		},
		fooClass: {
			color: "55ffff"
		}
	}
}
