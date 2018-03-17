import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isFloat from "validator/lib/isFloat";
import BigNumber from "bignumber.js";
import { Button, Input, Loading } from "../../share";

import { isValidAddress } from "../../../utils";

const Wrapper = styled.div`
  display: flex;
  justify-content: left;
  margin: 15px 0;
  padding: 0 20px;
`;

const CustomButton = Button.extend`
  margin-left: 20px;
  padding: 0 10px;
`;

const Loader = Loading(() => null);

export const MOVE_FUNDS_TYPES = {
  WITHDRAW: "Withdraw",
  DEPOSIT: "Deposit",
  TRANSFER: "Transfer"
};

class MoveFunds extends Component {
  state = {
    amount: "",
    address: "",
    amountInvalid: false,
    addressInvalid: false
  };

  handleAmountChange = amount => {
    this.setState({
      amount,
      amountInvalid: false
    });
  };

  handleAddressChange = address => {
    this.setState({
      address,
      addressInvalid: false
    });
  };

  handleButtonClick = () => {
    const { amount, address } = this.state;
    const amountInvalid =
      !isFloat(amount) ||
      BigNumber(amount).isZero() ||
      BigNumber(amount).isNegative();
    const addressInvalid =
      this.props.type === MOVE_FUNDS_TYPES.TRANSFER && !isValidAddress(address);
    if (amountInvalid || addressInvalid) {
      this.setState({
        amountInvalid,
        addressInvalid
      });
      return;
    }
    this.props.action({
      amount,
      address
    });
  };

  render() {
    const { type, symbol, isLoading, isError } = this.props;
    const { amount, address, amountInvalid, addressInvalid } = this.state;
    return (
      <Wrapper>
        <Input
          validate={val => isFloat(val.toString()) || val === ""}
          value={amount}
          desc={symbol}
          invalide={amountInvalid}
          placeholder="0.00"
          onChange={this.handleAmountChange}
        />
        {type === MOVE_FUNDS_TYPES.TRANSFER ? (
          <Input
            value={address}
            desc="Address"
            placeholder="0x0000000000000000000000000000000000000000"
            invalide={addressInvalid}
            onChange={this.handleAddressChange}
            width="305px"
            style={{
              marginLeft: "20px"
            }}
          />
        ) : null}
        <CustomButton onClick={this.handleButtonClick} width={94}>
          {type}
        </CustomButton>
        <Loader
          fillContainer
          width="36px"
          height="36px"
          isLoading={isLoading}
          errorMessage="Sorry, there was a problem during deposit"
          error={isError}
        />
      </Wrapper>
    );
  }
}

MoveFunds.propTypes = {
  symbol: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool
};

MoveFunds.defaultProps = {
  isLoading: false,
  isError: false
};

export default MoveFunds;
