import React, { Component, Fragment } from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";
import Scrollbar from "react-custom-scrollbars";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openModal as openModalAction, MODAL_TYPES } from '../../reducers/modal';
import { getTokens, getCurrentToken } from '../../reducers/tokens';
import {
  currentTokenChanged as currentTokenChangedAction
} from '../../reducers/actions';
import "./styles.css";

import {
  Placeholder,
  AddTokenButton,
  Value,
  ValueWrapper,
  TokenTicker,
  TokenTickerWrapper,
  NotVerified
} from "./styled";

import { Star as StarButton } from '../share';

function renderValueComponent(props) {
  const { children } = props;
  return (
    <div className="Select-value">
      <Value>{children}</Value>
    </div>
  );
}

/* eslint-disable react/no-multi-comp */

class RenderOptionComponent extends Component {
  render() {
    const { stared, verified, label, value } = this.props.option;

    const starColor = stared ? "#0e995f" : "#eaeaea";
    return (
      <ValueWrapper>
        <StarButton color={starColor} width={15} height={15} onClick={console.log} />
        <TokenTickerWrapper
          onClick={() => {
            this.props.selectValue(value);
          }}
        >
          <TokenTicker title={label} stared={stared}>
            {this.props.children}
          </TokenTicker>
          {!verified && <NotVerified>not verified</NotVerified>}
        </TokenTickerWrapper>
      </ValueWrapper>
    );
  }
}

class TokenSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.tokens[0] && props.tokens[0].address
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentToken.address !== this.props.currentToken.address) {
      this.setState({
        value: nextProps.currentToken.address
      });
      return;
    }
    const firtsToken = nextProps.tokens[0];
    if (firtsToken) {
      this.setState({
        value: firtsToken.address
      });
    }
  }

  setValue = value => {
    this.props.currentTokenChanged(value);
  };

  arrowRenderer = ({ isOpen }) =>
    isOpen ? null : <span className="Select-arrow" />;
  menuRenderer = params => {
    // use default renderer in a hacky way
    const menu = Select.defaultProps.menuRenderer(params);

    const scrollBarProps = {
      autoHeight: true,
      autoHeightMin: 0,
      autoHeightMax: 200
    };

    const { openModal } = this.props;

    return (
      <Fragment>
        <Scrollbar {...scrollBarProps}>{menu}</Scrollbar>
        <AddTokenButton
          innerRef={(b) => {this.addTokenButton = b;}}
          onClick={() => {
            this.addTokenButton.focus();
            openModal({
              type: MODAL_TYPES.ADD_NEW_TOKEN
            });
          }}
        >
          + new token
        </AddTokenButton>
      </Fragment>
    );
  };

  render() {
    const { tokens } = this.props;
    return (
      <Select
        className="token-selector-wrapper"
        value={this.state.value}
        clearable={false}
        onChange={this.setValue}
        menuRenderer={this.menuRenderer}
        arrowRenderer={this.arrowRenderer}
        placeholder={<Placeholder>ticker...</Placeholder>}
        valueComponent={renderValueComponent}
        optionComponent={RenderOptionComponent}
        options={tokens.map(t => ({
          ...t,
          value: t.address,
          label: t.symbol || t.address
        }))}
      />
    );
  }
}

const mapStateToProps = state => ({
  tokens: getTokens(state),
  currentToken: getCurrentToken(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
  openModal: openModalAction,
  currentTokenChanged: currentTokenChangedAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TokenSelector);
