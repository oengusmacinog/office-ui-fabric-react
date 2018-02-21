import * as React from 'react';
import './ThemeGeneratorPage.scss';
import {
  BaseComponent,
  autobind
} from 'office-ui-fabric-react/lib/Utilities';

import { loadTheme } from 'office-ui-fabric-react/lib/Styling';
import {
  IColor,
  getContrastRatio,
  updateA,
  isDark,
  getColorFromString
} from 'office-ui-fabric-react/lib/utilities/color/index';

import {
  ThemeGenerator,
  themeRulesStandardCreator,
  BaseSlots,
  FabricSlots,
  IThemeSlotRule,
  IThemeRules
} from 'office-ui-fabric-react/lib/ThemeGenerator';

import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker';

import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { TeachingBubbleBasicExample } from '../../components/TeachingBubble/examples/TeachingBubble.Basic.Example';
import { TextFieldBasicExample } from '../TextField/examples/TextField.Basic.Example';
import { ToggleBasicExample } from '../../components/Toggle/examples/Toggle.Basic.Example';
import { ProgressIndicatorBasicExample } from '../ProgressIndicator/examples/ProgressIndicator.Basic.Example';

export interface IThemeGeneratorPageState {
  themeRules: IThemeRules;
  colorPickerSlotRule: IThemeSlotRule | null;
  colorPickerElement: HTMLElement | null;
  colorPickerVisible: boolean;
}

const BackgroundImageUriKey = 'backgroundImageUri';
const BackgroundOverlayKey = 'backgroundOverlay';

export class ThemeGeneratorPage extends BaseComponent<{}, IThemeGeneratorPageState> {
  private _semanticSlotColorChangeTimeout: number;
  private _imgUrl: string;

  constructor(props: {}) {
    super(props);

    const themeRules = themeRulesStandardCreator();
    ThemeGenerator.insureSlots(themeRules, isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!));

