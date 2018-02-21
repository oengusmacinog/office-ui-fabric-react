import * as React from 'react';
import {
  BaseComponent,
  KeyCodes,
  css,
  getRTL,
  autobind
} from '../../Utilities';
import { ICalendarStrings, ICalendarIconStrings, ICalendarFormatDateCallbacks } from './Calendar.types';
import { FocusZone } from '../../FocusZone';
import { addYears, setMonth, getYearStart, getYearEnd, getMonthStart, getMonthEnd, compareDatePart } from '../../utilities/dateMath/DateMath';
import { Icon } from '../../Icon';
import * as stylesImport from './Calendar.scss';
const styles: any = stylesImport;

export interface ICalendarMonthProps extends React.Props<CalendarMonth> {
  componentRef?: () => void;
  navigatedDate: Date;
  strings: ICalendarStrings;
  onNavigateDate: (date: Date, focusOnNavigatedDay: boolean) => void;
  today?: Date;
  highlightCurrentMonth: boolean;
  onHeaderSelect?: (focus: boolean) => void;
  navigationIcons: ICalendarIconStrings;
  dateTimeFormatter: ICalendarFormatDateCallbacks;
  minDate?: Date;
  maxDate?: Date;
}

export class CalendarMonth extends BaseComponent<ICalendarMonthProps, {}> {
  public refs: {
    [key: string]: React.ReactInstance;
    navigatedMonth: HTMLElement;
  };

  private _selectMonthCallbacks: (() => void) [];

  public constructor(props: ICalendarMonthProps) {
    super(props);

    this._selectMonthCallbacks = [];
    props.strings.shortMonths.map((month, index) => {
      this._selectMonthCallbacks[index] = this._onSelectMonth.bind(this, index);
    });

    this._isCurrentMonth = this._isCurrentMonth.bind(this);
    this._onSelectNextYear = this._onSelectNextYear.bind(this);
    this._onSelectPrevYear = this._onSelectPrevYear.bind(this);
    this._onSelectMonth = this._onSelectMonth.bind(this);
  }

