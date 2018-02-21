import * as React from 'react';
import { ICalendar, ICalendarProps, ICalendarStrings, ICalendarIconStrings, ICalendarFormatDateCallbacks } from './Calendar.types';
import { DayOfWeek, FirstWeekOfYear, DateRangeType } from '../../utilities/dateValues/DateValues';
import { CalendarDay } from './CalendarDay';
import { CalendarMonth } from './CalendarMonth';
import { compareDates, getDateRangeArray } from '../../utilities/dateMath/DateMath';
import {
  autobind,
  css,
  BaseComponent,
  KeyCodes
} from '../../Utilities';
import * as stylesImport from './Calendar.scss';
const styles: any = stylesImport;

const leftArrow: string = 'Up';
const rightArrow: string = 'Down';
const iconStrings: ICalendarIconStrings = {
  leftNavigation: leftArrow,
  rightNavigation: rightArrow
};
const defaultWorkWeekDays: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
];

const dateTimeFormatterCallbacks: ICalendarFormatDateCallbacks = {
  formatMonthDayYear: (date: Date, strings: ICalendarStrings) => (strings.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()),
  formatMonthYear: (date: Date, strings: ICalendarStrings) => (strings.months[date.getMonth()] + ' ' + date.getFullYear()),
  formatDay: (date: Date) => date.getDate().toString(),
  formatYear: (date: Date) => date.getFullYear().toString()
};

export interface ICalendarState {
  /** The currently focused date in the calendar, but not necessarily selected */
  navigatedDate?: Date;

  /** The currently selected date in the calendar */
  selectedDate?: Date;

  /** State used to show/hide month picker */
  isMonthPickerVisible?: boolean;

  /** State used to show/hide day picker */
  isDayPickerVisible?: boolean;
}

export class Calendar extends BaseComponent<ICalendarProps, ICalendarState> implements ICalendar {
  public static defaultProps: ICalendarProps = {
    onSelectDate: undefined,
    onDismiss: undefined,
    isMonthPickerVisible: true,
    isDayPickerVisible: true,
    showMonthPickerAsOverlay: false,
    value: undefined,
    today: new Date(),
    firstDayOfWeek: DayOfWeek.Sunday,
    dateRangeType: DateRangeType.Day,
    autoNavigateOnSelection: false,
    showGoToToday: true,
    strings: null,
    highlightCurrentMonth: false,
    navigationIcons: iconStrings,
    showWeekNumbers: false,
    firstWeekOfYear: FirstWeekOfYear.FirstDay,
    dateTimeFormatter: dateTimeFormatterCallbacks,
    showSixWeeksByDefault: false,
    workWeekDays: defaultWorkWeekDays
  };

  public refs: {
    [key: string]: React.ReactInstance;
    root: HTMLElement;
    dayPicker: CalendarDay;
    monthPicker: CalendarMonth;
  };

  private _focusOnUpdate: boolean;

  constructor(props: ICalendarProps) {
    super(props);
    const currentDate = props.value && !isNaN(props.value.getTime()) ? props.value : (props.today || new Date());

    this.state = {
      selectedDate: currentDate,
      navigatedDate: currentDate,

      /** When showMonthPickerAsOverlay is active it overrides isMonthPickerVisible/isDayPickerVisible props (These props permanently set the visibility of their respective calendars). */
      isMonthPickerVisible: this.props.showMonthPickerAsOverlay ? false : this.props.isMonthPickerVisible,
      isDayPickerVisible: this.props.showMonthPickerAsOverlay ? true : this.props.isDayPickerVisible
    };

    this._focusOnUpdate = false;
  }

  public componentWillReceiveProps(nextProps: ICalendarProps) {
    const { autoNavigateOnSelection, value, today = new Date() } = nextProps;

    // Make sure auto-navigation is supported for programmatic changes to selected date, i.e.,
    // if selected date is updated via props, we may need to modify the navigated date
    const overrideNavigatedDate = (autoNavigateOnSelection && !compareDates(value!, this.props.value!));
    if (overrideNavigatedDate) {
      this.setState({
        navigatedDate: value
      });
    }

    this.setState({
      selectedDate: value || today
    });
  }

  public componentDidUpdate() {
    if (this._focusOnUpdate) {
      // if the day picker is shown, focus on it
      if (this.refs.dayPicker) {
        this.refs.dayPicker.focus();
      } else if (this.refs.monthPicker) {
        this.refs.monthPicker.focus();
      }
      this._focusOnUpdate = false;
    }
  }

