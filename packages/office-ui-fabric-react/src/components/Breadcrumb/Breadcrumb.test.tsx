/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */

import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import * as renderer from 'react-test-renderer';

import { Breadcrumb } from './Breadcrumb';
import { IBreadcrumbItem } from './Breadcrumb.types';

describe('Breadcrumb', () => {
  it('renders breadcumb correctly', () => {
    const items: IBreadcrumbItem[] = [
      { text: 'TestText1', key: 'TestKey1' },
      { text: 'TestText2', key: 'TestKey2' },
      { text: 'TestText3', key: 'TestKey3' },
      { text: 'TestText4', key: 'TestKey4' }
    ];

    let component = renderer.create(
      <Breadcrumb
        items={ items }
      />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // With overflow
    component = renderer.create(
      <Breadcrumb
        items={ items }
        maxDisplayedItems={ 2 }
      />
    );

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('can call the callback when an item is clicked', () => {
    let callbackValue;
    const clickCallback = (ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem) => {
      callbackValue = item.key;
    };

    const items: IBreadcrumbItem[] = [
      { text: 'TestText', key: 'TestKey', onClick: clickCallback }
    ];

    const component = ReactTestUtils.renderIntoDocument<Breadcrumb>(
      <Breadcrumb
        items={ items }
      />
    );

    const renderedDOM = ReactDOM.findDOMNode(component as React.ReactInstance);
    const itemLink = renderedDOM.querySelector('.ms-Breadcrumb-itemLink');

    ReactTestUtils.Simulate.click(itemLink!);
    expect(callbackValue).toEqual('TestKey');
  });

  it('moves items to overflow in the correct order', () => {

    const items: IBreadcrumbItem[] = [
      { text: 'TestText1', key: 'TestKey1' },
      { text: 'TestText2', key: 'TestKey2' },
      { text: 'TestText3', key: 'TestKey3' },
      { text: 'TestText4', key: 'TestKey4' }
    ];

    const component = ReactTestUtils.renderIntoDocument<Breadcrumb>(
      <Breadcrumb
        items={ items }
        maxDisplayedItems={ 2 }
      />
    );

    const renderedDOM = ReactDOM.findDOMNode(component as React.ReactInstance);
    const itemLink = renderedDOM.querySelectorAll('.ms-Breadcrumb-item');

    expect(itemLink[0].textContent).toEqual('TestText3');
  });

});
