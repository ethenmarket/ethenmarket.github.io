import PropTypes from "prop-types";
import React from "react";
import { getTranslate } from "react-localize-redux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isLoading, selectLanguage as selectLanguageAction } from "../../reducers/actions";
import { MODAL_TYPES, openModal as openModalAction } from "../../reducers/modal";
import { getCurrentToken } from "../../reducers/tokens";
import { selectProvider as selectProviderAction } from "../../reducers/web3-provider";
import TokenSelector from "../TokenSelector";
import AccountInfo from "./AccountInfo";
import BurgerMenu from "./BurgerMenu";
import LangSelector from "./LangSelector";
import { DisclamerButton, Logo, RightSide, TokenInfoButton, TokenSelectorLabel, TokensSelectorWrap, VerticalHR, Wrapper } from "./styled";

const Header = ({
  userAddress,
  userBalance,
  openModal,
  selectProvider,
  providerLoading,
  currentProvider,
  privateKey,
  gasPrice,
  showUserGuide,
  currentToken,
  translate,
  languages,
  selectLanguage,
  toogleTheme,
  currentTheme
}) => (
  <Wrapper id="header">
    <Logo href="/">ETHEN</Logo>
    <AccountInfo
      translate={translate}
      selectProvider={selectProvider}
      userAddress={userAddress}
      userBalance={userBalance}
      providerLoading={providerLoading}
      currentProvider={currentProvider}
      openPrivateKeyModal={() =>
        openModal({ type: MODAL_TYPES.SET_PRIVATE_KEY })
      }
      privateKey={privateKey}
      openGasPriceModal={() =>
        openModal({ type: MODAL_TYPES.SET_GAS_PRICE, data: { gasPrice } })
      }
    />
    <TokensSelectorWrap>
      <TokenSelectorLabel>{translate("TOKENS")}</TokenSelectorLabel>
      <TokenSelector />
      <TokenInfoButton
        onClick={() =>
          openModal({
            type: MODAL_TYPES.TOKEN_INFO,
            data: { token: currentToken }
          })
        }
        title={translate("CURRENT_TOKEN_INFO")}
      />
    </TokensSelectorWrap>
    <RightSide>
      <DisclamerButton
        onClick={() => openModal({ type: MODAL_TYPES.DISCLAIMER })}
      >
        {translate("DISCLAIMER")}
      </DisclamerButton>
      <VerticalHR />
      <LangSelector languages={languages} selectLanguage={selectLanguage} />
      <VerticalHR />
      <BurgerMenu
        currentLanguage={languages.find(l => l.active)}
        showUserGuide={showUserGuide}
        translate={translate}
        toogleTheme={toogleTheme}
        currentTheme={currentTheme}
      />
    </RightSide>
  </Wrapper>
);

Header.propTypes = {
  userAddress: PropTypes.string.isRequired,
  userBalance: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  selectProvider: PropTypes.func.isRequired,
  currentProvider: PropTypes.string.isRequired,
  privateKey: PropTypes.string.isRequired,
  gasPrice: PropTypes.string.isRequired,
  showUserGuide: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  currentToken: PropTypes.object.isRequired,
  providerLoading: PropTypes.bool.isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
      active: PropTypes.bool
    })
  ).isRequired,
  selectLanguage: PropTypes.func.isRequired,
  toogleTheme: PropTypes.func.isRequired,
  currentTheme: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  userAddress: state.user.address,
  userBalance: state.user.balance,
  currentProvider: state.web3Provider.current,
  privateKey: state.web3Provider.privateKey,
  gasPrice: state.user.gasPrice,
  currentToken: getCurrentToken(state),
  providerLoading: isLoading(state.web3Provider.state),
  translate: getTranslate(state.locale),
  languages: state.locale.languages
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openModal: openModalAction,
      selectProvider: selectProviderAction,
      selectLanguage: selectLanguageAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Header);
