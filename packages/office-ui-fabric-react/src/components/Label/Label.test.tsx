/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */

import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import * as renderer from 'react-test-renderer';

import { Label } from './Label';

describe('Label', () => {

  it('renders a label', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <Label>test</Label>
    );
    const renderedDOM = ReactDOM.findDOMNode(component as React.ReactInstance);

    expect(renderedDOM.textContent).toEqual('test');
  });

  it('renders label correctly', () => {
    const component = renderer.create(
      <Label>test</Label>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
