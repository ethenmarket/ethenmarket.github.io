import styled from 'styled-components';

import crossIcon from '../x.svg';

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