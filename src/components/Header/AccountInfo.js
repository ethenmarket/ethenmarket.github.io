import React, { Component, Fragment } from "react";
import { Loading, MenuToggler } from '../share';
import {
  AccountInfoWrapper,
  EtherAmount,
  Info,
  AccountInfoMenu,
  FullAddress,
  MenuItem,
  Badge
} from "./styled";

import { zeroAddress } from '../../reducers/user';
import { cropAddress } from '../../utils';
import { LEDGER, METAMASK, PRIVATE_KEY } from '../../API/web3';

const Loader = Loading(() => null);

class AccountInfo extends Component {
  render() {
    const {
      userAddress,
      userBalance,
      selectProvider,
      currentProvider,
      privateKey,
      openPrivateKeyModal,
      openGasPriceModal,
      providerLoading,
      translate
    } = this.props;
    return (
      <AccountInfoWrapper id="account-info">
        <MenuToggler>
          {
            ({ isOpen, toggle, addDisable }) => (
              <Fragment>
                <Info onClick={toggle}>{cropAddress(userAddress)}</Info>
                {isOpen && (
                  <AccountInfoMenu>
                    <FullAddress innerRef={addDisable}>{userAddress}</FullAddress>
                    {currentProvider !== METAMASK && <MenuItem onClick={() => selectProvider({ provider: METAMASK })}>{translate("USE_METAMASK")}</MenuItem>}
                    {currentProvider !== LEDGER && <MenuItem onClick={() => selectProvider({ provider: LEDGER })}>{translate("USE_LEDGER")}</MenuItem>}
                    <MenuItem
                      onClick={() => {
                        if (privateKey && currentProvider !== PRIVATE_KEY) selectProvider({ provider: PRIVATE_KEY });
                        else openPrivateKeyModal();
                      }}
                    >
                      {
                        currentProvider === PRIVATE_KEY
                          ? translate("USE_OTHER_PK")
                          : translate("USE_PK")
                      }
                    </MenuItem>
                    <MenuItem onClick={openGasPriceModal}>{translate("GAS_PRICE")}</MenuItem>
                  </AccountInfoMenu>
                )}
              </Fragment>
            )
          }
        </MenuToggler>

        <EtherAmount>
          {
            userAddress === zeroAddress && !providerLoading ?
              translate("CONNECT_WALLET") :
              `${parseFloat(userBalance).toPrecision(10)} ETH`
          }

          {
            currentProvider && !providerLoading ? (
              <Badge color={currentProvider === PRIVATE_KEY ? 'rgb(255,52,52)' : '#1cbb78'}>
                {currentProvider.replace(/_/g, ' ')}
              </Badge>
            ) : (
              <Loader
                fillContainer
                width="25px"
                height="25px"
                isLoading={providerLoading}
              />
            )
          }
        </EtherAmount>
      </AccountInfoWrapper>
    );
  }
}

export default AccountInfo;
