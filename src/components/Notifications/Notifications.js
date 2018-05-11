import React, { Component } from 'react';
import NS from 'react-notification-system';
import { connect } from "react-redux";
import { getTranslate } from 'react-localize-redux';

const LEVELS = {
  SUCCESS: 'success',
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warning'
};

const shouldTranslate = (translateOption, type) => {
  if (translateOption === true) return true;
  return translateOption && translateOption[type];
};

class Notifications extends Component {
  componentWillReceiveProps(nextProps) {
    const { translate } = nextProps;
    const oldError = this.props.error;
    const newError = nextProps.error;
    if (newError.nonce !== oldError.nonce) {
      this.ns.addNotification({
        ...newError,
        title: translate(newError.title || "") || newError.title,
        message: translate(newError.message || "") || newError.message,
        level: LEVELS.ERROR,
        dismissible: 'button',
        autoDismiss: 10,
        children: newError.children && (<div dangerouslySetInnerHTML={{ __html: newError.children }} />)
      });
    }

    const oldInfo = this.props.info;
    const newInfo = nextProps.info;
    const title = shouldTranslate(newInfo.translate, "title")
      ? translate(newInfo.title)
      : newInfo.title;

    const message = shouldTranslate(newInfo.translate, "message")
      ? translate(newInfo.message)
      : newInfo.message;
    if (newInfo.nonce !== oldInfo.nonce) {
      this.ns.addNotification({
        ...newInfo,
        title,
        message,
        level: LEVELS.INFO,
        dismissible: 'button',
        autoDismiss: 10,
        children: newInfo.children && (<div dangerouslySetInnerHTML={{ __html: newInfo.children }} />)
      });
    }
  }
  render() {
    return (
      <NS ref={ns => {this.ns = ns;}} />
    );
  }
};

const mapStateToProps = state => ({
  error: state.notifications.error,
  info: state.notifications.info,
  translate: getTranslate(state.locale)
});

export default connect(mapStateToProps)(Notifications);