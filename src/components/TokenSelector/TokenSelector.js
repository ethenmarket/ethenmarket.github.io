import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import Select from "react-select";
import "react-select/dist/react-select.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getTranslate } from "react-localize-redux";

import {
  openModal as openModalAction,
  MODAL_TYPES
} from "../../reducers/modal";
import {
  getTokens,
  getCurrentToken,
  setCurrentToken as setCurrentTokenAction
} from "../../reducers/tokens";


import "./styles.css";

import {
  Placeholder,
  AddTokenButton,
  Value,
  ValueWrapper,
  TokenTicker,
  TokenName,
  TokenTickerWrapper,
  NotVerified
} from "./styled";

import { List } from "../share";

const renderValueComponent = isActive => ({ children }) => (
  <div id="token-selector" className="Select-value">
    <Value active={isActive}>{children}</Value>

  </div>
);

const filterToken = (token, filter) => {
  if (!filter) return true;
  filter = filter.toLowerCase();
  return (
    (token.name || '').toLowerCase().includes(filter) ||
    (token.symbol || '').toLowerCase().includes(filter) ||
    token.address.toLowerCase().includes(filter)
  );
};

/* eslint-disable react/no-multi-comp */
const tokenPropType = PropTypes.shape({
  favorite: PropTypes.bool,
  verified: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string
});
const getRenderOptionComponent = (actions, { translate }) => {
  class RenderOptionComponent extends Component {
    render() {
      const { favorite, verified, label, value, name } = this.props.option;

      return (
        <ValueWrapper
          focused={this.props.focused}
          style={this.props.style}
        >
          <TokenTickerWrapper
            onClick={() => {
              this.props.selectValue(value);
            }}
          >
            <TokenTicker verified={verified} title={label} stared={favorite}>
              {label}
              {name && <TokenName> {name}</TokenName>}
            </TokenTicker>
            {!verified && <NotVerified>{translate("NOT_VERIFIED")}</NotVerified>}
          </TokenTickerWrapper>
        </ValueWrapper>
      );
    }
  };

  RenderOptionComponent.propTypes = {
    selectValue: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
    option: tokenPropType.isRequired,
    focused: PropTypes.bool.isRequired
  };

  return RenderOptionComponent;
};

const TOKEN_ROW_HEIGHT = 22.9928;
const TOKEN_LIST_HEIGHT = 200;
class TokenSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.currentToken.address,
      isOpen: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentToken.address !== this.props.currentToken.address) {
      this.setState({
        value: nextProps.currentToken.address
      });
    }
  }

  onOpen = () => {
    this.addKeyListeners();
    this.setState({ isOpen: true });
  }

  onClose = () => {
    this.removeKeyListeners();
    this.setState({ isOpen: false });
  }

  setValue = value => {
    if (!value) return;
    this.props.setCurrentToken({ token: value.address || value});
  };


  arrowRenderer = ({ isOpen }) =>
    isOpen ? null : <span className="Select-arrow" />;


  addKeyListeners = () => {
    this.keyListener = document.addEventListener('keydown', this.scrollTokenToView);
  }

  removeKeyListeners = () => {
    document.removeEventListener('keydown', this.scrollTokenToView);
  }

  scrollTokenToView = () => {
    if (this.tokensList && this.tokensList.scroll) {
      const scrollTop = this.tokensList.scroll.getScrollTop();
      if (this.focusedTokenIndex * TOKEN_ROW_HEIGHT < scrollTop) {
        this.tokensList.scrollTop(this.focusedTokenIndex * TOKEN_ROW_HEIGHT);
      } else if (
        this.focusedTokenIndex * (TOKEN_ROW_HEIGHT) > scrollTop + TOKEN_LIST_HEIGHT
      ) {
        this.tokensList.scrollTop((this.focusedTokenIndex + 1) * TOKEN_ROW_HEIGHT - TOKEN_LIST_HEIGHT);
      }
    }
  }
  menuRenderer = params => {
    const { openModal, translate } = this.props;
    const { options, focusedOption } = params;
    const Row = getRenderOptionComponent({ }, { translate });

    const newFocusedTokenIndex = options.indexOf(focusedOption);
    if (newFocusedTokenIndex !== this.focusedTokenIndex) {
      this.focusedTokenIndex = newFocusedTokenIndex;
    }

    const renderRow = ({key, index, style}) => (
      <Row
        focused={options[index] === focusedOption}
        style={style}
        key={key}
        selectValue={params.selectValue}
        option={options[index]}
      >
        {options[index].label}
      </Row>
    );

    return (
      <Fragment>
        <List
          ref={el => {this.tokensList = el;}}
          width={199}
          height={TOKEN_LIST_HEIGHT}
          rowHeight={TOKEN_ROW_HEIGHT}
          rowCount={options.length}
          renderRow={renderRow}
        />
        <AddTokenButton
          innerRef={b => {
            this.addTokenButton = b;
          }}
          onClick={() => {
            this.addTokenButton.focus();
            openModal({
              type: MODAL_TYPES.ADD_NEW_TOKEN
            });
          }}
        >
          + {translate("NEW_TOKEN")}
        </AddTokenButton>
      </Fragment>
    );
  };

  render() {
    const { tokens } = this.props;
    const { isOpen } = this.state;
    return (
      <Select
        onOpen={this.onOpen}
        onClose={this.onClose}
        className="token-selector-wrapper"
        value={this.state.value}
        clearable={false}
        onChange={this.setValue}
        filterOption={filterToken}
        menuRenderer={this.menuRenderer}
        arrowRenderer={this.arrowRenderer}
        placeholder={<Placeholder>ticker...</Placeholder>}
        valueComponent={renderValueComponent(!isOpen)}
        options={tokens.map(t => ({
          ...t,
          value: t.address,
          label: t.symbol || t.address
        }))}
      />
    );
  }
}

TokenSelector.propTypes = {
  openModal: PropTypes.func.isRequired,
  setCurrentToken: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(tokenPropType).isRequired,
  currentToken: PropTypes.shape({
    address: PropTypes.string
  }).isRequired,
  translate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tokens: getTokens(state),
  currentToken: getCurrentToken(state),
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openModal: openModalAction,
      setCurrentToken: setCurrentTokenAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(TokenSelector);
