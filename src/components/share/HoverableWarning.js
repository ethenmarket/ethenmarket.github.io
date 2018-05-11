import styled from 'styled-components';
import React from 'react';

import warningIcon from './warning_orange.svg';


const WarningBody = styled.div`
  display: none;
  background: rgba(242, 150, 0);
  overflow: hidden;
  text-align: left;
  width: 220px;
  @media (min-width: 1440px) {
    width: 300px;
  }
  padding: 8px;
  box-sizing: border-box;
  border-radius: 2px;
  color: white;
  font-size: .9rem;
  text-shadow: 1px 1px 7px rgba(0, 60, 90, .37);
  font-family: Effra
`;


const WarningStyled = styled.span`
  z-index: 10;
  cursor: default;
  color: rgba(242, 150, 0);
  display: inline-flex;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  border-radius: 2px;
  font-family: "Warning";
  margin: 2px 8px;
  height: 25px;
  width: 32px;
  font-size: 20px;
  background: url(${warningIcon}) no-repeat center;
  @media (min-width: 1440px) {
    font-size: 26px;
    width: 37px;
    height: 30px;
    margin: 3px 8px;
  }
  text-align: center;
  padding: 5px 5px;
  &:hover ${WarningBody} {
    ${props => props.text &&
    `
    position: absolute;
    display: block;
    top: -46%;
    left: 40px;
    @media (min-width: 1440px) {
      left: 46px;
    }
    `}
    }
  }
`;


const HoverableWarning = ({ text, pos }) => (
  <WarningStyled
    text={text}
    pos={pos}
  >
    {text ? <WarningBody>{text}</WarningBody> : null}
  </WarningStyled>
);

export default HoverableWarning;