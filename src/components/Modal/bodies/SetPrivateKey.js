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
    const { privateKey } = this.state;
    if (isHexadecimal(privateKey) && isValidPrivate(Buffer.from(privateKey, 'hex'))) {
      this.props.setPrivateKey(privateKey);
      this.props.closeModal();
    } else {
      this.setState({ isPrivateKeyInvalid: true });
    }
  }

  render() {
    const { closeModal } = this.props;
    const { privateKey, isPrivateKeyInvalid } = this.state;
    return (
      <Fragment >
        <Header>Set private key<CloseButton onClick={closeModal} /></Header>
        <ModalContent>
          <InputLabel>
            Private key
            <Input
              type="password"
              onChange={this.onPrivateKeyChange}
              invalide={isPrivateKeyInvalid}
              value={privateKey}
              align="left"
              bgColor='#eaeaea'
              placeholder='bbf1f78b3dcfb434f60c5faee1a5a7aba7ec00cf09613057de771f654287ae8f'
              border='1px solid #60758b'
              width='80%'
            />
          </InputLabel>
        </ModalContent>
        <ModalFooter>
          <Button textColor="rgb(150,167,184)" color='#eaeaea' onClick={closeModal}>Cancel</Button>
          <Button onClick={this.handleOkClick} width={60}>Ok</Button>
        </ModalFooter>
      </Fragment>
    );
  }
}

SetPrivateKey.propTypes = {
  closeModal: PropTypes.func.isRequired,
  setPrivateKey: PropTypes.func.isRequired
};

export default SetPrivateKey;
