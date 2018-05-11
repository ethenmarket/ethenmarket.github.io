import { Component } from 'react';
import PropTypes from 'prop-types';

class MenuToggler extends Component {
  state = {
    isOpen: false
  };

  disabled = [];

  addDisable = (ref) => this.disabled.push(ref);

  toggleMenu = () => {
    this.setState(state => {
      if (!state.isOpen) {
        const listener = (e) => {
          if (this.disabled.every(ref => ref !== e.target)) {
            this.setState({ isOpen: false });
            document.removeEventListener('click', listener);
          }
        };
        document.addEventListener('click', listener);
      }
      return ({ isOpen: !state.isOpen });
    });
  }
  render() {
    const { isOpen } = this.state;

    return this.props.children({
      isOpen,
      toggle: this.toggleMenu,
      addDisable: this.addDisable
    });
  }
}

MenuToggler.propTypes = {
  children: PropTypes.func.isRequired,
  disable: PropTypes.array
};

MenuToggler.defaultProps = {
  disable: []
};

export default MenuToggler;