import * as React from 'react';
import {
  autobind,
  BaseComponent,
  classNamesFunction,
  css,
  customizable,
  divProperties,
  getNativeProps,
  getRTL
} from '../../Utilities';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { ActionButton, IButtonStyles } from '../../Button';
import { Icon } from '../../Icon';
import * as stylesImport from './Nav.scss';
const styles: any = stylesImport;
import { AnimationClassNames, mergeStyles } from '../../Styling';
import {
  INav,
  INavProps,
  INavLinkGroup,
  INavLink,
  INavStyleProps,
  INavStyles
} from './Nav.types';

// The number pixels per indentation level for Nav links.
const _indentationSize: number = 14;

// The number of pixels of left margin
const _baseIndent: number = 3;

// The number of pixels of padding to add to the far side of the button (allows ellipsis to happen)
const _farSidePadding: number = 20;

// global var used in _isLinkSelectedKey
let _urlResolver: HTMLAnchorElement | undefined;

export function isRelativeUrl(url: string): boolean {
  // A URL is relative if it has no protocol.
  return !!url && !/^[a-z0-9+-.]:\/\//i.test(url);
}

const getClassNames = classNamesFunction<INavStyleProps, INavStyles>();

export interface INavState {
  isGroupCollapsed?: { [key: string]: boolean };
  isLinkExpandStateChanged?: boolean;
  selectedKey?: string;
}

@customizable('Nav', ['theme'])
export class NavBase extends BaseComponent<INavProps, INavState> implements INav {

  public static defaultProps: INavProps = {
    groups: null
  };

  private _hasExpandButton: boolean;

  constructor(props: INavProps) {
    super(props);

    this.state = {
      isGroupCollapsed: {},
      isLinkExpandStateChanged: false,
      selectedKey: props.initialSelectedKey || props.selectedKey,
    };

    if (props.groups) {
      for (let group of props.groups) {
        if (group.collapseByDefault && group.name) {
          this.state.isGroupCollapsed![group.name] = true;
        }
      }
    }
    this._hasExpandButton = false;
  }

  public componentWillReceiveProps(newProps: INavProps) {
    let newGroups = newProps.groups || [];
    let isGroupCollapsed = this.state.isGroupCollapsed!;

    // If the component's props were updated, new groups may have been added, which may have
    // collapseByDefault set. Ensure that setting is respected for any new groups.
    // (If isGroupCollapsed is already set for a group, don't overwrite that.)
    let hasUpdated = false;
    for (let newGroup of newGroups) {
      if (newGroup.name && newGroup.collapseByDefault && !isGroupCollapsed.hasOwnProperty(newGroup.name)) {
        isGroupCollapsed[newGroup.name] = true;
        hasUpdated = true;
      }
    }

    if (hasUpdated) {
      this.setState({
        isGroupCollapsed: isGroupCollapsed
      });
    }
  }

  private _classNames = getClassNames(
    this.props.getStyles!,
    {
      theme: this.props.theme!,
      className: this.props.className,
      isOnTop: this.props.isOnTop
    }
  );

  public render(): JSX.Element | null {
    const {
      groups,
      className
    } = this.props;

    if (!groups) {
      return null;
    }

    // When groups[x].name is specified or any of the links have children, the expand/collapse
    // chevron button is shown and different padding is needed. _hasExpandButton marks this condition.
    this._hasExpandButton = groups.some((group: INavLinkGroup) => {
      return group ? !!group.name || (group.links && group.links.some((link: INavLink) => {
        return !!(link && link.links && link.links.length);
      })) : false;
    });

    const groupElements: React.ReactElement<{}>[] = groups.map(this._renderGroup);

    return (
      <FocusZone direction={ FocusZoneDirection.vertical }>
        <nav
          role='navigation'
          className={ this._classNames.root }
        >
          { groupElements }
        </nav>
      </FocusZone>
    );
  }

  public get selectedKey(): string | undefined {
    return this.state.selectedKey;
  }

  @autobind
  private _onRenderLink(link: INavLink) {
    // return (<div className={ styles.linkText }>{ link.name }</div>);
    return (<div className={ this._classNames.linkText }>{ link.name }</div>);
  }

