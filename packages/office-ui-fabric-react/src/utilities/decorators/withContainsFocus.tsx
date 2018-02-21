import * as React from 'react';
import { BaseDecorator } from './BaseDecorator';

export function withContainsFocus<TProps extends { containsFocus?: boolean }, S>(ComposedComponent: (new (props: TProps, ...args: any[]) => (React.Component<TProps, S>))): any {

  return class WithContainsFocusComponent extends BaseDecorator<TProps & { containsFocus?: boolean }, { containsFocus?: boolean }> {
    public refs: {
      [key: string]: React.ReactInstance,
    };

    private _newContainsFocus: boolean;
    private _delayedSetContainsFocus: () => void;

    constructor(props: TProps) {
      super(props);

      this.state = {
        containsFocus: false
      };

      this._delayedSetContainsFocus = this._async.debounce(this._setContainsFocus, 20);
      this._updateComposedComponentRef = this._updateComposedComponentRef.bind(this);
      this._handleFocus = this._handleFocus.bind(this);
      this._handleBlur = this._handleBlur.bind(this);
    }

    public componentWillUnmount() {
      this._async.dispose();
    }

    public render() {
      const { containsFocus } = this.state;

      return (
        <div ref='root' onFocus={ this._handleFocus } onBlur={ this._handleBlur }>
          <ComposedComponent
            ref={ this._updateComposedComponentRef }
            containsFocus={ containsFocus }
            { ...this.props as any }
          />
        </div>
      );
    }

    public forceUpdate() {
      this._composedComponentInstance.forceUpdate();
    }

    private _handleFocus(ev: React.FocusEvent<HTMLDivElement>) {
      this._newContainsFocus = true;
      this._delayedSetContainsFocus();
    }

    private _handleBlur(ev: React.FocusEvent<HTMLDivElement>) {
      this._newContainsFocus = false;
      this._delayedSetContainsFocus();
    }

    private _setContainsFocus() {
      if (this.state.containsFocus !== this._newContainsFocus) {
        this.setState({ containsFocus: this._newContainsFocus });
      }
    }
  };
}
