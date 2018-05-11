import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isValidPrivate } from 'ethereumjs-util';
import isHexadecimal from 'validator/lib/isHexadecimal';
import { Buffer } from "buffer";
import { Header, CloseButton, ModalContent, InputLabel, ModalFooter } from '../styled';
import { Input, Button } from '../../share';

class SetPrivateKey extends Component {
  state = {
    privateKey: '',
    isPrivateKeyInvalid: false
  }

  onPrivateKeyChange = (privateKey) => {
    this.setState({ privateKey, isPrivateKeyInvalid: false });
  }

  handleOkClick = () => {
    let { privateKey } = this.state;
    privateKey = privateKey.trim();
    if (isHexadecimal(privateKey) && isValidPrivate(Buffer.from(privateKey, 'hex'))) {
      this.props.setPrivateKey(privateKey);
      this.props.closeModal();
    } else {
      this.setState({ isPrivateKeyInvalid: true });
    }
  }

  render() {
    const { closeModal, translate } = this.props;
    const { privateKey, isPrivateKeyInvalid } = this.state;
    return (
      <Fragment >
        <Header>{translate("SET_PK")}<CloseButton onClick={closeModal} /></Header>
        <ModalContent>
          <InputLabel>
            {translate("PK")}
            <Input
              responsive
              type="password"
              onChange={this.onPrivateKeyChange}
              invalide={isPrivateKeyInvalid}
              value={privateKey}
              align="left"
              bgColor='#eaeaea'
              placeholder='0000000000000000000000000000000000000000000000000000000000000000'
              border='1px solid #60758b'
              width='80%'
            />
          </InputLabel>
        </ModalContent>
        <ModalFooter>
          <Button textColor="rgb(150,167,184)" color='#eaeaea' onClick={closeModal}>{translate("CANCEL")}</Button>
          <Button onClick={this.handleOkClick} width={60}>{translate("OK")}</Button>
        </ModalFooter>
      </Fragment>
    );
  }
}

SetPrivateKey.propTypes = {
  closeModal: PropTypes.func.isRequired,
  setPrivateKey: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default SetPrivateKey;
