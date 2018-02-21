import * as React from 'react';
import { css, classNamesFunction } from '../../../Utilities';
import {
  getStyles,
  IButtonBasicExampleStyleProps,
  IButtonBasicExampleStyles
} from './Button.Basic.Example.styles';
import { IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';

export class ButtonIconExample extends React.Component<IButtonProps> {
  public render() {
    const { disabled, checked } = this.props;

    const getClassNames = classNamesFunction<IButtonBasicExampleStyleProps, IButtonBasicExampleStyles>();
    const classNames = getClassNames(getStyles);

    return (
      <div className={ css(classNames.example) }>
        <IconButton
          disabled={ disabled }
          checked={ checked }
          iconProps={ { iconName: 'Emoji2' } }
          title='Emoji'
          ariaLabel='Emoji'
        />
      </div>
    );
  }
}