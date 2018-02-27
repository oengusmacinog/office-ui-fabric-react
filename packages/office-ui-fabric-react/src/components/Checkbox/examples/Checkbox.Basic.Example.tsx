import * as React from 'react';
import {
  Checkbox,
  ICheckboxStyles,
  ICheckboxProps
} from 'office-ui-fabric-react/lib/Checkbox';

export interface ICheckboxBasicExampleState {
  isChecked: boolean;
}

export class CheckboxBasicExample extends React.Component<{}, ICheckboxBasicExampleState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isChecked: false
    };

    this._onCheckboxChange = this._onCheckboxChange.bind(this);
  }

  public render() {
    const { isChecked } = this.state;

    return (
      <div>
        <Checkbox
          label='Standard checkbox'
          onChange={ this._onCheckboxChange }
          ariaDescribedBy={ 'descriptionID' }
          data-ted-rocks={ 'yup' }
          aria-hello-spain={ 'more yup' }
        />
      </div>
    );
  }

  private _onCheckboxChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean) {
    console.log(`The option has been changed to ${isChecked}.`);
  }
}