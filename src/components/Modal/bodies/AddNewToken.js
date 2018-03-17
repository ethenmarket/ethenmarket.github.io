import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isInt from 'validator/lib/isInt';
import { Header, CloseButton, ModalContent, InputLabel, ModalFooter } from '../styled';
import { Input, Button } from '../../share';

import { isValidAddress } from '../../../utils';

class AddNewToken extends Component {
  state = {
    address: '',
    decimals: '18',
    isAddressInvalid: false,
    isDecimalsInvalid: false
  }

  onAddressChange = (address) => {
    this.setState({ address, isAddressInvalid: false });
  }

  onDecimalsChange = (decimals) => {
    this.setState({ decimals, isDecimalsInvalid: false });
  }

  handleOkClick = () => {
    const { address, decimals } = this.state;
    const isAddressInvalid = !isValidAddress(address);
    const isDecimalsInvalid = !isInt(decimals);
    if (!isAddressInvalid && !isDecimalsInvalid) {
      this.props.addNewToken({ address, decimals });
      this.props.closeModal();
    } else {
      this.setState({
        isAddressInvalid,
        isDecimalsInvalid
      });
    }
  }

  render() {
    const { closeModal } = this.props;
    const { address, isAddressInvalid, decimals, isDecimalsInvalid } = this.state;
    return (
      <Fragment >
        <Header>New token<CloseButton onClick={closeModal} /></Header>
        <ModalContent>
          <InputLabel>
            Address
            <Input
              onChange={this.onAddressChange}
              value={address}
              invalide={isAddressInvalid}
              align="left"
              bgColor='#eaeaea'
              placeholder='0x0123456789abcd123456789e0000000000000000'
              border='1px solid #60758b'
              width='80%'
            />
          </InputLabel>
          <InputLabel>
            Decimals
            <Input
              onChange={this.onDecimalsChange}
              value={decimals}
              invalide={isDecimalsInvalid}
              align="left"
              bgColor='#eaeaea'
              placeholder='18'
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

AddNewToken.propTypes = {
  closeModal: PropTypes.func.isRequired,
  addNewToken: PropTypes.func.isRequired
};

export default AddNewToken;
