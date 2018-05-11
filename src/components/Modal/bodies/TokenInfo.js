import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Header,
  CloseButton,
  ModalContent,
  ModalFooter,
  Desc,
  PropName,
  PropValue
} from "../styled";
import { Button } from "../../share";
import { getLinkToAddress } from '../../../utils';

const getDesc = (desc, value) =>
  (value !== undefined && value !== null)
    ? (
      <Desc>
        <PropName>{desc}</PropName>
        <PropValue>{value}</PropValue>
      </Desc>
    )
    : null;

class TokenInfo extends Component {
  handleOkClick = () => {
    this.props.closeModal();
  };

  render() {
    const { closeModal, token, translate } = this.props;
    const header = token.name || token.address;
    const etherscanHref = getLinkToAddress(token.address);
    return (
      <Fragment>
        <Header>
          {header}
          <CloseButton onClick={closeModal} />
        </Header>
        <ModalContent>
          {getDesc(translate('NAME'), token.name)}
          {getDesc(translate('SYMBOL'), token.symbol)}
          {getDesc(translate('ADDRESS'), (<a target="_blank" href={etherscanHref} >{token.address}</a>))}
          {getDesc(translate('DECIMALS'), token.decimals)}
          {getDesc(translate('INFO'), token.info)}
        </ModalContent>
        <ModalFooter>
          <Button onClick={this.handleOkClick} width={60}>
            {translate("OK")}
          </Button>
        </ModalFooter>
      </Fragment>
    );
  }
}

TokenInfo.propTypes = {
  closeModal: PropTypes.func.isRequired,
  token: PropTypes.shape({
    name: PropTypes.string,
    symbol: PropTypes.string,
    decimals: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired,
    info: PropTypes.string,
    link: PropTypes.string
  }),
  translate: PropTypes.func.isRequired
};

TokenInfo.defaultProps = {
  token: {
    name: "",
    symbol: "",
    info: "",
    link: ""
  }
};

export default TokenInfo;