  public render() {
    const rootClass = 'ms-DatePicker';
    const { firstDayOfWeek, dateRangeType, strings, showMonthPickerAsOverlay, autoNavigateOnSelection, showGoToToday, highlightCurrentMonth, navigationIcons, minDate, maxDate } = this.props;
    const { selectedDate, navigatedDate, isMonthPickerVisible, isDayPickerVisible } = this.state;
    const onHeaderSelect = showMonthPickerAsOverlay ? this._onHeaderSelect : undefined;
    const monthPickerOnly = !showMonthPickerAsOverlay && !isDayPickerVisible;
    const overlayedWithButton = showMonthPickerAsOverlay && showGoToToday;

    return (
      <div className={ css(rootClass, styles.root) } ref='root' role='application'>
        <div
          className={ css(
            'ms-DatePicker-picker ms-DatePicker-picker--opened ms-DatePicker-picker--focused',
            styles.picker,
            styles.pickerIsOpened,
            styles.pickerIsFocused,
            isMonthPickerVisible && ('ms-DatePicker-monthPickerVisible ' + styles.monthPickerVisible),
            isMonthPickerVisible && isDayPickerVisible && ('ms-DatePicker-calendarsInline ' + styles.calendarsInline),
            monthPickerOnly && ('ms-DatePicker-monthPickerOnly ' + styles.monthPickerOnly),
            showMonthPickerAsOverlay && ('ms-DatePicker-monthPickerAsOverlay ' + styles.monthPickerAsOverlay),
          ) }
        >
          <div className={ css('ms-DatePicker-holder ms-slideDownIn10', styles.holder, overlayedWithButton && styles.holderWithButton) } onKeyDown={ this._onDatePickerPopupKeyDown }>
            <div className={ css('ms-DatePicker-frame', styles.frame) }>
              <div className={ css('ms-DatePicker-wrap', styles.wrap, showGoToToday && styles.goTodaySpacing) }>
                { isDayPickerVisible && <CalendarDay
                  selectedDate={ selectedDate! }
                  navigatedDate={ navigatedDate! }
                  today={ this.props.today }
                  onSelectDate={ this._onSelectDate }
                  onNavigateDate={ this._onNavigateDate }
                  onDismiss={ this.props.onDismiss }
                  firstDayOfWeek={ firstDayOfWeek! }
                  dateRangeType={ dateRangeType! }
                  autoNavigateOnSelection={ autoNavigateOnSelection! }
                  strings={ strings! }
                  onHeaderSelect={ onHeaderSelect }
                  navigationIcons={ navigationIcons! }
                  showWeekNumbers={ this.props.showWeekNumbers }
                  firstWeekOfYear={ this.props.firstWeekOfYear! }
                  dateTimeFormatter={ this.props.dateTimeFormatter! }
                  showSixWeeksByDefault={ this.props.showSixWeeksByDefault }
                  minDate={ minDate }
                  maxDate={ maxDate }
                  workWeekDays={ this.props.workWeekDays }
                  ref='dayPicker'
                />
                }

                { isMonthPickerVisible && <CalendarMonth
                  navigatedDate={ navigatedDate! }
                  strings={ strings! }
                  onNavigateDate={ this._onNavigateDate }
                  today={ this.props.today }
                  highlightCurrentMonth={ highlightCurrentMonth! }
                  onHeaderSelect={ onHeaderSelect }
                  navigationIcons={ navigationIcons! }
                  dateTimeFormatter={ this.props.dateTimeFormatter! }
                  minDate={ minDate }
                  maxDate={ maxDate }
                  ref='monthPicker'
                /> }

                { showGoToToday &&
                  <button
                    role='button'
                    className={ css('ms-DatePicker-goToday js-goToday', styles.goToday) }
                    onClick={ this._onGotoToday }
                    onKeyDown={ this._onGotoTodayKeyDown }
                    tabIndex={ 0 }
                  >
                    { strings!.goToToday }
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public focus() {
    if (this.refs.dayPicker) {
      this.refs.dayPicker.focus();
    }
  }

  @autobind
  private _navigateDay(date: Date) {
    this.setState({
      navigatedDate: date
    });
  }

  @autobind
  private _onNavigateDate(date: Date, focusOnNavigatedDay: boolean) {

    if (this.props.isDayPickerVisible || (!this.props.isDayPickerVisible && !focusOnNavigatedDay)) {
      this._navigateDay(date);
      this._focusOnUpdate = focusOnNavigatedDay;
    } else {
      // if only the month picker is shown, select the chosen month
      this._onSelectDate(date);
    }
  }

  @autobind
  private _onSelectDate(date: Date, selectedDateRangeArray?: Date[]) {
    const { onSelectDate } = this.props;

    this.setState({
      selectedDate: date
    });

    if (onSelectDate) {
      onSelectDate(date, selectedDateRangeArray);
    }
  }

  @autobind
  private _onHeaderSelect(focus: boolean) {
    this.setState({
      isDayPickerVisible: !this.state.isDayPickerVisible,
      isMonthPickerVisible: !this.state.isMonthPickerVisible
    });

    if (focus) {
      this._focusOnUpdate = true;
    }
  }

  @autobind
  private _onGotoToday() {

    const { dateRangeType, firstDayOfWeek, today, workWeekDays } = this.props;

    const dates = getDateRangeArray(today!, dateRangeType!, firstDayOfWeek!, workWeekDays!);

    this._onSelectDate(today!, dates);

  }

  @autobind
  private _onGotoTodayKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    if (ev.which === KeyCodes.enter || ev.which === KeyCodes.space) {
      ev.preventDefault();
      this._onGotoToday();
    } else if (ev.which === KeyCodes.tab && !ev.shiftKey) {
      if (this.props.onDismiss) {
        ev.stopPropagation();
        ev.preventDefault();
        this.props.onDismiss();
      }
    }
  }

  @autobind
  private _onDatePickerPopupKeyDown(ev: React.KeyboardEvent<HTMLElement>) {
    switch (ev.which) {
      case KeyCodes.enter:
        ev.preventDefault();
        break;

      case KeyCodes.backspace:
        ev.preventDefault();
        break;

      case KeyCodes.escape:
        this._handleEscKey(ev);
        break;

      default:
        break;
    }
  }

  @autobind
  private _handleEscKey(ev: React.KeyboardEvent<HTMLElement>) {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  }
}
