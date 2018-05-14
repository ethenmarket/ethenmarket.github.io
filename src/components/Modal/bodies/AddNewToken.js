import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Header, CloseButton, ModalContent, InputLabel, ModalFooter } from '../styled';
import { Input, Button } from '../../share';

import { isValidAddress } from '../../../utils';

class AddNewToken extends Component {
  state = {
    address: '',
    decimals: '',
    isAddressInvalid: false
  }

  onAddressChange = (address) => {
    this.setState({ address, isAddressInvalid: false });
  }

  onDecimalsChange = (decimals) => {
    this.setState({ decimals, isDecimalInvalid: false });
  }

  handleOkClick = () => {
    const { address, decimals } = this.state;
    const isDecimalInvalid = parseInt(decimals, 10).toString() !== decimals;
    const isAddressInvalid = !isValidAddress(address.trim());
    if (!(isAddressInvalid || isDecimalInvalid)) {
      this.props.addNewToken({ address, decimals });
    } else {
      this.setState({
        isAddressInvalid,
        isDecimalInvalid
      });
    }
  }

  render() {
    const { closeModal, translate } = this.props;
    const { address, isAddressInvalid, decimals, isDecimalInvalid } = this.state;
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
          <InputLabel>
            {translate("DECIMALS")}
            <Input
              responsive
              onChange={this.onDecimalsChange}
              value={decimals}
              invalide={isDecimalInvalid}
              align="left"
              bgColor='#eaeaea'
              placeholder='18'
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
