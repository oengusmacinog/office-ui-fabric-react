import * as React from 'react';
import {
  BaseComponent,
  buttonProperties,
  css,
  divProperties,
  getId,
  getNativeProps
} from '../../Utilities';
import {
  IFacepileProps,
  IFacepilePersona,
  OverflowButtonType
} from './Facepile.types';
import {
  FocusZone,
  FocusZoneDirection
} from '../../FocusZone';
import {
  FacepileButton
} from './FacepileButton';
import {
  Icon
} from '../../Icon';
import {
  PersonaCoin,
  PersonaSize,
  PersonaInitialsColor
} from '../../PersonaCoin';
import * as stylesImport from './Facepile.scss';
const styles: any = stylesImport;

export class Facepile extends BaseComponent<IFacepileProps, {}> {
  public static defaultProps: IFacepileProps = {
    maxDisplayablePersonas: 5,
    personas: [],
    personaSize: PersonaSize.size32
  };

  private _ariaDescriptionId: string;

  constructor(props: IFacepileProps) {
    super(props);

    this._ariaDescriptionId = getId();

  }
  public render(): JSX.Element {
    let {
      overflowButtonProps,
      overflowButtonType,
    } = this.props;
    const {
      chevronButtonProps,
      maxDisplayablePersonas,
      className,
      personas,
      showAddButton
    } = this.props;
    const numPersonasToShow: number = Math.min(personas.length, maxDisplayablePersonas as number);

    // Added for deprecating chevronButtonProps.  Can remove after v1.0
    if (chevronButtonProps && !overflowButtonProps) {
      overflowButtonProps = chevronButtonProps;
      overflowButtonType = OverflowButtonType.downArrow;
    }

    return (
      <div className={ css('ms-Facepile', styles.root, className) }>
        <div
          className={ css('ms-Facepile-itemContainer', styles.itemContainer) }
        >
          { showAddButton ? this._getAddNewElement() : null }
          { this.onRenderAriaDescription() }
          <FocusZone
            ariaDescribedBy={ this._ariaDescriptionId }
            role='listbox'
            className={ css('ms-Facepile-members', styles.members) }
            direction={ FocusZoneDirection.horizontal }
          >
            {
              personas.slice(0, numPersonasToShow).map((persona: IFacepilePersona, index: number) => {
                const personaControl: JSX.Element = this._getPersonaControl(persona);
                return persona.onClick ?
                  this._getElementWithOnClickEvent(personaControl, persona, index) :
                  this._getElementWithoutOnClickEvent(personaControl, persona, index);
              })
            }
          </FocusZone>
          { overflowButtonProps ? this._getOverflowElement(numPersonasToShow) : null }
        </div>
      </div>
    );
  }

  protected onRenderAriaDescription() {
    const { ariaDescription } = this.props;

    // If ariaDescription is given, descriptionId will be assigned to ariaDescriptionSpan,
    // otherwise it will be assigned to descriptionSpan.
    return ariaDescription && (
      <span className={ styles.screenReaderOnly } id={ this._ariaDescriptionId }>{ ariaDescription }</span>
    );
  }

  private _getPersonaControl(persona: IFacepilePersona): JSX.Element {
    const { getPersonaProps, personaSize } = this.props;
    return (
      <PersonaCoin
        imageInitials={ persona.imageInitials }
        imageUrl={ persona.imageUrl }
        initialsColor={ persona.initialsColor }
        primaryText={ persona.personaName }
        size={ personaSize }
        {...(getPersonaProps ? getPersonaProps(persona) : null) }
      />
    );
  }

  private _getElementWithOnClickEvent(personaControl: JSX.Element, persona: IFacepilePersona, index: number): JSX.Element {
    return (
      <FacepileButton
        { ...getNativeProps(persona, buttonProperties) }
        key={ (!!persona.imageUrl ? 'i' : '') + index }
        data-is-focusable={ true }
        role='option'
        className={ css('ms-Facepile-itemButton ms-Facepile-person', styles.itemButton) }
        title={ persona.personaName }
        onClick={ this._onPersonaClick.bind(this, persona) }
        onMouseMove={ this._onPersonaMouseMove.bind(this, persona) }
        onMouseOut={ this._onPersonaMouseOut.bind(this, persona) }
      >
        { personaControl }
      </FacepileButton>
    );
  }

