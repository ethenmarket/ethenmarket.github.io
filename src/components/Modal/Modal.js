import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';
import { withTheme } from "styled-components";
import { bindActionCreators } from "redux";
// import FocusLock from "react-focus-lock";

import { PRIVATE_KEY } from "../../API/web3";
import {
  closeModal as closeModalAction,
  MODAL_TYPES
} from "../../reducers/modal";
import {
  setPrivateKey as setPrivateKeyAction,
  selectProvider as selectProviderAction
} from "../../reducers/web3-provider";
import {
  addNewToken as addNewTokenAction,
  auth as authAction,
  sendEmail as sendEmailAction
} from "../../reducers/actions";
import { setGasPrice as setGasPriceAction } from "../../reducers/user";


import {
  AddNewToken,
  SetPrivateKey,
  SetGasPrice,
  Info,
  TokenInfo
} from "./bodies";

ReactModal.setAppElement(document.getElementById("root"));

const getStylesByType = (type, theme) =>
  type === MODAL_TYPES.MARKET
    ? {
      right: "0",
      left: "none",
      borderRadius: 0,
      top: '0',
      height: "100vh",
      width: "calc(50vw + 4px)",
      boxSizing: "border-box",
      backgroundColor: theme.bg1,
      border: "none",
      padding: "0"
    }
    : {
      height: "fit-content",
      width: "45%",
      minWidth: "500px",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: 0,
      backgroundColor: "#eaeaea",
      color: "rgb(97,118,139)",
      padding: 0
    };

class Modal extends Component {
  handleRequestCloseModal = () => {
    this.props.closeModal();
  };

  renderBody = () => {
    const { closeModal, data, translate } = this.props;
    switch (this.props.type) {
      case MODAL_TYPES.ADD_NEW_TOKEN: {
        return (
          <AddNewToken
            translate={translate}
            addNewToken={this.props.addNewToken}
            closeModal={closeModal}
          />
        );
      }
      case MODAL_TYPES.SET_PRIVATE_KEY: {
        return (
          <SetPrivateKey
            translate={translate}
            setPrivateKey={key => {
              this.props.setPrivateKey(key);
              this.props.selectProvider({ provider: PRIVATE_KEY });
            }}
            closeModal={closeModal}
          />
        );
      }
      case MODAL_TYPES.SET_GAS_PRICE: {
        return (
          <SetGasPrice
            translate={translate}
            setGasPrice={this.props.setGasPrice}
            closeModal={closeModal}
            gasPrice={data.gasPrice}
          />
        );
      }
      case MODAL_TYPES.INFO: {
        return (
          <Info
            closeModal={closeModal}
            okClick={closeModal}
            text={data.text}
            translate={translate}
          />
        );
      }
      case MODAL_TYPES.USER_GUIDE: {
        return (
          <Info
            header="GUIDE.GUIDE"
            okText="GUIDE.START"
            cancelText="GUIDE.SKIP"
            closeModal={closeModal}
            okClick={this.props.loadGuide}
            text="GUIDE.MODAL_TEXT"
            translate={translate}
          />
        );
      }
      case MODAL_TYPES.DISCLAIMER: {
        return (
          <Info
            header="DISCLAIMER"
            cancelText={null}
            closeModal={closeModal}
            text="DISCLAIMER_TEXT"
            translate={translate}
          />
        );
      }
      case MODAL_TYPES.AUTH: {
        return (
          <Info
            header="AUTHENTICATION"
            okText="AUTHENTICATE"
            closeModal={closeModal}
            okClick={this.props.auth}
            text="AUTH_MODAL_TEXT"
            withoutFinalClose
            translate={translate}
          />
        );
      }
      case MODAL_TYPES.TOKEN_INFO: {
        return (
          <TokenInfo
            token={data.token}
            closeModal={closeModal}
            translate={translate}
          />
        );
      }
      case MODAL_TYPES.SIGNING: {
        return (
          <Info
            header="SIGN_DATA"
            text="SIGN_DATA_TEXT"
            okText={null}
            cancelText={null}
            translate={translate}
          />
        );
      }
      default:
        return <div />;
    }
  };
  render() {
    const { type, theme } = this.props;
    if (!type) return null;
    const contentStyles = getStylesByType(type, theme);
    return (
      // <FocusLock>
      <ReactModal
        isOpen={type !== null}
        shouldCloseOnOverlayClick={type === MODAL_TYPES.MARKET}
        onRequestClose={this.handleRequestCloseModal}
        style={{
          overlay: {
            backgroundColor: "rgba(22,31,44, 0.5)",
            zIndex: "100"
          },
          content: contentStyles
        }}
      >
        {this.renderBody()}
      </ReactModal>
      // </FocusLock>
    );
  }
}

/* eslint-disable react/require-default-props */

Modal.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  addNewToken: PropTypes.func,
  setPrivateKey: PropTypes.func,
  selectProvider: PropTypes.func,
  setGasPrice: PropTypes.func,
  loadGuide: PropTypes.func,
  auth: PropTypes.func,
  translate: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  type: state.modal.type,
  data: state.modal.data,
  translate: getTranslate(state.locale)
});

const mapActionToProps = dispatch =>
  bindActionCreators(
    {
      closeModal: closeModalAction,
      addNewToken: addNewTokenAction,
      setPrivateKey: setPrivateKeyAction,
      selectProvider: selectProviderAction,
      setGasPrice: setGasPriceAction,
      auth: authAction,
      sendEmail: sendEmailAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapActionToProps)(withTheme(Modal));
