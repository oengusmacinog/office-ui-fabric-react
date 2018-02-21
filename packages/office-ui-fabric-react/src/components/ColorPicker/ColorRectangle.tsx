import * as React from 'react';
import {
  BaseComponent,
  assign,
  autobind,
  css
} from '../../Utilities';
import {
  IColor,
  MAX_COLOR_SATURATION,
  MAX_COLOR_VALUE,
  getFullColorString,
  hsv2hex
} from '../../utilities/color/colors';
import * as stylesImport from './ColorPicker.scss';
const styles: any = stylesImport;

export interface IColorRectangleProps {
  componentRef?: () => void;
  color: IColor;
  minSize?: number;

  onSVChanged?(s: number, v: number): void;
}

export interface IColorPickerState {
  isAdjusting?: boolean;
  origin?: { x: number, y: number, color: IColor };
  color?: IColor;
  fullColorString?: string;
}

export class ColorRectangle extends BaseComponent<IColorRectangleProps, IColorPickerState> {
  public static defaultProps = {
    minSize: 220
  };

  public refs: {
    [key: string]: React.ReactInstance;
    root: HTMLElement;
  };

  constructor(props: IColorRectangleProps) {
    super(props);

    const { color } = this.props;

    this.state = {
      isAdjusting: false,
      origin: undefined,
      color: color,
      fullColorString: getFullColorString(color)
    };
  }

  public componentWillUnmount() {
    this._events.dispose();
  }

  public componentWillReceiveProps(newProps: IColorRectangleProps) {
    const { color } = newProps;

    this.setState({
      color: color,
      fullColorString: getFullColorString(color)
    });
  }

  public render() {
    const { minSize } = this.props;
    const { color, fullColorString } = this.state;

    return (
      <div ref='root' className={ css('ms-ColorPicker-colorRect', styles.colorRect) } style={ { minWidth: minSize, minHeight: minSize, backgroundColor: fullColorString } } onMouseDown={ this._onMouseDown }>
        <div className={ css('ms-ColorPicker-light', styles.light) } />
        <div className={ css('ms-ColorPicker-dark', styles.dark) } />
        <div className={ css('ms-ColorPicker-thumb', styles.thumb) } style={ { left: color!.s + '%', top: (MAX_COLOR_VALUE - color!.v) + '%', backgroundColor: color!.str } } />
      </div>
    );
  }

  @autobind
  private _onMouseDown(ev: React.MouseEvent<HTMLElement>) {
    this._events.on(window, 'mousemove', this._onMouseMove, true);
    this._events.on(window, 'mouseup', this._onMouseUp, true);

    this._onMouseMove(ev);
  }

  @autobind
  private _onMouseMove(ev: React.MouseEvent<HTMLElement>) {
    const { color, onSVChanged } = this.props;
    const rectSize = this.refs.root.getBoundingClientRect();

    const sPercentage = (ev.clientX - rectSize.left) / rectSize.width;
    const vPercentage = (ev.clientY - rectSize.top) / rectSize.height;

    const newColor = assign({}, color, {
      s: Math.min(MAX_COLOR_SATURATION, Math.max(0, sPercentage * MAX_COLOR_SATURATION)),
      v: Math.min(MAX_COLOR_VALUE, Math.max(0, MAX_COLOR_VALUE - (vPercentage * MAX_COLOR_VALUE))),
    });

    newColor.hex = hsv2hex(newColor.h, newColor.s, newColor.v);
    newColor.str = newColor.a === 100 ? '#' + newColor.hex : `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a / 100})`;

    this.setState({
      isAdjusting: true,
      color: newColor
    });

    if (onSVChanged) {
      onSVChanged(newColor.s, newColor.v);
    }
    ev.preventDefault();
    ev.stopPropagation();
  }

  @autobind
  private _onMouseUp(ev: React.MouseEvent<HTMLElement>) {
    this._events.off();

    this.setState({
      isAdjusting: false,
      origin: undefined
    });
  }

}
