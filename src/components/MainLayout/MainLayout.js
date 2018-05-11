import React from 'react';
import Layout, { Block } from '../Layout';
import Balances from '../Balances';

const MainLayout = () => (
  <Layout>
    <Block id="balance" type="balance">
      <Balances />
    </Block>
  </Layout>
);

export default MainLayout;