    this.state = {
      themeRules: themeRules,
      colorPickerSlotRule: null,
      colorPickerElement: null,
      colorPickerVisible: false
    };
  }

  public componentWillUnmount(): void {
    // remove temp styles
    const root = document.querySelector('.App-content') as HTMLElement;
    if (root) {
      root.style.backgroundColor = '';
      root.style.color = '';
    }
    document.body.style.backgroundColor = '';
    document.body.style.color = '';

    // and apply the default theme to overwrite any existing custom theme
    const themeRules = themeRulesStandardCreator();
    ThemeGenerator.insureSlots(themeRules, false);
    loadTheme({ palette: themeRules });
  }

  public render() {
    const { colorPickerVisible, colorPickerSlotRule, colorPickerElement } = this.state;

    const fabricThemeSlots =
      [this._fabricSlotWidget(FabricSlots.themeDarker),
      this._fabricSlotWidget(FabricSlots.themeDark),
      this._fabricSlotWidget(FabricSlots.themeDarkAlt),
      this._fabricSlotWidget(FabricSlots.themePrimary),
      this._fabricSlotWidget(FabricSlots.themeSecondary),
      this._fabricSlotWidget(FabricSlots.themeTertiary),
      this._fabricSlotWidget(FabricSlots.themeLight),
      this._fabricSlotWidget(FabricSlots.themeLighter),
      this._fabricSlotWidget(FabricSlots.themeLighterAlt)];
    const fabricNeutralForegroundSlots =
      [this._fabricSlotWidget(FabricSlots.black),
      this._fabricSlotWidget(FabricSlots.neutralDark),
      this._fabricSlotWidget(FabricSlots.neutralPrimary),
      this._fabricSlotWidget(FabricSlots.neutralSecondary),
      this._fabricSlotWidget(FabricSlots.neutralTertiary)
      ];
    const fabricNeutralBackgroundSlots =
      [this._fabricSlotWidget(FabricSlots.neutralTertiaryAlt),
      this._fabricSlotWidget(FabricSlots.neutralQuaternary),
      this._fabricSlotWidget(FabricSlots.neutralQuaternaryAlt),
      this._fabricSlotWidget(FabricSlots.neutralLight),
      this._fabricSlotWidget(FabricSlots.neutralLighter),
      this._fabricSlotWidget(FabricSlots.neutralLighterAlt),
      this._fabricSlotWidget(FabricSlots.white)];

    return (
      <div className='ms-themer'>
        <p>
          This tool helps you easily create all the shades and slots for a custom theme.
          The theme can be used by Fabric React's styling package, see the <a href='https://github.com/OfficeDev/office-ui-fabric-react/tree/master/packages/styling'>documentation</a>.
          <br />
          As you modify one of the three base colors, the theme will update automatically based on predefined rules. You can modify each individual slot below as well.
        </p>

        {/* Hello! You've found hidden functionality for generating a theme from an image. This uses Microsoft's
          * Cognitive Vision API, documented here:
          * https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/quickstarts/javascript
          * We use that API to identify the most prominent background and foreground colors, and the accent color,
          * and generate a theme based off of those.
          * Since this API requires a personal subscription key, you'll have to enlist and insert your subscription
          * key in _makeThemeFromImg() below. Then, just uncomment this section. */}
        {/*}
        <div style={ { display: 'flex' } }>
          <div>URL to image:&nbsp;</div>
          <input type='text' id='imageUrl' />
          <button onClick={ this._makeThemeFromImg }>Create theme from image</button>
        </div>
        <div id='imageDescription' />
        <div><img id='imagePreview' style={ { maxHeight: '500px', maxWidth: '800px' } } /></div>
        {*/}

        {/* the shared popup color picker for slots */ }
        { colorPickerVisible && colorPickerSlotRule !== null && colorPickerSlotRule !== undefined && colorPickerElement &&
          <Callout
            key={ colorPickerSlotRule.name }
            gapSpace={ 10 }
            target={ colorPickerElement }
            setInitialFocus={ true }
            onDismiss={ this._colorPickerOnDismiss }
          >
            <ColorPicker
              color={ colorPickerSlotRule.color!.str }
              onColorChanged={ this._semanticSlotRuleChanged.bind(this, colorPickerSlotRule) }
            />
          </Callout>
        }

        {/* the three base slots, prominently displayed at the top of the page */ }
        <div style={ { display: 'flex' } }>
          { [this._baseColorSlotPicker(BaseSlots.primaryColor, 'Primary theme color'),
          this._baseColorSlotPicker(BaseSlots.foregroundColor, 'Body text color'),
          this._baseColorSlotPicker(BaseSlots.backgroundColor, 'Body background color')] }
        </div>
        <br />

        { this._outputSection() }
        <br />

        <h2>Fabric Palette</h2>
        <p>The original Fabric palette slots. These are raw colors with no prescriptive uses. Each one is a shade or tint of a base color.</p>
        <div className={ 'ms-themer-fabricPalette-root' }>
          <div>{ fabricThemeSlots }</div>
          <div>
            <p>generally used for text and foregrounds</p>
            { fabricNeutralForegroundSlots }
          </div>
          <div>
            <p>generally used for backgrounds</p>
            { fabricNeutralBackgroundSlots }
          </div>
        </div>
        <br />

        <h3>Samples</h3>
        { <div style={ { display: 'flex', flexDirection: 'row' } }>
          <div className='ms-themer-example'>
            <TextFieldBasicExample />
          </div>
          <div className='ms-themer-example'>
            <ToggleBasicExample />
            <ChoiceGroup
              options={ [
                {
                  key: 'A',
                  text: 'Option A'
                },
                {
                  key: 'B',
                  text: 'Option B',
                  checked: true
                }] }
              label='Pick one'
              required={ true }
            />,
            <ChoiceGroup
              options={ [
                {
                  key: 'C',
                  text: 'Option C',
                  disabled: true
                },
                {
                  key: 'D',
                  text: 'Option D',
                  checked: true,
                  disabled: true
                }] }
              label='Pick one'
              required={ true }
            />
          </div>
          <div className='ms-themer-example'>
            <TeachingBubbleBasicExample />
            <br />
            <ProgressIndicatorBasicExample />
          </div>
        </div> }

        <h3>Accessibility</h3>
        <p>Each pair of colors below should produce legible text and have a minimum contrast ratio of 4.5.</p>
        <table className='ms-themer-accessibilityTable'>
          <thead>
            <td>Sample text</td>
            <td>Contrast ratio</td>
            <td>Slot pair</td>
          </thead>
          <tbody>
            { [this._accessibilityRow(FabricSlots.neutralPrimary, FabricSlots.white)] }
          </tbody>
        </table>
      </div>
    );
  }

  @autobind
  /* tslint:disable:no-unused-variable */
  private _makeThemeFromImg() {
    /* tslint:enable:no-unused-variable */
    this._imgUrl = (document.getElementById('imageUrl') as HTMLInputElement).value;
    (document.getElementById('imagePreview') as HTMLImageElement).src = this._imgUrl;

    if (this._imgUrl) {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', this._cognitiveVisionCallback.bind(this));
      // you may need to change the URL here
      xhr.open('POST', 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description%2CColor&details=&language=en');
      xhr.setRequestHeader('Content-Type', 'application/json');
      alert('You forgot to set the subscription key!');
      xhr.setRequestHeader('Ocp-Apim-Subscription-Key', 'YourSubscriptionKeyHere'); // put your subscription key here
      xhr.send('{ "url": "' + this._imgUrl + '" }');
    } else {
      // remove related properties from theme
      const { themeRules } = this.state;
      if (themeRules.hasOwnProperty(BackgroundImageUriKey)) {
        delete themeRules[BackgroundImageUriKey];
      }
      if (themeRules.hasOwnProperty(BackgroundOverlayKey)) {
        delete themeRules[BackgroundOverlayKey];
      }
      this.setState({ themeRules: themeRules }, this._makeNewTheme);
    }
  }

  @autobind
  private _cognitiveVisionCallback(e: any) {
    const xhr = e.target;
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.response);

      document.getElementById('imageDescription')!.innerHTML = response.description.captions[0].text;

      /* API returns:
       response.color.accentColor
       response.color.dominantColorBackground
       response.color.dominantColorForeground */

      // converts a returned color from a word into a hex value conforming to our palette
      const getHexFromColor = (color: string, isBg: boolean) => {
        // todo: could use more logic based on isInverted and isBg
        switch (color.toLowerCase()) {
          case 'black': return '#1f1f1f';
          case 'blue': return '#0078d7';
          case 'brown': return '#754d12';
          case 'gray':
          case 'grey': return isBg ? '#444' : '#ccc';
          case 'green': return '#107c10';
          case 'orange': return '#ff8c00';
          case 'pink': return '#e3008c';
          case 'purple': return '#5c2d91';
          case 'red': return '#e81123';
          case 'teal': return '#008272';
          case 'white': return '#fff';
          case 'yellow': return '#fff100';
        }
        alert('Error: Unexpected color passed to getHexFromColor(): ' + color);
        return '#fff';
      };

      const { themeRules } = this.state;
      const bgColor = getHexFromColor(response.color.dominantColorBackground, true);
      const bgColorIsDark = isDark(getColorFromString(bgColor)!);
      ThemeGenerator.setSlot(
        themeRules[BaseSlots[BaseSlots.backgroundColor]],
        bgColor,
        bgColorIsDark,
        true,
        true);
      ThemeGenerator.setSlot(
        themeRules[BaseSlots[BaseSlots.primaryColor]],
        '#' + response.color.accentColor,
        bgColorIsDark,
        true,
        true);
      ThemeGenerator.setSlot(
        themeRules[BaseSlots[BaseSlots.foregroundColor]],
        getHexFromColor(response.color.dominantColorForeground, false),
        bgColorIsDark,
        true,
        true);

      themeRules[BackgroundImageUriKey] = {
        name: BackgroundImageUriKey,
        value: 'url(\'' + this._imgUrl + '\')',
        dependentRules: []
      };
      themeRules[BackgroundOverlayKey] = {
        name: BackgroundOverlayKey,
        color: updateA((themeRules[BaseSlots[BaseSlots.backgroundColor]]).color!, 50),
        dependentRules: []
      };

      this.setState({ themeRules: themeRules }, this._makeNewTheme);

    } else {
      alert('Error ' + xhr.status + ': ' + xhr.statusText);
    }
  }

  @autobind
  private _colorPickerOnDismiss() {
    this.setState({ colorPickerVisible: false });
  }

  @autobind
  private _semanticSlotRuleChanged(slotRule: IThemeSlotRule, color: string) {
    if (this._semanticSlotColorChangeTimeout) {
      clearTimeout(this._semanticSlotColorChangeTimeout);
    }
    this._semanticSlotColorChangeTimeout = this._async.setTimeout(() => {
      const { themeRules } = this.state;

      ThemeGenerator.setSlot(slotRule, color, isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!), true, true);
      this.setState({ themeRules: themeRules }, this._makeNewTheme);
    }, 20);
    // 20ms is low enough that you can slowly drag to change color and see that theme,
    // but high enough that quick changes don't get bogged down by a million changes inbetween
  }

  @autobind
  private _onSwatchClick(slotRule: IThemeSlotRule, ev: React.MouseEvent<HTMLElement>) {
    const { colorPickerSlotRule, colorPickerElement } = this.state;

    if (colorPickerSlotRule !== null && colorPickerSlotRule !== undefined && !!colorPickerElement && colorPickerSlotRule === slotRule && colorPickerElement === ev.target) { // same one, close it
      this.setState({ colorPickerVisible: false, colorPickerSlotRule: null, colorPickerElement: null });
    } else { // new one, open it
      this.setState({ colorPickerVisible: true, colorPickerSlotRule: slotRule, colorPickerElement: ev.target as HTMLElement });
    }
  }

  @autobind
  private _slotWidget(slotRule: IThemeSlotRule) {
    return (
      <div key={ slotRule.name } className='ms-themer-slot'>
        { this._colorSquareSwatchWidget(slotRule) }
        <div>
          <div>{ slotRule.name }</div>
          { !slotRule.isCustomized ?
            <div>Inherits from: { slotRule.inherits!.name }</div>
            : <div>Customized</div> }
        </div>
      </div>
    );
  }

  @autobind
  private _fabricSlotWidget(fabricSlot: FabricSlots) {
    return this._slotWidget(this.state.themeRules[FabricSlots[fabricSlot]]);
  }

  private _colorSquareSwatchWidget(slotRule: IThemeSlotRule) {
    return (
      <div
        key={ slotRule.name }
        className='ms-themer-swatch'
        style={ { backgroundColor: slotRule.color!.str } }
        onClick={ this._onSwatchClick.bind(this, slotRule) }
      />
    );
  }

  @autobind
  private _accessibilityRow(foreground: FabricSlots, background: FabricSlots) {
    const themeRules = this.state.themeRules;
    const bgc: IColor = themeRules[FabricSlots[background]].color!;
    const fgc: IColor = themeRules[FabricSlots[foreground]].color!;

    const contrastRatio = getContrastRatio(bgc, fgc);
    let contrastRatioString = String(contrastRatio);
    contrastRatioString = contrastRatioString.substr(0, contrastRatioString.indexOf('.') + 3);
    if (contrastRatio < 4.5) {
      contrastRatioString = '**' + contrastRatioString + '**';
    }

    return (
      <tr key={ String(foreground) + String(background) }>
        <td style={ { backgroundColor: bgc.str, color: fgc.str } }>The quick brown fox jumps over the lazy dog.</td>
        <td>{ contrastRatioString }</td>
        <td>{ FabricSlots[foreground] + ' + ' + FabricSlots[background] }</td>
      </tr>
    );
  }

  @autobind
  private _outputSection() {
    const themeRules = this.state.themeRules;

    // strip out the unnecessary shade slots from the final output theme
    const abridgedTheme: IThemeRules = {};
    for (const ruleName in themeRules) {
      if (themeRules.hasOwnProperty(ruleName)) {
        if (ruleName.indexOf('ColorShade') === -1 && ruleName !== 'primaryColor' && ruleName !== 'backgroundColor' && ruleName !== 'foregroundColor') {
          abridgedTheme[ruleName] = themeRules[ruleName];
        }
      }
    }

    return (
      <div>
        <h2>Output</h2>
        <div className={ 'ms-themer-output-root' }>
          <div>
            <h3>JSON</h3>
            <textarea
              readOnly={ true }
              spellCheck={ false }
              value={ JSON.stringify(ThemeGenerator.getThemeAsJson(abridgedTheme), void 0, 2) }
            />
          </div>
          <div>
            <h3>SASS</h3>
            <textarea
              readOnly={ true }
              spellCheck={ false }
              value={ ThemeGenerator.getThemeAsSass(abridgedTheme) }
            />
          </div>
          <div>
            <h3>PowerShell</h3>
            <textarea
              readOnly={ true }
              spellCheck={ false }
              value={ ThemeGenerator.getThemeForPowerShell(abridgedTheme) }
            />
          </div>
        </div>
      </div>
    );
  }

  @autobind
  private _makeNewTheme() {
    const themeAsJson: { [key: string]: string } = ThemeGenerator.getThemeAsJson(this.state.themeRules);
    console.log('New theme...', themeAsJson);

    const root = document.querySelector('.App-content') as HTMLElement;
    if (root) {
      root.style.backgroundColor = themeAsJson.backgroundColor;
      root.style.color = themeAsJson.bodyText;
    }
    document.body.style.backgroundColor = themeAsJson.backgroundColor;
    document.body.style.color = themeAsJson.bodyText;
    console.log('Full theme... ', loadTheme({ palette: themeAsJson }));
  }

  @autobind
  private _baseColorSlotPicker(baseSlot: BaseSlots, title: string) {
    let colorChangeTimeout: number;

    function _onColorChanged(newColor: string) {
      if (colorChangeTimeout) {
        clearTimeout(colorChangeTimeout);
      }
      colorChangeTimeout = this._async.setTimeout(() => {
        const themeRules = this.state.themeRules;
        const currentIsDark = isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!);
        ThemeGenerator.setSlot(
          themeRules[BaseSlots[baseSlot]],
          newColor,
          currentIsDark,
          true,
          true);
        if (currentIsDark !== isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!)) {
          // isInverted got swapped, so need to refresh slots with new shading rules
          ThemeGenerator.insureSlots(themeRules, !currentIsDark);
        }
        this.setState({ themeRules: themeRules }, this._makeNewTheme);
      }, 20);
      // 20ms is low enough that you can slowly drag to change color and see that theme,
      // but high enough that quick changes don't get bogged down by a million changes inbetween
    }

    return (
      <div className='ms-themer-paletteSlot' key={ baseSlot }>
        <h3>{ title }</h3>
        <div>
          <ColorPicker
            key={ 'baseslotcolorpicker' + baseSlot }
            color={ this.state.themeRules[BaseSlots[baseSlot]].color!.str }
            /* tslint:disable:jsx-no-bind */
            onColorChanged={ _onColorChanged.bind(this) }
          /* tslint:enable:jsx-no-bind */
          />
        </div>
        <div className='ms-themer-swatchBg' style={ { backgroundColor: this.state.themeRules[BaseSlots[baseSlot]].color!.str } }>
          <div className='ms-themer-swatch' style={ { backgroundColor: this.state.themeRules[BaseSlots[baseSlot]].color!.str } } />
          { [this._colorSquareSwatchWidget(this.state.themeRules[BaseSlots[baseSlot] + 'Shade1']),
          this._colorSquareSwatchWidget(this.state.themeRules[BaseSlots[baseSlot] + 'Shade2']),
          this._colorSquareSwatchWidget(this.state.themeRules[BaseSlots[baseSlot] + 'Shade3']),
          this._colorSquareSwatchWidget(this.state.themeRules[BaseSlots[baseSlot] + 'Shade4']),
          this._colorSquareSwatchWidget(this.state.themeRules[BaseSlots[baseSlot] + 'Shade5']),
          this._colorSquareSwatchWidget(this.state.themeRules[BaseSlots[baseSlot] + 'Shade6']),
          this._colorSquareSwatchWidget(this.state.themeRules[BaseSlots[baseSlot] + 'Shade7']),
          this._colorSquareSwatchWidget(this.state.themeRules[BaseSlots[baseSlot] + 'Shade8'])] }
        </div>
      </div>
    );
  }
}