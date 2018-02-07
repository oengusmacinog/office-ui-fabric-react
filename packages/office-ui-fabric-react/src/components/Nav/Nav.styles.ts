import { NavBase } from './Nav.base';
import { INavProps, INavStyleProps, INavStyles } from './Nav.types';
import { FontWeights, FontSizes } from '../../../../styling/lib/styles/fonts';

export function getStyles(props: INavStyleProps): INavStyles {
  const { theme } = props;
  const { palette, fonts, semanticColors } = theme;

  return {
    root: {
      overflowY: 'auto',
      // ADD TO RAWSTYLEBASE?
      // webkitOverflowScrolling: 'touch',
      userSelect: 'none'
    },
    rootIsOnTop: {
      position: 'absolute'
    },
    navItems: {
      listStyleType: 'none',
      selectors: {
        '&, & > .navItem': {
          padding: 0
        }
      }
    },
    groupContent: {
      display: 'none',
      marginBottom: '40px',
      selectors: {
        '.group.groupIsExpanded &': {
          display: 'block'
        }
      }
    },
    icon: {
      padding: '0px',
      color: palette.neutralPrimary,
      background: palette.neutralLighter,
      transition: 'transform .1s linear'
    },
    iconLink: {
      marginRight: '4px' //needs i18n solution
    },
    chevronButton: {
      display: 'block',
      fontWeight: FontWeights.regular,
      fontSize: FontSizes.small,
      textAlign: 'left', //needs i18n solution
      lineHeight: props.navnodeHeight,
      margin: '5px 0',
      padding: `0px, ${props.linkRightPadding}, 0px, ${props.hasExpandButtonLinkLeftPadding}`,
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
        '&.chevronButtonIsGroup': {
          width: '100%',
          height: props.navnodeHeight,
          borderBottom: `1px solid ${semanticColors.bodyDivider}`
        }
      }
    },
    chevronIcon: {
      position: 'absolute',
      left: '8px', //needs i18n solution
      height: props.navnodeHeight,
      lineHeight: props.navnodeHeight,
      fontSize: '12px',
      transition: 'transform .1s linear'
    },
    chevronIsExpanded: {
      transform: 'rotate(-180deg)'
    },
    linkText: {
      margin: '0 4px',
      overflow: 'hidden',
      verticalAlign: 'middle',
      textOverflow: 'ellipsis'
    },
    compositeLink: {
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
        '&.compositeLinkIsExpanded $chevronIcon': {
          transform: 'rotate(-180deg)'
        },
        '&.compositeLinkIsSelected': {
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
        }
      }
    },
    link: {
      display: 'block',
      position: 'relative',
      height: props.navnodeHeight,
      width: '100%',
      lineHeight: props.navnodeHeight,
      textDecoration: 'none',
      cursor: 'pointer',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    buttonEntry: {
      color: palette.themePrimary
    },
    groupHeaderFontSize: {
      // @include ms-font-l;
    },
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