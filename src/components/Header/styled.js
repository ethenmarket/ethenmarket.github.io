import styled from 'styled-components';
import userIcon from './user.png';
import menuIcon from './menu-button.svg';

import { Arrow } from '../share';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 20px;
  height: 50px;
  background-color: #2e3e4d;
  border-bottom: 3px solid #566472;
`;

export const Logo = styled.span`
  color: rgb(163,177,196);
  font-size: 1.1rem;
  letter-spacing: 1px;
  font-weight: bold;
  user-select: none;
`;

export const AccountInfoWrapper = styled.div`
  height: 30px;
  border-radius: 2px;
  border: none;
  display: flex;
  align-items: center;
  font-weight: 500;
  position: relative;
`;

export const AccountInfoMenu = styled.div`
  position: absolute;
  top: 30px;
  background-color: #2b3945;
  padding: 15px 0;
  color: #fff;
  border: 1px solid #3a4656;
  z-index: 21;
`;

export const MenuItem = styled.div`
  cursor: pointer;
  padding: 15px 15px 0 15px;
  &:hover {
    color: #96a7b8;
  }
`;

export const FullAddress = styled.div`
  border-bottom: 2px solid #96a7b8;
  padding: 0 20px 10px 20px;
`;

export const Info = styled.div`
  font-family: "Effra";
  height: 100%;
  background-color: #232d37;
  padding: 0 7px;
  display: flex;
  align-items: center;
  color: rgb(19,180,206);
  cursor: pointer;
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(${userIcon}) no-repeat;
    background-size: contain;
    margin-right: 4px;
  }

  &::after {
    ${Arrow('rgb(19,180,206)')}
  }
`;

export const EtherAmount = styled.div`
  font-family: "Effra";
  height: 100%;
  background-color: #2b3945;
  padding: 0 7px;
  color: rgb(150,167,184);
  display: flex;
  align-items: center;
`;

export const RightSide = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px 0;
`;

export const TokensSelectorWrap = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const TokenSelectorLabel = styled.div`
  color: rgb(150,167,184);
  font-size: 1rem;
  margin-right: 15px;
`;

export const HeaderButton = styled.button`
  background-color: inherit;
  border: none;
  height: 100%;
  color: white;
  font-weight: bold;
  padding: 0 10px 0;
`;

export const MenuButton = styled.button`
  background-color: inherit;
  box-sizing: content-box;
  border: none;
  background: url(${menuIcon}) no-repeat;
  height: 100%;
  width: 30px;
  color: white;
  background-size: 30px;
  background-position: center;
  padding: 0 20px;
  color: #000;
`;

export const Lang = styled.select`
  color: rgb(247,247,247);
  text-transform: uppercase;
  font-size: 0.85rem;
  background-color: inherit;
  border: none;
  height: 100%;
  padding: 0 30px 0 15px;
  appearance:none;
  width: 100%;
  cursor: pointer;
`;

export const LangWrapper = styled.label`
  cursor: pointer;
  height: 100%;
  border-right: 2px solid rgba(96,117,139, 0.2);
  border-left: 2px solid rgba(96,117,139, 0.2);
  position: relative;
  &::after {
    ${Arrow('#768393')};
    position: absolute;
    top: calc(50% - 2.5px);
    right: 15px;
  }
`;

export const Option = styled.option`
  background-color: #2e3e4d;
  color: rgb(247,247,247);
  height: 20px;
`;

export const Badge = styled.span`
  background-color: ${props => props.color};
  padding: 2px 3px;
  color: white;
  border-radius: 2px;
  margin-left: 5px;
  user-select: none;
`;