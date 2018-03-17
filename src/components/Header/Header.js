import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import {
  Wrapper,
  Logo,
  RightSide,
  TokensSelectorWrap,
  TokenSelectorLabel
  // MenuButton,
  // Lang,
  // LangWrapper,
  // Option
} from "./styled";
import TokenSelector from "../TokenSelector";
import AccountInfo from './AccountInfo';

import { openModal as openModalAction, MODAL_TYPES } from '../../reducers/modal';
import { selectProvider as selectProviderAction } from '../../reducers/web3-provider';

const Header = ({
  userAddress,
  userBalance,
  openModal,
  selectProvider,
  providers,
  currentProvider,
  privateKey,
  gasPrice,
  id
}) => (
  <Wrapper id={id}>
    <Logo>ETHEN</Logo>
    <AccountInfo
      selectProvider={selectProvider}
      userAddress={userAddress}
      userBalance={userBalance}
      providers={providers}
      currentProvider={currentProvider}
      openPrivateKeyModal={() => openModal({ type: MODAL_TYPES.SET_PRIVATE_KEY })}
      privateKey={privateKey}
      openGasPriceModal={() => openModal({ type: MODAL_TYPES.SET_GAS_PRICE, data: { gasPrice } })}
    />
    <TokensSelectorWrap>
      <TokenSelectorLabel>Tokens</TokenSelectorLabel>
      <TokenSelector />
    </TokensSelectorWrap>
    <RightSide>
      {/* <LangWrapper for="lang-selctor">
        <Lang id="lang-selctor">
          <Option>ENG</Option>
          <Option>РУС</Option>
          <Option>中國</Option>
        </Lang>
      </LangWrapper>
      <MenuButton /> */}
    </RightSide>
  </Wrapper>
);

Header.propTypes = {
  userAddress: PropTypes.string.isRequired,
  userBalance: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  selectProvider: PropTypes.func.isRequired,
  providers: PropTypes.array.isRequired,
  currentProvider: PropTypes.string.isRequired,
  privateKey: PropTypes.string.isRequired,
  gasPrice: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  userAddress: state.user.address,
  userBalance: state.user.balance,
  providers: Object.keys(state.web3Provider.available).filter(key => state.web3Provider.available[key]),
  currentProvider: state.web3Provider.current,
  privateKey: state.web3Provider.privateKey,
  gasPrice: state.user.gasPrice
});

const mapDispatchToProps = dispatch => bindActionCreators({
  openModal: openModalAction,
  selectProvider: selectProviderAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
