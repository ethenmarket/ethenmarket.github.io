import React, { Fragment, Component } from 'react';

import Layout, { Block } from '../Layout';
import Balances from '../Balances';
import Header from '../Header';
import Modal from '../Modal';
import Notifications from '../Notifications';
import { Border, ErrorMessage } from '../share';


class App extends Component {
  state = { hasError: false }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log(info);
    console.error(error);
  }
  render() {
    if (this.state.hasError) return (<ErrorMessage>Something went wrong, please update page</ErrorMessage>);
    return (
      <Fragment>
        <Modal loadGuide={this.loadGuide} />
        <Notifications />
        <Header showUserGuide={this.loadGuide} id="header" />
        <Layout>
          <Block id="balance" type="balance">
            <Border bottom>
              <Balances />
            </Border>
          </Block>
        </Layout>
      </Fragment>
    );
  }
};

export default App;