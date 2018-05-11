import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Header, CloseButton, ModalContent, ModalFooter } from '../styled';
import { Button } from '../../share';

class Info extends Component {
  handleOkClick = () => {
    if (this.props.okClick) this.props.okClick();
    if (this.props.withoutFinalClose) return;
    this.props.closeModal();
  }

  render() {
    const { closeModal, okText, cancelText, header, translate } = this.props;
    return (
      <Fragment >
        <Header>{translate(header)}{closeModal && <CloseButton onClick={closeModal} />}</Header>
        <ModalContent>
          <p>{translate(this.props.text)}</p>
        </ModalContent>
        <ModalFooter>
          {cancelText && <Button textColor="rgb(150,167,184)" color='#eaeaea' onClick={closeModal}>{translate(cancelText)}</Button>}
          {okText && <Button width={50} onClick={this.handleOkClick}>{translate(okText)}</Button>}
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
  okClick: PropTypes.func.isRequired,
  withoutFinalClose: PropTypes.bool,
  translate: PropTypes.func.isRequired
};

Info.defaultProps = {
  okText: 'OK',
  cancelText: 'CANCEL',
  withoutFinalClose: false
};

export default Info;
