import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isFloat from "validator/lib/isFloat";
import BigNumber from "bignumber.js";
import { Button, Input, Loader, HoverableWarning } from "../../share";
import { isValidAddress, getPrecision, floorNumber } from "../../../utils";
import { withPadding } from '../../../styles';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: ${props => props.transfer ? "auto 1fr auto auto" : "repeat(4, auto)"};
  justify-content: left;
  margin: 15px 0;
  ${withPadding()}
`;

const CustomButton = Button.extend`
  margin-left: 10px;
`;


export const MOVE_FUNDS_TYPES = {
  WITHDRAW: "WITHDRAW",
  DEPOSIT: "DEPOSIT",
  TRANSFER: "TRANSFER"
};

const getAmountWithRightPrecision = (amount, decimals) => {
  const prec = getPrecision(amount);
  if (prec >= decimals) amount = floorNumber(amount, decimals);
  return amount;
};

class MoveFunds extends Component {
  state = {
    amount: "",
    address: "",
    amountInvalid: false,
    addressInvalid: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.decimals !== this.props.decimals && this.state.amount) {
      this.setState(state => ({
        amount: getAmountWithRightPrecision(state.amount, nextProps.decimals)
      }));
    }
  }

  checkAmountTroubling = amount =>
    (
      this.props.ether &&
      this.props.type === MOVE_FUNDS_TYPES.DEPOSIT &&
      !BigNumber(this.props.maxAmount).minus(amount || 0).gt('0.1')
    );


  handleAmountChange = amount => {
    const { decimals } = this.props;
    amount = getAmountWithRightPrecision(amount, decimals);
    this.setState({
      amount,
      amountInvalid: false,
      amountTroubling: this.checkAmountTroubling(amount)
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

  handleMaxButtonClick = () => {
    this.setState({ amount: this.props.maxAmount });
  }

  render() {
    const { type, symbol, isLoading, isError, ether, translate } = this.props;
    const { amount, address, amountInvalid, addressInvalid } = this.state;
    const isTransfer = type === MOVE_FUNDS_TYPES.TRANSFER;
    return (
      <Wrapper transfer={isTransfer}>
        <Input
          validate={val => isFloat(val.toString()) || val === ""}
          value={amount}
          desc={symbol}
          invalide={amountInvalid}
          placeholder="0.00"
          onChange={this.handleAmountChange}
        />
        {isTransfer && (
          <Input
            responsive
            value={address}
            desc={translate("ADDRESS")}
            placeholder="0x0000000000000000000000000000000000000000"
            invalide={addressInvalid}
            onChange={this.handleAddressChange}
            width="calc(100% - 0px)"
            style={{
              marginLeft: "10px"
            }}
          />
        )}
        <CustomButton onClick={this.handleButtonClick}>
          {translate(type)}
        </CustomButton>
        {
          ether && type !== MOVE_FUNDS_TYPES.WITHDRAW
            ? this.state.amountTroubling && (
              <HoverableWarning
                text={translate("NOT_ENOUGH_FUNDS_WARNING")}
              />
            )
            : <CustomButton onClick={this.handleMaxButtonClick}>{translate("MAX")}</CustomButton>
        }
        <Loader
          fillContainer
          width="36px"
          height="36px"
          padding="10"
          isLoading={isLoading}
          translate={translate}
          errorMessage="DEPOSIT_WARNING"
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
  decimals: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  maxAmount: PropTypes.string.isRequired,
  ether: PropTypes.bool.isRequired,
  translate: PropTypes.func.isRequired
};

MoveFunds.defaultProps = {
  isLoading: false,
  isError: false
};

export default MoveFunds;
