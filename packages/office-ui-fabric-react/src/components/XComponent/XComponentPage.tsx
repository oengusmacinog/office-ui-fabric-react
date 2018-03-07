import * as React from 'react';
import {
	ComponentPage,
	ExampleCard,
	IComponentDemoPageProps,
	PropertiesTableSet
} from '@uifabric/example-app-base';

import { XComponentExample } from './examples/XComponent.Example';

const XCompoentExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/XComponent/examples/XComponent.Example.tsx') as string;

export class XComponentPage extends React.Component<{}, {}> {
	render() {
		return(
			<ComponentPage
				title="X Component"
				componentName="XComponent"
				overview={
					<div>Hey dis a overview</div>
				}
				exampleCards={
					<div>
						<ExampleCard
							title="X Component Main Example"
							code={ XCompoentExampleCode }
						>
							<XComponentExample />
						</ExampleCard>
					</div>
				}
			/>
		)
	}
}