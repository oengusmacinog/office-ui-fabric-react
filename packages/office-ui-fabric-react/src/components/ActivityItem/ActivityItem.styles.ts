import {
  concatStyleSets,
  ITheme,
  getTheme,
  HighContrastSelector
} from '../../Styling';
import {
  memoizeFunction
} from '../../Utilities';
import { IActivityItemStyles } from './ActivityItem.types';

const DEFAULT_PERSONA_SIZE = '32px';
const COMPACT_PERSONA_SIZE = '16px';
const DEFAULT_ICON_SIZE = '16px';
const COMPACT_ICON_SIZE = '13px';

export const getStyles = memoizeFunction((
  theme: ITheme = getTheme(),
  customStyles?: IActivityItemStyles
): IActivityItemStyles => {
  const ActivityItemStyles: IActivityItemStyles = {

    root: [
      theme.fonts.small,
      {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        lineHeight: '17px',
        boxSizing: 'border-box',
        color: theme.palette.neutralSecondary
      }
    ],

    isCompactRoot: {
      alignItems: 'center'
    },

    personaContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      minWidth: DEFAULT_PERSONA_SIZE,
      width: DEFAULT_PERSONA_SIZE,
      height: DEFAULT_PERSONA_SIZE
    },

    isCompactPersonaContainer: {
      display: 'inline-flex',
      flexWrap: 'nowrap',
      flexBasis: 'auto',
      height: COMPACT_PERSONA_SIZE,
      width: 'auto',
      minWidth: '0',
      paddingRight: '6px'
    },

    activityTypeIcon: {
      height: DEFAULT_PERSONA_SIZE,
      fontSize: DEFAULT_ICON_SIZE,
      lineHeight: DEFAULT_ICON_SIZE,
      marginTop: '3px'
    },

    isCompactIcon: {
      height: COMPACT_PERSONA_SIZE,
      fontSize: COMPACT_ICON_SIZE,
      lineHeight: COMPACT_ICON_SIZE,
      color: theme.palette.themePrimary,
      marginTop: '1px',
      selectors: {
        '.ms-Persona-imageArea': {
          marginTop: '-2px',
          border: '2px solid' + theme.palette.white,
          borderRadius: '50%',
          selectors: {
            [HighContrastSelector]: {
              border: 'none',
              marginTop: '0'
            }
          }
        }
      }
    },

    activityPersona: {
      display: 'block'
    },

    doublePersona: {
      selectors: {
        ':first-child': {
          alignSelf: 'flex-end'
        }
      }
    },

    isCompactPersona: {
      display: 'inline-block',
      width: '8px',
      minWidth: '8px',
      overflow: 'visible'
    },

    activityContent: {
      padding: '0 8px'
    },

    activityText: {
      display: 'inline'
    },

    isCompactContent: {
      flex: '1',
      padding: '0 4px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflowX: 'hidden'
    },

    commentText: {
      color: theme.palette.neutralPrimary
    },

    timeStamp: [
      theme.fonts.tiny,
      {
        fontWeight: 400,
        color: theme.palette.neutralSecondary
      }
    ]
  };

  return concatStyleSets(ActivityItemStyles, customStyles);
});
