import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getTranslate } from 'react-localize-redux';
import { Header, Table, Toggle, Note, Loading, withHover, Loader } from "../share";
import MoveFunds, { MOVE_FUNDS_TYPES } from "./MoveFunds";

import {
  getBalances,
  toggleMoveFundsMode as toggleMoveFundsModeAction,
  clearHighlight as clearHighlightAction,
  userIsUndefErrorMessage
} from "../../reducers/balances";

import { getCurrentToken } from "../../reducers/tokens";

import { cropAddress, getCellContent, getLinkToTransaction } from "../../utils";

import {
  deposit as depositAction,
  transfer as transferAction,
  withdraw as withdrawAction,
  isLoading as getIsLoading,
  isError,
  getBalances as getBalancesAction
} from "../../reducers/actions";

const LoadingTable = Loading(Table);

const NameCellChild = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
`;

const NameCellStyled = styled.div`
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  &:hover {
    ${props =>
    props.address
      ? `
          background-color: ${props.theme.primaryFontColor};
          flex-direction: row;
          padding: 0 20px;
          left: -20px;
          width: auto;
          cursor: pointer;
          position: relative;
          `
      : ""};
  }
  &:hover ${NameCellChild} {
    ${props =>
    props.address
      ? `
      position: static;
      overflow: visible;
      `
      : ""};
  }
`;

const NameCell = ({ hover, address, name }) => (
  <NameCellStyled address={address} >
    <NameCellChild>{hover ? (address || name) : name}</NameCellChild>
  </NameCellStyled>
);

const NameCellWithHover = withHover(NameCell);


const NameCellWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const BalanceCell = styled.div`
  ${props => props.bold && 'font-weight: bold;'}
  transition: background-color 0.2s ease-out;
  display: flex;
  height: 100%;
  align-items: center;
  ${props => props.highlight && `background-color: ${props.highlight};`}
