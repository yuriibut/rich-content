import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { mergeStyles } from '~/Utils/mergeStyles';
import styles from '~/Styles/dropdown.scss';

const DEFAULT_PLACEHOLDER_STRING = 'Select...';

class Dropdown extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      selected: this.getCurrentValue(props),
      isOpen: false
    };
    this.mounted = true;
    this.styles = mergeStyles({ styles, theme: props.theme });

  }

  componentWillReceiveProps (newProps) {
    this.setState({ selected: this.getCurrentValue(newProps) });
  }

  componentDidMount () {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.handleDocumentClick, false);
      document.addEventListener('touchend', this.handleDocumentClick, false);
    }
  }

  componentWillUnmount () {
    this.mounted = false;
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.handleDocumentClick, false);
      document.removeEventListener('touchend', this.handleDocumentClick, false);
    }
  }

  getCurrentValue(props) {
    if (typeof props.value !== 'undefined') {
      return props.value;
    } else if (typeof props.getValue === 'function') {
      return props.getValue();
    } else {
      return {
        label: props.placeholder || DEFAULT_PLACEHOLDER_STRING,
        value: ''
      };
    }
  }

  handleMouseDown (event) {
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(this.state.isOpen);
    }
    if (event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  setValue (value, label) {
    const newState = {
      selected: {
        value,
        label
      },
      isOpen: false
    };
    this.fireChangeEvent(newState);
    this.setState(newState);
  }

  fireChangeEvent = newState => {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption (option) {
    const optionClass = classNames({
      [styles['Dropdown-option']]: true,
      'is-selected': option === this.state.selected
    });

    const value = option.value || option.label || option;
    const label = option.label || option.value || option;
    const Icon = option.icon || null;

    return (
      <div
        key={value}
        className={optionClass}
        onMouseDown={this.setValue.bind(this, value, label)}
        onClick={this.setValue.bind(this, value, label)}
      >
        {Icon && <Icon/>}
        <span>{label}</span>
      </div>
    );
  }

  buildMenu () {
    const { options } = this.props;
    const ops = options.map(option => {
      if (option.type === 'group') {
        const groupTitle = (<div className={styles['Dropdown-title']}>{option.name}</div>);
        const _options = option.items.map(item => this.renderOption(item));

        return (
          <div className={styles['Dropdown-group']} key={option.name}>
            {groupTitle}
            {_options}
          </div>
        );
      } else {
        return this.renderOption(option);
      }
    });

    return ops.length ? ops : <div className={styles['Dropdown-noresults']}>No options found</div>;
  }

  handleDocumentClick = event => {
    if (this.mounted) {
      //eslint-disable-next-line
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        if (this.state.isOpen) {
          this.setState({ isOpen: false });
        }
      }
    }
  }

  render () {
    const { className } = this.props;
    const { styles } = this;
    const disabledClass = this.props.disabled ? 'Dropdown-disabled' : '';
    const selected = this.state.selected;

    const placeHolderValue = typeof selected === 'string' ? selected : (() => {
      const label = selected.label || '';
      const Icon = selected.icon || null;

      return (
        <span>
          {Icon ? <Icon/> : null}
          <span>{label}</span>
        </span>
      );
    })();
    const value = (<div className={styles['Dropdown-placeholder']}>{placeHolderValue}</div>);
    const menu = this.state.isOpen ? <div className={styles['Dropdown-menu']}>{this.buildMenu()}</div> : null;

    const dropdownClass = classNames({
      [className]: true,
      [styles['Dropdown-root']]: true,
      [styles['is-open']]: this.state.isOpen
    });

    return (
      <div className={dropdownClass}>
        <div
          className={classNames(styles['Dropdown-control'], disabledClass)}
          onMouseDown={this.handleMouseDown.bind(this)} onTouchEnd={this.handleMouseDown.bind(this)}
        >
          {value}
          <span
            className={classNames(styles['Dropdown-arrow'], {
              [styles['is-open']]: this.state.isOpen
            })}
          />
        </div>
        {menu}
      </div>
    );
  }
}

export default Dropdown;