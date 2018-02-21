/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */

import {
  BaseComponent,
  autobind,
  css,
  getId,
  getRTL
} from '../../Utilities';
import { FocusTrapZone } from '../FocusTrapZone/index';
import { IPanel, IPanelProps, PanelType } from './Panel.types';
import { Layer } from '../Layer/Layer';
import { Overlay } from '../../Overlay';
import { Popup } from '../../Popup';
import { IconButton } from '../../Button';
import { AnimationClassNames, getTheme, FontSizes, IconFontSizes } from '../../Styling';
import * as stylesImport from './Panel.scss';
const styles: any = stylesImport;
const theme = getTheme();

export interface IPanelState {
  isFooterSticky?: boolean;
  isOpen?: boolean;
  isAnimating?: boolean;
  id?: string;
}

export class Panel extends BaseComponent<IPanelProps, IPanelState> implements IPanel {

  public static defaultProps: IPanelProps = {
    isHiddenOnDismiss: false,
    isOpen: false,
    isBlocking: true,
    hasCloseButton: true,
    type: PanelType.smallFixedFar,
  };

  private _content: HTMLElement;

  constructor(props: IPanelProps) {
    super(props);

    this._warnDeprecations({
      'ignoreExternalFocusing': 'focusTrapZoneProps',
      'forceFocusInsideTrap': 'focusTrapZoneProps',
      'firstFocusableSelector': 'focusTrapZoneProps'
    });

    this.state = {
      isFooterSticky: false,
      isOpen: false,
      isAnimating: false,
      id: getId('Panel')
    };
  }

  public componentDidMount() {
    this._events.on(window, 'resize', this._updateFooterPosition);

    if (this.props.isOpen) {
      this.open();
    }
  }

  public componentWillReceiveProps(newProps: IPanelProps) {
    if (newProps.isOpen !== this.state.isOpen) {
      if (newProps.isOpen) {
        this.open();
      } else {
        this.dismiss();
      }
    }
  }

  public render() {
    const {
      className = '',
      elementToFocusOnDismiss,
      firstFocusableSelector,
      focusTrapZoneProps,
      forceFocusInsideTrap,
      hasCloseButton,
      headerText,
      ignoreExternalFocusing,
      isBlocking,
      isLightDismiss,
      isHiddenOnDismiss,
      layerProps,
      type,
      customWidth,
      onLightDismissClick = this._onPanelClick,
      onRenderNavigation = this._onRenderNavigation,
      onRenderHeader = this._onRenderHeader,
      onRenderBody = this._onRenderBody,
      onRenderFooter = this._onRenderFooter
    } = this.props;
    const { isOpen, isAnimating, id } = this.state;
    const isLeft = type === PanelType.smallFixedNear ? true : false;
    const isRTL = getRTL();
    const isOnRightSide = isRTL ? isLeft : !isLeft;
    const headerTextId = id + '-headerText';
    const customWidthStyles = (type === PanelType.custom) ? { width: customWidth } : {};
    const renderProps: IPanelProps = { ...this.props, componentId: id };

    if (!isOpen && !isAnimating && !isHiddenOnDismiss) {
      return null;
    }

    let overlay;
    if (isBlocking && isOpen) {
      overlay = (
        <Overlay
          className={ css(
            styles.overlay,
            isOpen && isAnimating && AnimationClassNames.fadeIn200,
            !isOpen && isAnimating && AnimationClassNames.fadeOut200
          ) }
          isDarkThemed={ false }
          onClick={ isLightDismiss ? onLightDismissClick : undefined }
        />
      );
    }

    return (
      <Layer { ...layerProps }>
        <Popup
          role='dialog'
          ariaLabelledBy={ headerText && headerTextId }
          onDismiss={ this.dismiss }
          className={
            css(
              !isOpen && !isAnimating && isHiddenOnDismiss && styles.hiddenPanel
            )
          }
        >
          <div
            className={
              css(
                'ms-Panel',
                styles.root,
                className,
                // because the RTL animations are not being used, we need to set a class
                isOpen && ('is-open ' + styles.rootIsOpen),
                type === PanelType.smallFluid && ('ms-Panel--smFluid ' + styles.rootIsSmallFluid),
                type === PanelType.smallFixedNear && ('ms-Panel--smLeft ' + styles.rootIsSmallLeft),
                type === PanelType.smallFixedFar && ('ms-Panel--sm ' + styles.rootIsSmall),
                type === PanelType.medium && ('ms-Panel--md ' + styles.rootIsMedium),
                (type === PanelType.large || type === PanelType.largeFixed) && ('ms-Panel--lg ' + styles.rootIsLarge),
                type === PanelType.largeFixed && ('ms-Panel--fixed ' + styles.rootIsFixed),
                type === PanelType.extraLarge && ('ms-Panel--xl ' + styles.rootIsXLarge),
                type === PanelType.custom && ('ms-Panel--custom ' + styles.rootIsCustom),
                hasCloseButton && ('ms-Panel--hasCloseButton ' + styles.rootHasCloseButton),
                !isOpen && !isAnimating && isHiddenOnDismiss && styles.hiddenPanel
              )
            }
          >
            { overlay }
            <FocusTrapZone
              ignoreExternalFocusing={ ignoreExternalFocusing }
              forceFocusInsideTrap={ forceFocusInsideTrap }
              firstFocusableSelector={ firstFocusableSelector }
              { ...focusTrapZoneProps }
              className={
                css(
                  'ms-Panel-main',
                  styles.main,
                  isOpen && isAnimating && !isOnRightSide && AnimationClassNames.slideRightIn40,
                  isOpen && isAnimating && isOnRightSide && AnimationClassNames.slideLeftIn40,
                  !isOpen && isAnimating && !isOnRightSide && AnimationClassNames.slideLeftOut40,
                  !isOpen && isAnimating && isOnRightSide && AnimationClassNames.slideRightOut40,
                  focusTrapZoneProps ? focusTrapZoneProps.className : undefined
                ) }
              style={ customWidthStyles }
              elementToFocusOnDismiss={ elementToFocusOnDismiss }
              isClickableOutsideFocusTrap={ isLightDismiss || isHiddenOnDismiss }
            >
              <div className={ css('ms-Panel-commands') } data-is-visible={ true } >
                { onRenderNavigation(renderProps, this._onRenderNavigation) }
              </div>
              <div className={ css('ms-Panel-contentInner', styles.contentInner) } >
                { onRenderHeader(renderProps, this._onRenderHeader) }
                { onRenderBody(renderProps, this._onRenderBody) }
                { onRenderFooter(renderProps, this._onRenderFooter) }
              </div>
            </FocusTrapZone>
          </div>
        </Popup>
      </Layer>
    );
  }

