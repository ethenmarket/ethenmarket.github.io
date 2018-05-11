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
    if (isValidAddress(address.trim())) {
      this.props.addNewToken(address);
    } else {
      this.setState({
        isAddressInvalid: true
      });
    }
  }

  render() {
    const { closeModal, translate } = this.props;
    const { address, isAddressInvalid } = this.state;
    return (
      <Fragment >
        <Header>{translate("NEW_TOKEN")}<CloseButton onClick={closeModal} /></Header>
        <ModalContent>
          <InputLabel>
            {translate("ADDRESS")}
            <Input
              responsive
              onChange={this.onAddressChange}
              value={address}
              invalide={isAddressInvalid}
              align="left"
              bgColor='#eaeaea'
              placeholder='0x0000000000000000000000000000000000000000'
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

AddNewToken.propTypes = {
  closeModal: PropTypes.func.isRequired,
  addNewToken: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default AddNewToken;