`;

const getLoader = (tx) => {
  if (tx) {
    return (
      <a href={getLinkToTransaction(tx)} rel="noopener noreferrer" target="_blank" >
        <Loader
          fillContainer
          width="25px"
          height="25px"
          isLoading
        />
      </a>
    );
  }
  return null;
};

const getColumns = ({ onAddressClick, translate }) => [
  {
    Header: translate("TOKEN"),
    accessor: "name",
    width: "15%",
    align: 'left',
    renderCell: datum => (
      <CopyToClipboard
        text={datum.address || datum.name}
        onCopy={() => {
          onAddressClick(datum.address || datum.name);
        }}
      >
        <NameCellWrap>
          <NameCellWithHover name={datum.name} address={datum.address} />
        </NameCellWrap>
      </CopyToClipboard>
    )
  },
  {
    Header: "ETHEN",
    accessor: "ethen",
    renderCell: (datum) => (
      <BalanceCell
        bold
        data-token={datum.address}
        data-wallet="ethen"
        highlight={datum.highlight && datum.highlight.ethen}
      >
        {getLoader(datum.tx)}
        {getCellContent(datum.ethen)}
      </BalanceCell>
    )
  },
  {
    Header: translate("WALLET"),
    accessor: "wallet",
    renderCell: (datum) => (
      <BalanceCell
        data-token={datum.address}
        data-wallet="wallet"
        highlight={datum.highlight && datum.highlight.wallet}
      >
        {getCellContent(datum.wallet)}
      </BalanceCell>
    )
  },
  {
    Header: translate("TOTAL"),
    accessor: "total"
  }
];

class Balances extends Component {
  state = {
    showNote: false
  };

  componentDidMount() {
    window.addEventListener('focus', this.resetHighlightsAll);
    this.balances.addEventListener('transitionend', this.handleTransition);
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.resetHighlightsAll);
    this.balances.removeEventListener('transitionend', this.handleTransition);
  }

  getActionHandler = action => info => {
    action({
      ...info,
      isEtherActive: this.props.isEtherActive
    });
  };

  resetHighlightsAll = () => {
    this.props.clearHighlight({ all: true });
  }

  resetHighlights = () => {
    this.props.clearHighlight({ all: true });
  }

  handleTransition = (e) => {
    const { target: { dataset } } = e;
    if (dataset.wallet) {
      this.props.clearHighlight({token: dataset.token, wallet: dataset.wallet});
    }
  }

  toggleNote = () => {
    this.setState(() => {
      setTimeout(() => this.setState({ showNote: false }), 2500);
      return {
        showNote: true
      };
    });
  };

  render() {
    const {
      balances,
      mainBalances,
      toggleMoveFundsMode,
      isEtherActive,
      withdraw,
      deposit,
      transfer,
      isLoading,
      txState,
      token,
      error,
      requestData,
      errorMessage,
      translate
    } = this.props;
    const currentTokenBalance = balances.find(t => t.address === token.address) || {
      ethen: '0',
      wallet: '0'
    };
    const etherBalance = mainBalances.find(t => t.real);
    const maxBalance = isEtherActive ? etherBalance : currentTokenBalance;
    const symbol = token.symbol || cropAddress(token.address, 4);
    const decimals = isEtherActive ? 18 : token.decimals; // 18 because smallest unit is 1 wei
    balances.forEach(b => {
      if (b.highlight) {
        if (b.highlight.wallet) this.resetHighlights(b.address, 'wallet');
        if (b.highlight.ethen) this.resetHighlights(b.address, 'ethen');
      }
    });

    const columns = getColumns({
      onAddressClick: this.toggleNote,
      translate: this.props.translate
    });
    return (
      <div style={{ height: '100%' }} ref={(e) => {this.balances = e;}}>
        <Header>{translate("BALANCE")}</Header>
        <Note show={this.state.showNote}>{translate("COPIED")}</Note>
        <Tabs id="balances-tabs">
          <TabList>
            <Toggle
              leftText={symbol}
              rightText="ETH"
              position={isEtherActive ? "right" : "left"}
              onChange={toggleMoveFundsMode}
              style={{ marginRight: "30px" }}
            />
            <Tab>{translate("DEPOSIT")}</Tab>
            <Tab className="react-tabs__tab withdraw-tab">{translate("WITHDRAW")}</Tab>
            <Tab className="react-tabs__tab transfer-tab">{translate("TRANSFER")}</Tab>
          </TabList>
          <TabPanel>
            <MoveFunds
              translate={translate}
              maxAmount={maxBalance.wallet}
              decimals={decimals}
              isError={isError(txState)}
              isLoading={getIsLoading(txState)}
              action={this.getActionHandler(deposit)}
              type={MOVE_FUNDS_TYPES.DEPOSIT}
              symbol={isEtherActive ? "ETH" : symbol}
              ether={isEtherActive}
            />
          </TabPanel>
          <TabPanel>
            <MoveFunds
              translate={translate}
              maxAmount={maxBalance.ethen}
              decimals={decimals}
              action={this.getActionHandler(withdraw)}
              type={MOVE_FUNDS_TYPES.WITHDRAW}
              symbol={isEtherActive ? "ETH" : symbol}
              ether={isEtherActive}
            />
          </TabPanel>
          <TabPanel>
            <MoveFunds
              translate={translate}
              maxAmount={maxBalance.wallet}
              decimals={decimals}
              action={this.getActionHandler(transfer)}
              type={MOVE_FUNDS_TYPES.TRANSFER}
              symbol={isEtherActive ? "ETH" : symbol}
              ether={isEtherActive}
            />
          </TabPanel>
        </Tabs>
        <LoadingTable
          translate={translate}
          odd
          isLoading={isLoading}
          requestData={errorMessage === userIsUndefErrorMessage ? null : requestData}
          error={error}
          errorMessage={errorMessage}
          height="calc(100% - 148px)"
          data={balances}
          preHeader={mainBalances}
          columns={columns}
        />
      </div>
    );
  }
}

const balanceRowPropType = PropTypes.shape({
  name: PropTypes.string,
  wallet: PropTypes.string,
  ethen: PropTypes.string,
  bid: PropTypes.string,
  est: PropTypes.string
});

Balances.propTypes = {
  balances: PropTypes.arrayOf(balanceRowPropType).isRequired,
  mainBalances:  PropTypes.arrayOf(balanceRowPropType).isRequired,
  isEtherActive: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  toggleMoveFundsMode: PropTypes.func.isRequired,
  deposit: PropTypes.func.isRequired,
  withdraw: PropTypes.func.isRequired,
  transfer: PropTypes.func.isRequired,
  requestData: PropTypes.func.isRequired,
  clearHighlight: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  token: PropTypes.object.isRequired,
  txState: PropTypes.string.isRequired,
  errorMessage: PropTypes.string
};

const mapStateToProps = state => ({
  balances: getBalances(state).balances,
  mainBalances: getBalances(state).mainBalances,
  isEtherActive: state.balances.isEtherActive,
  isLoading: getIsLoading(state.balances.state),
  error: isError(state.balances.state),
  errorMessage: state.balances.errorMessage,
  token: getCurrentToken(state),
  txState: state.balances.txState,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleMoveFundsMode: toggleMoveFundsModeAction,
      deposit: depositAction,
      withdraw: withdrawAction,
      transfer: transferAction,
      requestData: getBalancesAction,
      clearHighlight: clearHighlightAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Balances);
