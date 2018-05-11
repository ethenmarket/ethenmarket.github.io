import styled from 'styled-components';

import crossIcon from '../x.svg';
import rightArrowIcon from './right-arrow.png';

export const Header = styled.header`
  background-color: ${props => props.color || '#d8dce0'};
  font-size: 1rem;
  text-transform: uppercase;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-content: center;
`;

export const CloseButton = styled.button`
  border: none;
  background-color: inherit;
  cursor: pointer;
  height: 15px;
  width: 15px;
  background: url(${crossIcon}) center center no-repeat;
  background-size: contain;
`;

export const ModalContent = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 35px 20px 10px 20px;
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px 20px;
  & button {
    margin-left: 10px;
  }
`;

export const InputLabel = styled.label`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Desc = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
`;

export const PropName = styled.div`
  width: 15%;
  color: #161f2c;
  font-weight: bold;
`;

export const PropValue = styled.div`
  width: 70%;
`;

export const EthToTokenWrap = styled.div`
  padding: 15px 20px;
  background-color: #d8dce0;
  border-top: 1px solid rgb(97,118,139);
`;

export const EthToToken = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: max-content;
`;

export const ArrowRight = styled.img.attrs({ src: rightArrowIcon })`
  padding: 0 30px;
  height: 20px;
  position: relative;
  top: -2px; /* hack. otherwise can't center */
`;

export const DarkNumber = styled.span`
  color: #161f2c;
  margin-right: 5px;
`;

export const Amount = styled.div`
  display: flex;
  align-items: center;
`;

export const OrdersWrap = styled.div`
  background-color: #F5F5F5;
  padding: 0 20px;
`;

export const Attention = styled.div`
  color: rgb(255,52,52);
  font-size: 1.1rem;
  padding-top: 20px;
  /* font-weight: bold; */
`;

export const Table = styled.div`
  padding: 20px 0;
`;

export const Rows = styled.div`
  display: grid;
  text-align: right;
  grid-template-columns: 25% 40% 1fr;
  padding: 5px 0;
`;

export const Col = styled.div`
`;

export const Summary = styled.div`
  background-color: white;
  padding: 20px;
`;

export const SummaryRow = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
`;

export const SummaryRowName = styled.div`
  width: 25%;
  text-align: right;
`;

export const SummaryRowValue = styled.div`
  width: 75%;
  padding-right: 35%;
  box-sizing: border-box;
  text-align: right;
`;