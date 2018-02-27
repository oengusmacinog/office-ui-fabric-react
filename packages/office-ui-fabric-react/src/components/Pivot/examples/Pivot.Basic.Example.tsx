import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { BaseComponent } from '../../../Utilities';
import { ActionButton } from '../../Button';
import { IPivotProps } from '../Pivot.types';
import { IPivotItemProps } from '../PivotItem.types';
// import { IPivotItemProps } from '../PivotItem.types';
import { Pivot, PivotItem, IPivotState } from 'office-ui-fabric-react/lib/Pivot';
import * as exampleStylesImport from '../../../common/_exampleStyles.scss';
const exampleStyles: any = exampleStylesImport;

export class MyCustomPivotItem extends BaseComponent<IPivotItemProps, {}> {
  public render() {
    return (
      <aside { ...this.props.with }>
        <Label>Special Pivot</Label>
      </aside>
    );
  }
}

export class PivotBasicExample extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <Pivot
          as={ 'article' }
          with={ {
            'data-order': 12,
            'data-title': 'ted'
          } }
        >
          <PivotItem linkText='My Files'>
            <Label className={ exampleStyles.exampleLabel }>Pivot #1</Label>
          </PivotItem>
          <PivotItem
            as={ MyCustomPivotItem }
            with={ { 'data-name': 'third' } }
            linkText='Recent'
          >
            <Label>Pivot #2</Label>
          </PivotItem>
          <PivotItem
            as={ 'span' }
            with={ { 'data-name': 'third' } }
            linkText='Shared with me'
          >
            <Label>Pivot #3</Label>
          </PivotItem>
        </Pivot>
      </div>
    );
  }
}
