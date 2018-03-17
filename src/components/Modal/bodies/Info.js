import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Header, CloseButton, ModalContent, ModalFooter } from '../styled';
import { Button } from '../../share';

class Info extends Component {

  handleOkClick = () => {
    this.props.okClick();
    this.props.closeModal();
  }

  render() {
    const { closeModal, okText, cancelText, header } = this.props;
    return (
      <Fragment >
        <Header>{header}<CloseButton onClick={closeModal} /></Header>
        <ModalContent>
          <p>{this.props.text}</p>
        </ModalContent>
        <ModalFooter>
          <Button textColor="rgb(150,167,184)" color='#eaeaea' onClick={closeModal}>{cancelText}</Button>
          <Button onClick={this.handleOkClick} width={60}>{okText}</Button>
        </ModalFooter>
      </Fragment>
    );
  }
}

Info.propTypes = {
  closeModal: PropTypes.func.isRequired,
  text: PropTypes.func.isRequired,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  header: PropTypes.string.isRequired,
  okClick: PropTypes.func.isRequired
};

Info.defaultProps = {
  okText: 'OK',
  cancelText: 'Cancel'
};

export default Info;
