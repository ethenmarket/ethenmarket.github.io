import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NS from 'react-notification-system';
import { connect } from "react-redux";

const LEVELS = {
  SUCCESS: 'success',
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warning'
};

class Notifications extends Component {
  componentWillReceiveProps(nextProps) {
    const oldError = this.props.error;
    const newError = nextProps.error;
    if (newError.nonce !== oldError.nonce) {
      this.ns.addNotification({
        ...newError,
        title: newError.title,
        message: newError.message,
        level: LEVELS.ERROR,
        dismissible: 'button',
        autoDismiss: 7
      });
    }

    const oldInfo = this.props.info;
    const newInfo = nextProps.info;
    if (newInfo.nonce !== oldInfo.nonce) {
      this.ns.addNotification({
        ...newInfo,
        title: newInfo.title,
        message: newInfo.message,
        level: LEVELS.INFO,
        dismissible: 'button',
        autoDismiss: 10,
        children: newInfo.children && (<div style={{ wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: newInfo.children }} />)
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
  info: state.notifications.info
});

export default connect(mapStateToProps)(Notifications);