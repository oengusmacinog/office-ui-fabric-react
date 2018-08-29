import * as React from 'react';
import { DateRangeType, DayOfWeek } from 'office-ui-fabric-react/lib/Calendar';
import { IDocPageProps } from '../../common/DocPage.types';
import { CalendarButtonExample } from './examples/Calendar.Button.Example';
import { CalendarInlineExample } from './examples/Calendar.Inline.Example';
import { CalendarStatus } from './Calendar.checklist';
import { addMonths, addYears } from '../../utilities/dateMath/DateMath';

const CalendarButtonExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Calendar/examples/Calendar.Button.Example.tsx') as string;
const CalendarButtonExampleCodepen = require('!raw-loader!office-ui-fabric-react/lib/codepen/components/Calendar/Calendar.Button.Example.Codepen.txt') as string;
const CalendarInlineExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/Calendar/examples/Calendar.Inline.Example.tsx') as string;
const CalendarInlineExampleCodepen = require('!raw-loader!office-ui-fabric-react/lib/codepen/components/Calendar/Calendar.Inline.Example.Codepen.txt') as string;

const today = new Date(Date.now());

export const CalendarPageProps: IDocPageProps = {
  title: 'Calendar',
  componentName: 'Calendar',
  componentUrl:
    'https://github.com/OfficeDev/office-ui-fabric-react/tree/master/packages/office-ui-fabric-react/src/components/Calendar',
  componentStatus: CalendarStatus,
  examples: [
    {
      title: 'Inline Calendar',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          isMonthPickerVisible={false}
          dateRangeType={DateRangeType.Day}
          autoNavigateOnSelection={false}
          showGoToToday={true}
        />
      ),
      codepenJS: CalendarInlineExampleCodepen
    },
    {
      title: 'Inline Calendar with overlayed month picker when header is clicked',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          showMonthPickerAsOverlay={true}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          dateRangeType={DateRangeType.Day}
          autoNavigateOnSelection={false}
          showGoToToday={false}
        />
      )
    },
    {
      title: 'Inline Calendar with month picker',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          dateRangeType={DateRangeType.Day}
          autoNavigateOnSelection={false}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          showGoToToday={true}
        />
      )
    },
    {
      title: 'Inline Calendar with week selection',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          dateRangeType={DateRangeType.Week}
          autoNavigateOnSelection={true}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          showGoToToday={true}
          showNavigateButtons={true}
        />
      )
    },
    {
      title: 'Inline Calendar with month selection',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          dateRangeType={DateRangeType.Month}
          autoNavigateOnSelection={true}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          showGoToToday={true}
          showNavigateButtons={true}
        />
      )
    },
    {
      title: 'Inline Calendar with week numbers',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          isMonthPickerVisible={false}
          dateRangeType={DateRangeType.Day}
          autoNavigateOnSelection={false}
          showGoToToday={true}
          showWeekNumbers={true}
        />
      )
    },
    {
      title: 'Inline Calendar with 6 weeks display by default',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          isMonthPickerVisible={false}
          dateRangeType={DateRangeType.Day}
          autoNavigateOnSelection={false}
          showGoToToday={true}
          showSixWeeksByDefault={true}
        />
      )
    },
    {
      title: 'Inline Calendar with month picker and no day picker',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          dateRangeType={DateRangeType.Month}
          autoNavigateOnSelection={false}
          showGoToToday={true}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          isDayPickerVisible={false}
        />
      )
    },
    {
      title: 'Inline Calendar with date boundary (minDate, maxDate)',
      code: CalendarInlineExampleCode,

      view: (
        <CalendarInlineExample
          dateRangeType={DateRangeType.Day}
          autoNavigateOnSelection={true}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          showGoToToday={false}
          minDate={addMonths(today, -1)}
          maxDate={addYears(today, 1)}
        />
      )
    },
    {
      title:
        'Calendar with selectableDays = [Tuesday, Wednesday, Friday, Saturday] provided, first day of week = Monday',
      code: CalendarButtonExampleCode,

      view: (
        <CalendarInlineExample
          dateRangeType={DateRangeType.WorkWeek}
          firstDayOfWeek={DayOfWeek.Monday}
          autoNavigateOnSelection={true}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          showGoToToday={true}
          workWeekDays={[DayOfWeek.Tuesday, DayOfWeek.Saturday, DayOfWeek.Wednesday, DayOfWeek.Friday]}
        />
      )
    },
    {
      title: 'Calendar launched from a button',
      code: CalendarButtonExampleCode,

      view: <CalendarButtonExample highlightCurrentMonth={true} />,
      codepenJS: CalendarButtonExampleCodepen
    },
    {
      title: 'Month picker launched from a button',
      code: CalendarButtonExampleCode,

      view: (
        <CalendarButtonExample
          isDayPickerVisible={false}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          buttonString={'Click for Month Picker'}
        />
      )
    },
    {
      title: 'Calendar with overlayed month picker launched from a button',
      code: CalendarButtonExampleCode,

      view: (
        <CalendarButtonExample
          showMonthPickerAsOverlay={true}
          highlightCurrentMonth={false}
          highlightSelectedMonth={true}
          buttonString={'Click for Overlayed Day Picker and Month Picker'}
        />
      )
    }
  ],
  propertiesTablesSources: [
    require<string>('!raw-loader!office-ui-fabric-react/src/components/Calendar/Calendar.types.ts')
  ],
  overview: require<string>('!raw-loader!office-ui-fabric-react/src/components/Calendar/docs/CalendarOverview.md'),
  bestPractices: '',
  dos: require<string>('!raw-loader!office-ui-fabric-react/src/components/Calendar/docs/CalendarDos.md'),
  donts: require<string>('!raw-loader!office-ui-fabric-react/src/components/Calendar/docs/CalendarDonts.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true
};
