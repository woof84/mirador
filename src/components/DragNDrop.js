import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

/**
 * A Drop in, IIIF Drag n' Drop component
 * @extends Component
 */
export class DragNDrop extends Component {
  /**
   * Determines whether or not a DataTransferItem is likely to be a IIIF Drag N
   * Drop link
   * https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
   * @param  {DataTransferItem} item
   * @return {Boolean}
   */
  static itemIsIIIFDragNDrop(item) {
    /**
     * Determine the following conditions:
     * If it is not currently a drag condition
     * Make sure there is an item
     * If there is an item to be dragged, make sure it is of types text/plain or text/uri-list
     * These are the conditions in which we think a IIIF DragnDrop is occuring.
     */
    if (item && (item.type === 'text/plain' || item.type === 'text/uri-list')) return true;
    return false;
  }

  /** */
  constructor(props) {
    super(props);
    this.state = {
      drag: false,
    };
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  /** */
  onDragEnter(e) {
    const item = e.dataTransfer.items[0];
    const isIIIF = DragNDrop.itemIsIIIFDragNDrop(item);
    console.log('dragEnter');
    // We must stop propagation here so that "Mosaic" doesn't think things are
    // being moved around
    if (isIIIF) {
      e.stopPropagation();
    }
    e.preventDefault();
    if (e.currentTarget.dataset.drag !== 'true' && isIIIF) {
      this.setState({
        drag: true,
      });
    }
  }

  /** */
  onDragLeave(e) {
    console.log('dragLeave');
    e.preventDefault();
    this.setState({
      drag: false,
    });
  }

  /** */
  onDrop(e, f) {
    const { addWindow } = this.props;
    e.preventDefault();
    console.log('drop');
    const item = e.dataTransfer.items[0];
    if (!DragNDrop.itemIsIIIFDragNDrop(item)) return;
    item.getAsString((uri) => {
      const url = new URL(uri);
      const search = new URLSearchParams(url.search);
      const manifest = search.get('manifest');
      if (manifest) addWindow({ manifestId: manifest });
    });
    this.setState({
      drag: false,
    });
  }

  /** */
  render() {
    const { children } = this.props;
    const { drag } = this.state;
    const style = {
      height: '100%',
    };
    if (drag) style.filter = 'brightness(0.4)';
    const textStyle = {
      display: 'none',
      position: 'absolute',
      textAlign: 'center',
      top: '50%',
      width: '100%',
      zIndex: 1000,
    };
    if (drag) textStyle.display = 'block';
    return (
      <>
        <div style={textStyle}>
          <Typography variant="h1" style={{ color: 'white' }}>
            Drop to Load Manifest
          </Typography>
        </div>
        <div
          style={style}
          data-drag={drag}
          onDragOver={this.onDragEnter}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
        >
          { children }
        </div>
      </>
    );
  }
}

DragNDrop.propTypes = {
  addWindow: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