  private _getElementWithoutOnClickEvent(personaControl: JSX.Element, persona: IFacepilePersona, index: number): JSX.Element {
    return (
      <div
        { ...getNativeProps(persona, divProperties) }
        key={ (!!persona.imageUrl ? 'i' : '') + index }
        data-is-focusable={ true }
        role='option'
        className={ css('ms-Facepile-itemButton ms-Facepile-person', styles.itemButton) }
        title={ persona.personaName }
        onMouseMove={ this._onPersonaMouseMove.bind(this, persona) }
        onMouseOut={ this._onPersonaMouseOut.bind(this, persona) }
      >
        { personaControl }
      </div>
    );
  }

  private _getOverflowElement(numPersonasToShow: number): JSX.Element | null {
    switch (this.props.overflowButtonType) {
      case OverflowButtonType.descriptive:
        return this._getDescriptiveOverflowElement(numPersonasToShow);
      case OverflowButtonType.downArrow:
        return this._getIconElement('ChevronDown');
      case OverflowButtonType.more:
        return this._getIconElement('More');
      default:
        return null;
    }
  }

  private _getDescriptiveOverflowElement(numPersonasToShow: number): JSX.Element | null {
    const { overflowButtonProps, personas, personaSize } = this.props;
    const numPersonasNotPictured: number = personas.length - numPersonasToShow;

    if (!overflowButtonProps || numPersonasNotPictured < 1) { return null; }

    const personaNames: string = personas.slice(numPersonasToShow).map((p: IFacepilePersona) => p.personaName).join(', ');

    return (
      <FacepileButton
        { ...overflowButtonProps}
        ariaDescription={ personaNames }
        className={ css('ms-Facepile-descriptiveOverflowButton', 'ms-Facepile-itemButton', styles.descriptiveOverflowButton, styles.itemButton) }
      >
        <PersonaCoin
          title={ personaNames }
          size={ personaSize }
          onRenderInitials={ this._renderInitialsNotPictured(numPersonasNotPictured) }
          initialsColor={ PersonaInitialsColor.transparent }
        />
      </FacepileButton>
    );
  }

  private _getIconElement(icon: string): JSX.Element {
    const { overflowButtonProps, personaSize } = this.props;
    const overflowInitialsIcon = true;

    return (
      <FacepileButton
        {...overflowButtonProps}
        className={ css('ms-Facepile-overflowButton', 'ms-Facepile-itemButton', styles.overflowButton, styles.itemButton) }
      >
        <PersonaCoin
          size={ personaSize }
          onRenderInitials={ this._renderInitials(icon, overflowInitialsIcon) }
          initialsColor={ PersonaInitialsColor.transparent }
        />
      </FacepileButton>
    );
  }

  private _getAddNewElement(): JSX.Element {
    const { addButtonProps, personaSize } = this.props;

    return (
      <FacepileButton
        {...addButtonProps}
        className={ css('ms-Facepile-addButton', 'ms-Facepile-itemButton', styles.itemButton, styles.addButton) }
      >
        <PersonaCoin
          size={ personaSize }
          onRenderInitials={ this._renderInitials('AddFriend') }
        />
      </FacepileButton>
    );
  }

  private _onPersonaClick(persona: IFacepilePersona, ev?: React.MouseEvent<HTMLElement>): void {
    persona.onClick!(ev, persona);
    ev!.preventDefault();
    ev!.stopPropagation();
  }

  private _onPersonaMouseMove(persona: IFacepilePersona, ev?: React.MouseEvent<HTMLElement>): void {
    if (!!persona.onMouseMove) {
      persona.onMouseMove(ev, persona);
    }
  }

  private _onPersonaMouseOut(persona: IFacepilePersona, ev?: React.MouseEvent<HTMLElement>): void {
    if (!!persona.onMouseOut) {
      persona.onMouseOut(ev, persona);
    }
  }

  private _renderInitials(iconName: string, overflowButton?: boolean): () => JSX.Element {
    return (): JSX.Element => {
      return (
        <Icon
          iconName={ iconName }
          className={ overflowButton ? styles.overflowInitialsIcon : '' }
        />
      );
    };
  }

  private _renderInitialsNotPictured(numPersonasNotPictured: number): () => JSX.Element {
    return (): JSX.Element => {
      return (
        <span
          className={ styles.overflowInitialsIcon }
        >
          { '+' + numPersonasNotPictured }
        </span>
      );
    };
  }
}
