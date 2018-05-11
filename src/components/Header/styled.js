import colorUtil from 'color';
import React from 'react';
import styled from 'styled-components';
import { withPadding } from '../../styles';
import { Arrow } from '../share';
import infoIcon from './info.png';
import laptopIcon from './laptop.svg';
import moonIcon from './moon.png';
import questionMarkIcon from './question.svg';
import sunIcon from './sun.png';
import userIcon from './user.png';


export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  min-width: 880px;
  background-color: ${props => props.theme.bg2};
  border-bottom: 3px solid ${props => props.theme.borderColor};
  ${withPadding('left')}
`;

export const Logo = styled.a`
  padding: 0;
  letter-spacing: 3px;
  border: none;
  font-family: "Logo";
  width: 90px;
  font-size: 23px;
  color: ${props => props.theme.mainFontColor};
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
  background-color: ${props => props.theme.bg2};
  padding: 15px 0;
  border: 1px solid ${props => props.theme.borderColor};
  z-index: 21;
  font-weight: 400;
`;

export const MenuItem = styled.div`
  cursor: pointer;
  font-weight: 400;
  padding: 15px 15px 0 15px;
  color: ${props => props.theme.secondaryFontColor};
  &:hover {
    color: ${props => props.theme.mainFontColor};
  }
`;

export const FullAddress = styled.div`
  border-bottom: 2px solid ${props => props.theme.borderColor};
  padding: 0 20px 10px 20px;
`;

export const Info = styled.div`
  user-select: none;
  font-family: "Effra";
  height: 100%;
  background-color: ${props => props.theme.bg1};
  padding: 0 7px;
  display: flex;
  align-items: center;
  color: ${props => props.theme.primaryFontColor};
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
  background-color: ${props => colorUtil(props.theme.bg2).darken(0.1).toString()};
  padding: 0 7px;
  color: ${props => props.theme.mainFontColor};
  display: flex;
  align-items: center;
`;

export const RightSide = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

export const TokensSelectorWrap = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const TokenInfoButton = styled.button`
  padding: 0;
  margin-left: 10px;
  border: none;
  background-color: inherit;
  background: url(${infoIcon}) no-repeat;
  height: 22px;
  width: 22px;
  background-size: contain;
  cursor: pointer;
`;

export const TokenSelectorLabel = styled.div`
  color: ${props => props.theme.secondaryFontColor};
  font-size: 1rem;
  margin-right: 15px;
`;

export const HeaderButton = styled.button`
  background-color: inherit;
  border: none;
  height: 100%;
  color: ${props => props.theme.mainFontColor};
  font-weight: bold;
  margin-right: 20px;
  padding: 0;
  font-size: 0.85rem;
  cursor: pointer;
`;

export const DisclamerButton = HeaderButton.extend`
  margin-right: 10px;
`;

export const CurrentLanguage = HeaderButton.extend`
  margin: 0;
  &:active, &:focus {
    outline: none;
  }
`;

export const RightMenuButtonWrap = styled.button`
  position: relative;
  background-color: inherit;
  box-sizing: content-box;
  font-size: 1rem;
  border: none;
  height: 100%;
  width: 30px;
  color: ${props => props.theme.mainFontColor};
  background-size: 35px;
  background-position: center;
  padding: 0 15px;
  cursor: pointer;
  background-color: ${props => props.active ? props.theme.bg1 : 'inherit'};
  outline: none;
  &:hover {
    background-color: ${props => props.theme.bg1};
  }

  & svg #burger {
    fill: ${props => props.theme.mainFontColor};
  }
`;

export const RightMenuButton = ({ active, onClick }) => (
  <RightMenuButtonWrap active={active} onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.339 344.339"><path id="burger" fill={active ? '#161f2c' : "#FFF"} d="M0 46.06h344.339v29.52H0zm0 110.446h344.339v29.52H0zm0 112.242h344.339v29.531H0z" /></svg>
  </RightMenuButtonWrap>
);

export const RightMenuWrap = styled.div`
  height: 100%;
  position: relative;
`;

export const RightMenuItemsWrap = styled.div`
  ${
  props => props.active &&
    `
    border-left: 1px solid ${props.theme.borderColor};
    border-top: 1px solid ${props.theme.borderColor};
    border-bottom: 1px solid ${props.theme.borderColor};
    `
}
  position: absolute;
  z-index: 100;
  background-color: ${props => props.theme.bg1};
  top: 50px;
  white-space: nowrap;
  right: 0;
`;

const icons = {
  question: questionMarkIcon,
  tutorial: laptopIcon,
  dark: sunIcon,
  light: moonIcon
};

export const RightMenuItem = styled.div`
  &::before {
    content: '';
    display: inline-block;
    width: 15px;
    height: 40px;
    position: absolute;
    left: 7.5px;
    background: url(${props => icons[props.icon] || ''}) no-repeat center;
    background-size: contain;
  }

  line-height: 40px;
  box-sizing: border-box;
  background-color: inherit;
  border: none;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  padding: 0 10px 0 30px;
  width: 100%;
  font-size: 0.85rem;
  cursor: pointer;
  color: ${props => props.theme.secondaryFontColor};
  & > * {
    display: block;
    height: 100%;
    width: 100%;
    color: ${props => props.theme.secondaryFontColor};
  }

  &:hover {
    color: ${props => props.theme.mainFontColor};
  }

  &:hover > * {
    color: ${props => props.theme.mainFontColor};
  }
`;

export const VerticalHR = styled.div`
  height: 100%;
  width: 0px;
  border-left: 1px solid ${props => colorUtil(props.theme.bg1).alpha(0.7).toString()};
  border-right: 1px solid ${props => colorUtil(props.theme.secondaryFontColor).alpha(0.7).toString()};
`;

export const Lang = styled.div`
  position: absolute;
  z-index: 10;
  left: 0;
  text-transform: uppercase;
  font-size: 0.85rem;
  background-color: inherit;
  height: 100%;
  width: 100%;
  cursor: pointer;
`;

export const LangWrapper = styled.div`
  z-index: 11;
  cursor: pointer;
  height: 100%;
  width: 62px;
  text-align: center;
  position: relative;
  padding-right: 20px;
  padding-left: 10px;
  background-color: ${props => props.active ? props.theme.bg1 : 'inherit'};
  &::after {
    ${props => Arrow(props.theme.borderColorDark)};
    position: absolute;
    top: calc(50% - 2.5px);
    right: 7.5px;
  }
`;

export const Option = styled.div`
  background-color: ${props => props.theme.bg1};
  color: ${props => props.theme.secondaryFontColor};
  box-sizing: border-box;
  height: 30px;
  line-height: 30px;
  position: relative;
  padding: 0 10px;
  width: calc(100% + 1px);
  ${props => `border-left: 1px solid ${props.theme.borderColor}`};
  ${props => `border-right: 1px solid ${props.theme.borderColor}`};

  &:first-child {
    ${props => `border-top: 1px solid ${props.theme.borderColor}`};
  }

  &:last-child {
    ${props => `border-bottom: 1px solid ${props.theme.borderColor}`};
  }
  &:hover {
    color: ${props => props.theme.mainFontColor};
  }
`;

export const Badge = styled.span`
  background-color: ${props => props.color};
  padding: 2px 3px;
  color: white;
  border-radius: 2px;
  margin-left: 5px;
  user-select: none;
`;