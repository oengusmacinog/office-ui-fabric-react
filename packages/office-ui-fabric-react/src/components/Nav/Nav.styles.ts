import { NavBase } from './Nav.base';
import { INavProps, INavStyleProps, INavStyles } from './Nav.types';
import { FontWeights, FontSizes } from '../../../../styling/lib/styles/fonts';
import { AnimationClassNames } from '../../../../styling/lib/classNames/AnimationClassNames';

export function getStyles(props: INavStyleProps): INavStyles {
  const {
    theme,
    className,
    isOnTop,
    isGroupExpanded,
    isLinkExpanded,
    isLinkSelected,
    absolutePosition,
    isLinkButton,
    hasExpandButton,
    isNotForceAnchor,
    navnodeHeight = '36px',
    hasExpandButtonLinkLeftPadding = '28px',
    noExpandButtonLinkLeftPadding = '20px',
    linkRightPadding = '20px'
  } = props;
  const { palette, fonts, semanticColors } = theme;

  return {
    root: [
      'ms-Nav',
      AnimationClassNames.slideRightIn40,
      isOnTop && 'is-onTop',
      // isOnTop && '$rootIsOnTop',
      isOnTop && { position: 'absolute' },
      {
        overflowY: 'auto',
        // ADD TO RAWSTYLEBASE?
        // webkitOverflowScrolling: 'touch',
        userSelect: 'none'
      },
      className
    ],
    // rootIsOnTop: {
    //   position: 'absolute'
    // },
    navItem: {},
    navItems: {
      listStyleType: 'none',
      selectors: {
        '&, & > $navItem': {
          padding: 0
        }
      }
    },
    group: [
      'ms-Nav-group',
      isGroupExpanded && 'is-expanded'
    ],
    groupContent: [
      'ms-Nav-groupContent',
      AnimationClassNames.slideDownIn20,
      {
        display: 'none',
        marginBottom: '40px',
      },
      isGroupExpanded && {
        selectors: {
          '$group &': { display: 'block' }
        }
      }
    ],
    icon: {
      padding: '0px',
      color: palette.neutralPrimary,
      background: palette.neutralLighter,
      transition: 'transform .1s linear'
    },
    iconLink: {
      marginRight: '4px' //needs i18n solution
    },
    chevronButton: [
      'ms-Nav-chevronButton',
      {
        display: 'block',
        fontWeight: FontWeights.regular,
        fontSize: FontSizes.small,
        textAlign: 'left', //needs i18n solution
        lineHeight: navnodeHeight,
        margin: '5px 0',
        padding: `0px, ${linkRightPadding}, 0px, ${hasExpandButtonLinkLeftPadding}`,
        background: 'none',
        border: 'none',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        cursor: 'pointer',
        color: semanticColors.bodyText,
        backgroundColor: semanticColors.bodyBackground,
        selectors: {
          '&:visited': {
            color: 'inherit'
          },
          '&:hover': {
            color: semanticColors.bodyText,
            backgroundColor: palette.neutralLighterAlt,
          },
          // '&.chevronButtonIsGroup': {
          '$group &': [
            // 'ms-Nav-chevronButton--group',
            // 'ms-Nav-groupHeaderFontSize',
            fonts.large,
            {
              width: '100%',
              height: navnodeHeight,
              borderBottom: `1px solid ${semanticColors.bodyDivider}`
            }
          ],
          // '$chevronButtonGroup &': [
          '$compositeLink &': [
            'ms-Nav-chevronButton--link',
            // focusBorder Mixin
            {
              left: absolutePosition
            }
          ]
        }
      }
    ],
    chevronIcon: [
      'ms-Nav-chevron',
      {
        position: 'absolute',
        left: '8px', //needs i18n solution
        height: props.navnodeHeight,
        lineHeight: props.navnodeHeight,
        fontSize: '12px',
        transition: 'transform .1s linear'
      },
      isGroupExpanded && { transform: 'rotate(-180deg)' },
      // isLinkExpanded && { transform: 'rotate(-180deg)' }
    ],
    // chevronIsExpanded: {
    //   transform: 'rotate(-180deg)'
    // },
    linkText: [
      'ms-Nav-linkText',
      {
        margin: '0 4px',
        overflow: 'hidden',
        verticalAlign: 'middle',
        textOverflow: 'ellipsis'
      }
    ],
    compositeLink: [
      'ms-Nav-compositeLink',
      isLinkExpanded && 'is-expanded',
      isLinkExpanded && {
        selectors: {
          '& $chevronIcon': {
            transform: 'rotate(-180deg)'
          },
        }
      },
      isLinkSelected && 'is-selected',
      isLinkSelected && {
        selectors: {
          '& $link, & $chevronButton': {
            color: palette.themePrimary,
            background: palette.neutralLighter,
            selectors: {
              '&:after': {
                borderLeft: `2px, solid, ${palette.themePrimary}`, //needs i18n solution
                content: '',
                position: 'absolute',
                top: 0,
                right: 0, //needs i18n solution
                bottom: 0,
                left: 0 //needs i18n solution
              }
            }
          }
        }
      },
      {
        display: 'block',
        position: 'relative',
        color: semanticColors.bodyText,
        background: semanticColors.bodyBackground,
        selectors: {
          '$chevronButton.chevronButtonLink': {
            display: 'block',
            // NEED A UTIL FUNCTION TO REMOVE ANYTHING
            // NaN AND RETURN THE DIGIT THEN PUT THAT
            // BACK ON
            // width: props.hasExpandButtonLinkLeftPadding - 2,
            // height: props.$navnodeHeight - 2,
            position: 'absolute',
            top: '1px',
            zIndex: 1,
            padding: 0,
            margin: 0,
            selectors: {
              '$chevronIcon': {
                top: 0
              }
            }
          },
          '&:hover': {
            selectors: {
              '& $link, & $chevronButton': {
                backgroundColor: palette.neutralLighterAlt,
                color: semanticColors.bodyText
              }
            }
          },
          // '&.compositeLinkIsExpanded $chevronIcon': {
          //   transform: 'rotate(-180deg)'
          // },
          // '&.compositeLinkIsSelected': {
          //   selectors: {
          //     '& $link, & $chevronButton': {
          //       color: palette.themePrimary,
          //       background: palette.neutralLighter,
          //       selectors: {
          //         '&:after': {
          //           borderLeft: `2px, solid, ${palette.themePrimary}`, //needs i18n solution
          //           content: '',
          //           position: 'absolute',
          //           top: 0,
          //           right: 0, //needs i18n solution
          //           bottom: 0,
          //           left: 0 //needs i18n solution
          //         }
          //       }
          //     }
          //   }
          // }
        }
      }
    ],
    link: [
      'ms-Nav-link',
      isLinkButton && 'ms-Nav-linkButton',
      hasExpandButton && 'isOnExpanded',
      {
        display: 'block',
        position: 'relative',
        height: navnodeHeight,
        width: '100%',
        lineHeight: navnodeHeight,
        textDecoration: 'none',
        cursor: 'pointer',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      },
      isLinkButton && isNotForceAnchor && [
        'ms-Nav-link--buttonEntry',
        {
          color: palette.themePrimary
        }
      ]
    ],
    // buttonEntry: {
    //   color: palette.themePrimary
    // },
    // groupHeaderFontSize: [
    //   fonts.large
    // ],
    chevronButtonGroup: {
      selectors: {
        '$chevronButton, &, .chevronButtonLink, $link': {
          // focusBorder Mixen?
        }
      }
    }
    // HONESTLY NOT SURE WHAT THIS
    // IS SUPPOSED TO DO...
    // .root .link {
    //   :global(.ms-Button-label) {
    //     @include ms-font-m;
    //   }
    // }
  }
}