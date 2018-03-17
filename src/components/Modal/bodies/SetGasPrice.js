import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { Header, CloseButton, ModalContent, InputLabel, ModalFooter } from '../styled';
import { Input, Button } from '../../share';

const G = 1000000000;

class SetGasPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gasPrice: BigNumber(props.gasPrice).div(G),
      isGasPriceInvalide: false
    };
  }
  onAddressChange = (gasPrice) => {
    this.setState({ gasPrice, isGasPriceInvalide: false });
  }

  handleOkClick = () => {
    const { gasPrice } = this.state;
    if (BigNumber(gasPrice || 0).times(G).gte(1)) {
      this.props.setGasPrice(BigNumber(gasPrice).times(G).toString()); // to gwei
      this.props.closeModal();
    } else {
      this.setState({ isGasPriceInvalide: true });
    }
  }

  render() {
    const { closeModal } = this.props;
    const { gasPrice, isGasPriceInvalide } = this.state;
    return (
      <Fragment >
        <Header>Set gas price<CloseButton onClick={closeModal} /></Header>
        <ModalContent>
          <InputLabel>
            Gas price
            <Input
              onChange={this.onAddressChange}
              value={gasPrice}
              invalide={isGasPriceInvalide}
              align="left"
              bgColor='#eaeaea'
              desc="Gwei"
              placeholder='12'
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

SetGasPrice.propTypes = {
  closeModal: PropTypes.func.isRequired,
  setGasPrice: PropTypes.func.isRequired,
  gasPrice: PropTypes.string.isRequired
};

export default SetGasPrice;
