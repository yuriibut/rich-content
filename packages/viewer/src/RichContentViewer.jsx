import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mergeStyles } from 'wix-rich-content-common';
import styles from './Styles/rich-content-viewer.scss';
import Preview from './Preview';

export default class RichContentViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      raw: props.initialState || {},
    };
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialState !== nextProps.initialState) {
      this.setState({ raw: nextProps.initialState });
    }
  }

  render() {
    const { styles } = this;
    const { theme } = this.props;
    const wrapperClassName = classNames(styles.wrapper, {
      [styles.desktop]: !this.props.platform || this.props.platform === 'desktop',
    });
    return (
      <div className={wrapperClassName}>
        <div className={styles.editor}>
          <Preview raw={this.state.raw} typeMappers={this.props.typeMappers} theme={theme}/>
        </div>
      </div>
    );
  }
}

RichContentViewer.propTypes = {
  initialState: PropTypes.object,
  isMobile: PropTypes.bool,
  helpers: PropTypes.object,
  platform: PropTypes.string,
  typeMappers: PropTypes.arrayOf(PropTypes.func).isRequired,
  theme: PropTypes.object,
};