  public open() {
    if (!this.state.isOpen) {
      this.setState({
        isOpen: true,
        isAnimating: true
      }, () => {
        this._async.setTimeout(this._onTransitionComplete, 200);
      });
    }
  }

  @autobind
  public dismiss() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false,
        isAnimating: true
      }, () => {
        this._async.setTimeout(this._onTransitionComplete, 200);
      });

      if (this.props.onDismiss) {
        this.props.onDismiss();
      }
    }
  }

  @autobind
  private _onRenderNavigation(props: IPanelProps): JSX.Element | null {
    const {
      closeButtonAriaLabel,
      hasCloseButton
    } = props;
    if (hasCloseButton) {
      return (
        <div className={ css('ms-Panel-navigation', styles.navigation) } >
          <IconButton
            styles={
              {
                root: {
                  height: 'auto',
                  width: '44px',
                  color: theme.palette.neutralSecondary,
                  fontSize: IconFontSizes.large,
                },
                rootHovered: {
                  color: theme.palette.neutralPrimary
                }
              }
            }
            className={ css('ms-Panel-closeButton ms-PanelAction-close') }
            onClick={ this._onPanelClick }
            ariaLabel={ closeButtonAriaLabel }
            data-is-visible={ true }
            iconProps={ { iconName: 'Cancel' } }
          />
        </div>
      );
    }
    return null;
  }

  @autobind
  private _onRenderHeader(props: IPanelProps): JSX.Element | null {
    const {
      headerText,
      componentId,
      headerClassName = '',
    } = props;

    if (headerText) {
      return (
        <div className={ css('ms-Panel-header', styles.header) }>
          <p className={ css('ms-Panel-headerText', styles.headerText, headerClassName) } id={ componentId + '-headerText' } role='heading'>
            { headerText }
          </p>
        </div>
      );
    }
    return null;
  }

  @autobind
  private _onRenderBody(props: IPanelProps): JSX.Element {
    const contentClass = css(
      'ms-Panel-content',
      styles.content,
      props.isFooterAtBottom && styles.contentGrow
    );

    return (
      <div ref={ this._resolveRef('_content') } className={ contentClass } >
        { props.children }
      </div>
    );
  }

  @autobind
  private _onRenderFooter(props: IPanelProps): JSX.Element | null {
    const { isFooterSticky } = this.state;
    const { onRenderFooterContent = null } = this.props;
    if (onRenderFooterContent) {
      return (
        <div className={ css('ms-Panel-footer', styles.footer, isFooterSticky && styles.footerIsSticky) } >
          <div className={ css('ms-Panel-footerInner', styles.footerInner) }>
            { onRenderFooterContent() }
          </div>
        </div>
      );
    }
    return null;
  }

  private _updateFooterPosition() {
    const _content = this._content;
    if (_content) {
      const height = _content.clientHeight;
      const innerHeight = _content.scrollHeight;

      this.setState({
        isFooterSticky: height < innerHeight ? true : false
      });
    }
  }

  @autobind
  private _onPanelClick() {
    this.dismiss();
  }

  @autobind
  private _onTransitionComplete() {
    this.setState({
      isAnimating: false
    });

    if (!this.state.isOpen && this.props.onDismissed) {
      this.props.onDismissed();
    }
  }
}
