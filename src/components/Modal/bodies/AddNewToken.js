import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Header, CloseButton, ModalContent, InputLabel, ModalFooter } from '../styled';
import { Input, Button } from '../../share';

import { isValidAddress } from '../../../utils';

class AddNewToken extends Component {
  state = {
    address: '',
    isAddressInvalid: false
  }

  onAddressChange = (address) => {
    this.setState({ address, isAddressInvalid: false });
  }

  handleOkClick = () => {
    const { address } = this.state;
    if (isValidAddress(address)) {
      this.props.addNewToken(address);
      this.props.closeModal();
    } else {
      this.setState({
        isAddressInvalid: true
      });
    }
  }

  render() {
    const { closeModal } = this.props;
    const { address, isAddressInvalid } = this.state;
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
