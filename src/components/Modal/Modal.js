import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactModal from "react-modal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FocusLock from "react-focus-lock";

import { PRIVATE_KEY } from "../../API/web3";
import {
  closeModal as closeModalAction,
  MODAL_TYPES
} from "../../reducers/modal";
import {
  setPrivateKey as setPrivateKeyAction,
  selectProvider as selectProviderAction
} from "../../reducers/web3-provider";
import { addNewToken as addNewTokenAction } from "../../reducers/actions";
import { setGasPrice as setGasPriceAction } from "../../reducers/user";

import {
  AddNewToken,
  SetPrivateKey,
  SetGasPrice,
  Info
} from "./bodies";

ReactModal.setAppElement(document.getElementById("root"));

const getStylesByType = type =>
  type === MODAL_TYPES.MARKET
    ? {
      right: "0",
      left: "none",
      top: "53px",
      borderRadius: 0,
      height: "calc(100vh - 53px)",
      width: "50vw",
      boxSizing: "border-box",
      backgroundColor: "#1f2835",
      border: "none",
      padding: "0"
    }
    : {
      height: "fit-content",
      width: "45%",
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
    const { closeModal, data } = this.props;
    switch (this.props.type) {
      case MODAL_TYPES.ADD_NEW_TOKEN: {
        return (
          <AddNewToken
            addNewToken={this.props.addNewToken}
            closeModal={closeModal}
          />
        );
      }
      case MODAL_TYPES.SET_PRIVATE_KEY: {
        return (
          <SetPrivateKey
            setPrivateKey={key => {
              this.props.setPrivateKey(key);
              this.props.selectProvider(PRIVATE_KEY);
            }}
            closeModal={closeModal}
          />
        );
      }
      case MODAL_TYPES.SET_GAS_PRICE: {
        return (
          <SetGasPrice
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
          />
        );
      }
      default:
        return <div />;
    }
  };
  render() {
    const { type } = this.props;
    if (!type) return null;
    const contentStyles = getStylesByType(type);
    return (
      <FocusLock>
        <ReactModal
          isOpen={type !== null}
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
      </FocusLock>
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
  setGasPrice: PropTypes.func
};

const mapStateToProps = state => ({
  type: state.modal.type,
  data: state.modal.data
});

const mapActionToProps = dispatch =>
  bindActionCreators(
    {
      closeModal: closeModalAction,
      addNewToken: addNewTokenAction,
      setPrivateKey: setPrivateKeyAction,
      selectProvider: selectProviderAction,
      setGasPrice: setGasPriceAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapActionToProps)(Modal);