  public render() {

    const { navigatedDate, strings, today, highlightCurrentMonth, navigationIcons, dateTimeFormatter, minDate, maxDate } = this.props;
    const leftNavigationIcon = navigationIcons.leftNavigation;
    const rightNavigationIcon = navigationIcons.rightNavigation;

    // determine if previous/next years are in bounds
    const isPrevYearInBounds = minDate ? compareDatePart(minDate, getYearStart(navigatedDate)) < 0 : true;
    const isNextYearInBounds = maxDate ? compareDatePart(getYearEnd(navigatedDate), maxDate) < 0 : true;

    return (
      <div className={ css('ms-DatePicker-monthPicker', styles.monthPicker) }>
        <div className={ css('ms-DatePicker-yearComponents', styles.yearComponents) }>
          <div className={ css('ms-DatePicker-navContainer', styles.navContainer) }>
            <button
              className={ css('ms-DatePicker-prevYear js-prevYear', styles.prevYear, {
                ['ms-DatePicker-prevYear--disabled ' + styles.prevYearIsDisabled]: !isPrevYearInBounds
              }) }
              onClick={ this._onSelectPrevYear }
              onKeyDown={ this._onSelectPrevYearKeyDown }
              aria-label={ strings.prevYearAriaLabel ? strings.prevYearAriaLabel + ' ' + dateTimeFormatter.formatYear(addYears(navigatedDate, -1)) : undefined }
              role='button'
              tabIndex={ 0 }
            >
              <Icon iconName={ getRTL() ? rightNavigationIcon : leftNavigationIcon } />
            </button>
            <button
              className={ css('ms-DatePicker-nextYear js-nextYear', styles.nextYear, {
                ['ms-DatePicker-nextYear--disabled ' + styles.nextYearIsDisabled]: !isNextYearInBounds
              }) }
              onClick={ this._onSelectNextYear }
              onKeyDown={ this._onSelectNextYearKeyDown }
              aria-label={ strings.nextYearAriaLabel ? strings.nextYearAriaLabel + ' ' + dateTimeFormatter.formatYear(addYears(navigatedDate, 1)) : undefined }
              role='button'
              tabIndex={ 0 }
            >
              <Icon iconName={ getRTL() ? leftNavigationIcon : rightNavigationIcon } />
            </button>
          </div>
        </div>
        <div className={ css('ms-DatePicker-header', styles.header) }>
          { this.props.onHeaderSelect ?
            <div
              className={ css('ms-DatePicker-currentYear js-showYearPicker', styles.currentYear, styles.headerToggleView) }
              onClick={ this._onHeaderSelect }
              onKeyDown={ this._onHeaderKeyDown }
              aria-label={ dateTimeFormatter.formatYear(navigatedDate) }
              role='button'
              tabIndex={ 0 }
            >
              { dateTimeFormatter.formatYear(navigatedDate) }
            </div>
            :
            <div className={ css('ms-DatePicker-currentYear js-showYearPicker', styles.currentYear) }>
              { dateTimeFormatter.formatYear(navigatedDate) }
            </div>
          }
        </div>
        <FocusZone>
          <div
            className={ css('ms-DatePicker-optionGrid', styles.optionGrid) }
            role='grid'
          >
            { strings.shortMonths.map((month, index) => {

              const indexedMonth = setMonth(navigatedDate, index);
              const isCurrentMonth = this._isCurrentMonth(index, navigatedDate.getFullYear(), today!);
              const isNavigatedMonth = navigatedDate.getMonth() === index;
              const isInBounds = (minDate ? compareDatePart(minDate, getMonthEnd(indexedMonth)) < 1 : true) &&
                (maxDate ? compareDatePart(getMonthStart(indexedMonth), maxDate) < 1 : true);

              return <button
                role={ 'gridcell' }
                className={
                  css('ms-DatePicker-monthOption', styles.monthOption,
                    {
                      ['ms-DatePicker-day--today ' + styles.monthIsCurrentMonth]: highlightCurrentMonth && isCurrentMonth!,
                      ['ms-DatePicker-day--highlighted ' + styles.monthIsHighlighted]: highlightCurrentMonth && isNavigatedMonth,
                      ['ms-DatePicker-monthOption--disabled ' + styles.monthOptionIsDisabled]: !isInBounds
                    })
                }
                key={ index }
                onClick={ isInBounds ? this._selectMonthCallbacks[index] : undefined }
                aria-label={ dateTimeFormatter.formatMonthYear(indexedMonth, strings) }
                aria-selected={ isCurrentMonth || isNavigatedMonth }
                data-is-focusable={ isInBounds ? true : undefined }
                ref={ isNavigatedMonth ? 'navigatedMonth' : undefined }
              >
                { month }
              </button>;
            }
            ) }
          </div>
        </FocusZone>
      </div>
    );
  }

  public focus() {
    if (this.refs.navigatedMonth) {
      this.refs.navigatedMonth.tabIndex = 0;
      this.refs.navigatedMonth.focus();
    }
  }

  private _isCurrentMonth(month: number, year: number, today: Date) {
    return today.getFullYear() === year && today.getMonth() === month;
  }

  @autobind
  private _onKeyDown(callback: () => void, ev: React.KeyboardEvent<HTMLElement>) {
    if (ev.which === KeyCodes.enter || ev.which === KeyCodes.space) {
      callback();
    }
  }

  @autobind
  private _onSelectNextYear() {
    const { navigatedDate, onNavigateDate } = this.props;
    onNavigateDate(addYears(navigatedDate, 1), false);
  }

  @autobind
  private _onSelectNextYearKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    this._onKeyDown(this._onSelectNextYear, ev);
  }

  @autobind
  private _onSelectPrevYear() {
    const { navigatedDate, onNavigateDate } = this.props;
    onNavigateDate(addYears(navigatedDate, -1), false);
  }

  @autobind
  private _onSelectPrevYearKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    this._onKeyDown(this._onSelectPrevYear, ev);
  }

  @autobind
  private _onSelectMonth(newMonth: number) {
    const { navigatedDate, onNavigateDate, onHeaderSelect } = this.props;

    // If header is clickable the calendars are overlayed, switch back to day picker when month is clicked
    if (onHeaderSelect) {
      onHeaderSelect(true);
    }
    onNavigateDate(setMonth(navigatedDate, newMonth), true);
  }

  @autobind
  private _onHeaderSelect() {
    const { onHeaderSelect } = this.props;
    if (onHeaderSelect) {
      onHeaderSelect(true);
    }
  }

  @autobind
  private _onHeaderKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    const { onHeaderSelect } = this.props;
    if (onHeaderSelect && (ev.which === KeyCodes.enter || ev.which === KeyCodes.space)) {
      onHeaderSelect(true);
    }
  }
}
