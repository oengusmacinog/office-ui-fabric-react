/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
/* tslint:enable:no-unused-variable */

import { Fabric } from '../../Fabric';
import { ILayerProps } from './Layer.types';
import { css, BaseComponent, getDocument, setVirtualParent } from '../../Utilities';
import * as stylesImport from './Layer.scss';
const styles: any = stylesImport;

const _layersByHostId: { [hostId: string]: Layer[] } = {};
let _defaultHostSelector: string | undefined;

export class Layer extends BaseComponent<ILayerProps, {}> {

  public static defaultProps: ILayerProps = {
    onLayerDidMount: () => undefined,
    onLayerWillUnmount: () => undefined
  };

  private _rootElement: HTMLElement;
  private _host: Node;
  private _layerElement: HTMLElement | undefined;
  private _hasMounted: boolean;
  /**
   * Used for notifying applicable Layers that a host is available/unavailable and to re-evaluate Layers that
   * care about the specific host.
   */
  public static notifyHostChanged(id: string) {
    if (_layersByHostId[id]) {
      _layersByHostId[id].forEach(layer => layer.forceUpdate());
    }
  }

  /**
   * Sets the default target selector to use when determining the host in which
   * Layered content will be injected into. If not provided, an element will be
   * created at the end of the document body.
   *
   * Passing in a falsey value will clear the default target and reset back to
   * using a created element at the end of document body.
   */
  public static setDefaultTarget(selector?: string) {
    _defaultHostSelector = selector;
  }

  constructor(props: ILayerProps) {
    super(props);

    this._warnDeprecations({
      onLayerMounted: 'onLayerDidMount'
    });

    if (this.props.hostId) {
      if (!_layersByHostId[this.props.hostId]) {
        _layersByHostId[this.props.hostId] = [];
      }

      _layersByHostId[this.props.hostId].push(this);
    }
  }

  public componentDidMount() {
    this.componentDidUpdate();
  }

  public componentWillUnmount() {
    this._removeLayerElement();

    if (this.props.hostId) {
      _layersByHostId[this.props.hostId] = _layersByHostId[this.props.hostId].filter(layer => layer !== this);
      if (!_layersByHostId[this.props.hostId].length) {
        delete _layersByHostId[this.props.hostId];
      }
    }
  }

  public componentDidUpdate() {
    const host = this._getHost();

    if (host !== this._host) {
      this._removeLayerElement();
    }

    if (host) {
      this._host = host;

      if (!this._layerElement) {
        const doc = getDocument(this._rootElement) as Document;

        this._layerElement = doc.createElement('div');
        this._layerElement.className = css('ms-Layer', {
          ['ms-Layer--fixed ' + styles.rootIsFixed]: !this.props.hostId
        });

        host.appendChild(this._layerElement);
        setVirtualParent(this._layerElement, this._rootElement);
      }

      // Using this 'unstable' method allows us to retain the React context across the layer projection.
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        (
          <Fabric className={ css('ms-Layer-content', styles.content) }>
            { this.props.children }
          </Fabric>
        ),
        this._layerElement,
        () => {
          if (!this._hasMounted) {
            this._hasMounted = true;

            // TODO: @deprecated cleanup required.
            if (this.props.onLayerMounted) {
              this.props.onLayerMounted();
            }

            this.props.onLayerDidMount!();
          }
        });
    }
  }

  public render() {
    return (
      <span
        className='ms-Layer'
        ref={ this._resolveRef('_rootElement') }
      />
    );
  }

  private _removeLayerElement() {
    if (this._layerElement) {
      this.props.onLayerWillUnmount!();

      ReactDOM.unmountComponentAtNode(this._layerElement);
      const parentNode = this._layerElement.parentNode;
      if (parentNode) {
        parentNode.removeChild(this._layerElement);
      }
      this._layerElement = undefined;
      this._hasMounted = false;
    }
  }

  private _getHost(): Node {
    const { hostId } = this.props;
    const doc = getDocument(this._rootElement) as Document;

    if (hostId) {
      return doc.getElementById(hostId) as Node;
    } else {
      return _defaultHostSelector ? doc.querySelector(_defaultHostSelector) as Node : doc.body;
    }
  }

}
