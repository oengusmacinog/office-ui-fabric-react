import * as React from 'react';

import * as ReactDOM from 'react-dom';

import { PanelBase } from './Panel.base';

let div: HTMLElement;

describe('Panel', () => {
  beforeEach(() => {
    div = document.createElement('div');
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('fires the correct events when closing', done => {
    let dismissedCalled = false;
    let dismissCalled = false;
    const setDismissTrue = (): void => {
      dismissCalled = true;
    };
    const setDismissedTrue = (): void => {
      dismissedCalled = true;
    };

    const panel: PanelBase = ReactDOM.render(
      <PanelBase isOpen={true} onDismiss={setDismissTrue} onDismissed={setDismissedTrue} />,
      div
    ) as any;

    panel.dismiss();

    expect(dismissCalled).toEqual(true);
    expect(dismissedCalled).toEqual(false);

    setTimeout(() => {
      try {
        expect(dismissedCalled).toEqual(true);
        done();
      } catch (e) {
        done(e);
      }
    }, 250);
  });
});
