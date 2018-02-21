import * as React from 'react';
import {
  BaseComponent,
  KeyCodes,
  autobind,
  elementContains,
  getNativeProps,
  divProperties,
  getFirstFocusable,
  getLastTabbable,
  getNextElement
} from '../../Utilities';
import { IFocusTrapZone, IFocusTrapZoneProps } from './FocusTrapZone.types';

export class FocusTrapZone extends BaseComponent<IFocusTrapZoneProps, {}> implements IFocusTrapZone {

  private static _focusStack: FocusTrapZone[] = [];
  private static _clickStack: FocusTrapZone[] = [];

  public refs: {
    [key: string]: React.ReactInstance,
    root: HTMLElement
  };

  private _previouslyFocusedElement: HTMLElement;
  private _isInFocusStack: boolean = false;
  private _isInClickStack: boolean = false;

  public componentWillMount() {
    const { isClickableOutsideFocusTrap = false, forceFocusInsideTrap = true } = this.props;
    if (forceFocusInsideTrap) {
      this._isInFocusStack = true;
      FocusTrapZone._focusStack.push(this);
    }
    if (!isClickableOutsideFocusTrap) {
      this._isInClickStack = true;
      FocusTrapZone._clickStack.push(this);
    }
  }

  public componentDidMount() {
    const { isClickableOutsideFocusTrap = false, forceFocusInsideTrap = true, elementToFocusOnDismiss, disableFirstFocus = false } = this.props;

    this._previouslyFocusedElement = elementToFocusOnDismiss ? elementToFocusOnDismiss : document.activeElement as HTMLElement;
    if (!elementContains(this.refs.root, this._previouslyFocusedElement) && !disableFirstFocus) {
      this.focus();
    }

    if (forceFocusInsideTrap) {
      this._events.on(window, 'focus', this._forceFocusInTrap, true);
    }

    if (!isClickableOutsideFocusTrap) {
      this._events.on(window, 'click', this._forceClickInTrap, true);
    }
  }

  public componentWillReceiveProps(nextProps: IFocusTrapZoneProps) {
    const { elementToFocusOnDismiss } = nextProps;
    if (elementToFocusOnDismiss && this._previouslyFocusedElement !== elementToFocusOnDismiss) {
      this._previouslyFocusedElement = elementToFocusOnDismiss;
    }
  }

  public componentWillUnmount() {
    const { ignoreExternalFocusing } = this.props;

    this._events.dispose();
    if (this._isInFocusStack || this._isInClickStack) {
      const filter = (value: FocusTrapZone) => {
        return this !== value;
      };
      if (this._isInFocusStack) {
        FocusTrapZone._focusStack = FocusTrapZone._focusStack.filter(filter);
      }
      if (this._isInClickStack) {
        FocusTrapZone._clickStack = FocusTrapZone._clickStack.filter(filter);
      }
    }

    if (!ignoreExternalFocusing && this._previouslyFocusedElement && typeof this._previouslyFocusedElement.focus === 'function') {
      this._previouslyFocusedElement.focus();
    }
  }

  public render() {
    const { className, ariaLabelledBy } = this.props;
    const divProps = getNativeProps(this.props, divProperties);

    return (
      <div
        { ...divProps }
        className={ className }
        ref='root'
        aria-labelledby={ ariaLabelledBy }
        onKeyDown={ this._onKeyboardHandler }
      >
        { this.props.children }
      </div>
    );
  }

  /**
   * Need to expose this method in case of popups since focus needs to be set when popup is opened
   */
  public focus() {
    const { firstFocusableSelector } = this.props;
    const focusSelector = typeof firstFocusableSelector === 'string'
      ? firstFocusableSelector
      : firstFocusableSelector && firstFocusableSelector();

    let _firstFocusableChild;
    const root = this.refs.root;

    if (focusSelector) {
      _firstFocusableChild = root.querySelector('.' + focusSelector);
    } else {
      _firstFocusableChild = getNextElement(root, root.firstChild as HTMLElement, true, false, false, true);
    }
    if (_firstFocusableChild) {
      (_firstFocusableChild as any).focus();
    }
  }

  @autobind
  private _onKeyboardHandler(ev: React.KeyboardEvent<HTMLElement>) {
    if (ev.which !== KeyCodes.tab) {
      return;
    }

    const { root } = this.refs;

    const _firstFocusableChild = getFirstFocusable(root, root.firstChild as HTMLElement, true);
    const _lastFocusableChild = getLastTabbable(root, root.lastChild as HTMLElement, true);

    if (ev.shiftKey && _firstFocusableChild === ev.target) {
      _lastFocusableChild!.focus();
      ev.preventDefault();
      ev.stopPropagation();
    } else if (!ev.shiftKey && _lastFocusableChild === ev.target) {
      _firstFocusableChild!.focus();
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  private _forceFocusInTrap(ev: FocusEvent) {
    if (FocusTrapZone._focusStack.length && this === FocusTrapZone._focusStack[FocusTrapZone._focusStack.length - 1]) {
      const focusedElement = document.activeElement as HTMLElement;

      if (!elementContains(this.refs.root, focusedElement)) {
        this.focus();
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  }

  private _forceClickInTrap(ev: MouseEvent) {
    if (FocusTrapZone._clickStack.length && this === FocusTrapZone._clickStack[FocusTrapZone._clickStack.length - 1]) {
      const clickedElement = ev.target as HTMLElement;

      if (clickedElement && !elementContains(this.refs.root, clickedElement)) {
        this.focus();
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  }
}
