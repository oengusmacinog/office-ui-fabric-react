import * as React from 'react';
import { XComponent } from '../XComponent';
import { IXComponentProps } from '../XComponent.types';

export class XComponentExample extends React.Component<{}, {}> {
	render() {
		return(
			<XComponent 
				beans={ 1 }
				title="Test Title"
				games={ [
					1,
					3,
					4
				] }
			/>
		)
	}
}