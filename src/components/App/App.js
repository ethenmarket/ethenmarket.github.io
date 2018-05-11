import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { getTranslate } from "react-localize-redux";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../../theme";
import Header from "../Header";
import MainLayout from "../MainLayout";
import Modal from "../Modal";
import Notifications from "../Notifications";
import { ErrorMessage } from "../share";


const getTheme = () => {
  const name = localStorage.getItem('theme') || 'dark';
  return darkTheme.name === name ? darkTheme : lightTheme;
};

class App extends Component {
  state = {
    hasError: false,
    theme: getTheme()
  };

  componentDidMount() {
    document.body.classList.add(this.state.theme.name);
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log(info);
    console.error(error);
  }

  toogleTheme = () => {
    document.body.classList.remove(this.state.theme.name);
    const newTheme = this.state.theme.name === darkTheme.name
      ? lightTheme
      : darkTheme;
    localStorage.setItem('theme', newTheme.name);
    document.body.classList.add(newTheme.name);
    this.setState({
      theme: newTheme
    });
  };

  render() {
    const { translate } = this.props;
    const { theme } = this.state;
    if (this.state.hasError)
      return <ErrorMessage>{translate("FATAL_ERROR")}</ErrorMessage>;
    return (
      <ThemeProvider theme={this.state.theme}>
        <Fragment>
          <Modal loadGuide={this.loadGuide} />
          <Notifications />
          <Header
            showUserGuide={this.loadGuide}
            id="header"
            toogleTheme={this.toogleTheme}
            currentTheme={theme.name}
          />
          <MainLayout />
        </Fragment>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  translate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale)
});

export default connect(mapStateToProps)(App);
