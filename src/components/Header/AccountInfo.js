import React, { Component } from "react";

import {
  AccountInfoWrapper,
  EtherAmount,
  Info,
  AccountInfoMenu,
  FullAddress,
  MenuItem,
  Badge
} from "./styled";

import { cropAddress } from '../../utils';
import { LEDGER, METAMASK, PRIVATE_KEY } from '../../API/web3';

class AccountInfo extends Component {
  state = {
    isOpen: false
  };

  toggleMenu = () => {
    this.setState(state => {
      if (!state.isOpen) {
        const listener = (e) => {
          if (e.target !== this.addr) {
            this.setState({ isOpen: false });
            document.removeEventListener('click', listener);
          }
        };
        document.addEventListener('click', listener);
      }
      return ({ isOpen: !state.isOpen });
    });
  }
  render() {
    const {
      userAddress,
      userBalance,
      providers,
      selectProvider,
      currentProvider,
      privateKey,
      openPrivateKeyModal,
      openGasPriceModal
    } = this.props;
    return (
      <AccountInfoWrapper>
        <Info onClick={this.toggleMenu}>{cropAddress(userAddress)}</Info>
        {this.state.isOpen && (
          <AccountInfoMenu>
            <FullAddress  innerRef={addr => {this.addr = addr;}}>{userAddress}</FullAddress>
            {
              providers.map(name => {
                switch(name) {
                  case METAMASK: {
                    return <MenuItem onClick={() => selectProvider(METAMASK)}>Use Metamask wallet</MenuItem>;
                  }
                  case LEDGER: {
                    return <MenuItem onClick={() => selectProvider(LEDGER)}>Use Ledger Nano S wallet</MenuItem>;
                  }
                  default: return null;
                }
              })
            }
            <MenuItem
              onClick={() => {
                if (privateKey) selectProvider(PRIVATE_KEY);
                else openPrivateKeyModal();
              }}
            >Use private key (not recomended)
            </MenuItem>
            <MenuItem onClick={openPrivateKeyModal}>
              Set private key (not recomended)
            </MenuItem>
            <MenuItem onClick={openGasPriceModal}>Gas price</MenuItem>
          </AccountInfoMenu>
        )}
        <EtherAmount>
          {userBalance} ETH

          {
            currentProvider && (
              <Badge color={currentProvider === PRIVATE_KEY ? 'rgb(255,52,52)' : '#1cbb78'}>
                {currentProvider.replace(/_/g, ' ')}
              </Badge>
            )
          }
        </EtherAmount>
      </AccountInfoWrapper>
    );
  }
}

export default AccountInfo;
