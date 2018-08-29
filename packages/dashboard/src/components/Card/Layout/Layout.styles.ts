import { ILayoutProps, ILayoutStyles } from './Layout.types';
import { CardSize } from '../Card.types';

export const getStyles = (props: ILayoutProps): ILayoutStyles => {
  const { cardSize, header } = props;
  const isMediumTall: boolean = cardSize === CardSize.mediumTall;
  const isHeaderPresent: boolean = header === undefined;
  return {
    root: {
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    contentLayout: {
      display: 'flex',
      flex: 1,
      flexDirection: isMediumTall ? 'column' : 'row'
    },
    contentAreaLayout: {
      display: 'flex',
      paddingBottom: '16px',
      marginTop: isHeaderPresent ? '30px' : '32px',
      overflow: 'hidden',
      flex: 1
    },
    contentArea1: {
      margin: isMediumTall ? '0 16px 12px 0' : '0 12px 16px 0',
      flex: isMediumTall ? '0 1 auto' : 1,
      flexDirection: 'column',
      overflow: 'hidden'
    },
    dataVizLastUpdatedOn: {
      fontSize: '10px',
      opacity: 0.6,
      paddingBottom: '9px',
      fontWeight: 600
    },
    contentArea2: {
      margin: isMediumTall ? '0px 16px 16px 0' : '0 0 16px 12px',
      flex: isMediumTall ? '0 1 auto' : 1,
      overflow: 'hidden'
    },
    footer: {
      width: '100%',
      minHeight: '32px'
    }
  };
};