  private _renderNavLink(link: INavLink, linkIndex: number, nestingLevel: number) {
    const isRtl: boolean = getRTL();
    const paddingBefore = _indentationSize * nestingLevel + _baseIndent;
    const buttonStyles: IButtonStyles = {
      root: {
        [isRtl ? 'paddingRight' : 'paddingLeft']: paddingBefore,
        [isRtl ? 'paddingLeft' : 'paddingRight']: _farSidePadding,
      },
      textContainer: {
        overflow: 'hidden',
      },
      label: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        lineHeight: '36px'
      }
    };
    let {
      onRenderLink = this._onRenderLink
    } = this.props;

    // Prevent hijacking of the parent window if link.target is defined
    const rel = link.url && link.target && !isRelativeUrl(link.url) ? 'noopener noreferrer' : undefined;

    return (
      <ActionButton
        className={ mergeStyles(
          'ms-Nav-link' + link.onClick && 'ms-Nav-linkButton',
          styles.link,
          link.onClick && !link.forceAnchor && styles.buttonEntry,
          this._hasExpandButton && 'isOnExpanded') as string
        }
        styles={ buttonStyles }
        href={ link.url || (link.forceAnchor ? 'javascript:' : undefined) }
        iconProps={ { iconName: link.icon || '' } }
        description={ link.title || link.name }
        onClick={ link.onClick ? this._onNavButtonLinkClicked.bind(this, link) : this._onNavAnchorLinkClicked.bind(this, link) }
        title={ link.title || link.name }
        target={ link.target }
        rel={ rel }
        aria-label={ link.ariaLabel }
      >
        { onRenderLink(link, this._onRenderLink) }
      </ActionButton>);
  }

  private _renderCompositeLink(link: INavLink, linkIndex: number, nestingLevel: number): React.ReactElement<{}> {
    const isLinkSelected: boolean = this._isLinkSelected(link);
    const isRtl: boolean = getRTL();
    const absolutePositionString = `${_indentationSize * nestingLevel + 1}px`;

    return (
      <div
        { ...getNativeProps(link, divProperties) }
        key={ link.key || linkIndex }
        className={ this._classNames.compositeLink }
      // className={ css(
      //   'ms-Nav-compositeLink',
      //   styles.compositeLink,
      //   !!link.isExpanded && 'is-expanded',
      //   isLinkSelected && 'is-selected',
      //   !!link.isExpanded && styles.compositeLinkIsExpanded,
      //   isLinkSelected && styles.compositeLinkIsSelected
      // ) }
      >
        { (link.links && link.links.length > 0 ?
          <button
            className={ mergeStyles(
              'ms-Nav-chevronButton ms-Nav-chevronButton--link',
              styles.chevronButton,
              styles.chevronButtonLink,
              isRtl && {
                right: absolutePositionString,
              },
              !isRtl && {
                left: absolutePositionString,
              }) as string
            }
            onClick={ this._onLinkExpandClicked.bind(this, link) }
            aria-label={ this.props.expandButtonAriaLabel }
            aria-expanded={ link.isExpanded ? 'true' : 'false' }
          >
            <Icon
              // className={ css('ms-Nav-chevron', styles.chevronIcon, link.isExpanded) }
              className={ this._classNames.chevronIcon }
              iconName='ChevronDown'
            />
          </button> : null
        ) }
        { this._renderNavLink(link, linkIndex, nestingLevel) }
      </div>
    );
  }

  private _renderLink(link: INavLink, linkIndex: number, nestingLevel: number): React.ReactElement<{}> {
    return (
      <li key={ link.key || linkIndex } role='listitem' className={ css(styles.navItem) }>
        { this._renderCompositeLink(link, linkIndex, nestingLevel) }
        { (link.isExpanded ? this._renderLinks(link.links, ++nestingLevel) : null) }
      </li>
    );
  }

  private _renderLinks(links: INavLink[] | undefined, nestingLevel: number): React.ReactElement<{}> | null {
    if (!links || !links.length) {
      return null;
    }
    const linkElements: React.ReactElement<{}>[] = links.map(
      (link: INavLink, linkIndex: number) => this._renderLink(link, linkIndex, nestingLevel));

    return (
      <ul role='list' aria-label={ this.props.ariaLabel } className={ css(styles.navItems) }>
        { linkElements }
      </ul>
    );
  }

  @autobind
  private _renderGroup(group: INavLinkGroup, groupIndex: number): React.ReactElement<{}> {
    const isGroupExpanded: boolean = !this.state.isGroupCollapsed![group.name!];

    console.log(this);

    return (
      <div
        key={ groupIndex }
        className={ this._classNames.group }
      // className={ css(
      //   'ms-Nav-group',
      //   styles.group,
      //   isGroupExpanded && ('is-expanded ' + styles.groupIsExpanded)
      // ) }
      >
        { (group.name ?
          <button
            className={ css('ms-Nav-chevronButton ms-Nav-chevronButton--group ms-Nav-groupHeaderFontSize', styles.chevronButton, styles.chevronButtonIsGroup, styles.groupHeaderFontSize) }
            onClick={ this._onGroupHeaderClicked.bind(this, group) }
          >
            <Icon
              className={ css(
                'ms-Nav-chevron',
                styles.chevronIcon,
                isGroupExpanded && styles.chevronIsExpanded
              ) }
              iconName='ChevronDown'
            />
            { group.name }
          </button> : null)
        }
        {/* <div className={ css('ms-Nav-groupContent', AnimationClassNames.slideDownIn20, styles.groupContent) }> */ }
        <div className={ this._classNames.groupContent }>
          { this._renderLinks(group.links, 0 /* nestingLevel */) }
        </div>
      </div>
    );
  }

  private _onGroupHeaderClicked(group: INavLinkGroup, ev: React.MouseEvent<HTMLElement>): void {
    let { isGroupCollapsed } = this.state;
    let groupKey = group.name!;
    let isCollapsed = !isGroupCollapsed![groupKey];

    if (group.onHeaderClick) {
      group.onHeaderClick(ev, isCollapsed);
    }

    isGroupCollapsed![groupKey] = isCollapsed;
    this.setState({ isGroupCollapsed: isGroupCollapsed });

    ev.preventDefault();
    ev.stopPropagation();
  }

  private _onLinkExpandClicked(link: INavLink, ev: React.MouseEvent<HTMLElement>): void {
    const { onLinkExpandClick } = this.props;

    if (onLinkExpandClick) {
      onLinkExpandClick(ev, link);
    }

    if (!ev.defaultPrevented) {
      link.isExpanded = !link.isExpanded;
      this.setState({ isLinkExpandStateChanged: true });
    }

    ev.preventDefault();
    ev.stopPropagation();
  }

  private _onNavAnchorLinkClicked(link: INavLink, ev: React.MouseEvent<HTMLElement>): void {
    if (this.props.onLinkClick) {
      this.props.onLinkClick(ev, link);
    }

    this.setState({ selectedKey: link.key });
  }

  private _onNavButtonLinkClicked(link: INavLink, ev: React.MouseEvent<HTMLElement>): void {
    if (link.onClick) {
      link.onClick(ev, link);
    }

    this.setState({ selectedKey: link.key });
  }

  private _isLinkSelected(link: INavLink): boolean {
    // if caller passes in selectedKey, use it as first choice or
    // if current state.selectedKey (from addressbar) is match to the link
    if (this.props.selectedKey !== undefined) {
      return link.key === this.props.selectedKey;
    } else if (this.state.selectedKey !== undefined && link.key === this.state.selectedKey) {
      return true;
    }

    // resolve is not supported for ssr
    if (typeof (window) === 'undefined') {
      return false;
    }

    if (!link.url) {
      return false;
    }

    _urlResolver = _urlResolver || document.createElement('a');

    _urlResolver.href = link.url || '';
    const target: string = _urlResolver.href;

    if (location.href === target) {
      return true;
    }

    if (location.protocol + '//' + location.host + location.pathname === target) {
      return true;
    }

    if (location.hash) {
      // Match the hash to the url.
      if (location.hash === link.url) {
        return true;
      }

      // Match a rebased url. (e.g. #foo becomes http://hostname/foo)
      _urlResolver.href = location.hash.substring(1);

      return _urlResolver.href === target;
    }
    return false;
  }
}
