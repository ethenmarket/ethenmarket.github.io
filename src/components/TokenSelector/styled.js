import styled from 'styled-components';

export const Placeholder = styled.span`
  padding-left: 30px;
`;

export const AddTokenButton = styled.button`
  width: 100%;
  height: 40px;
  color: rgb(19,180,206);
  text-transform: uppercase;
  text-align: center;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  background-color: #eaeaea;
  border-top: 1px solid #bec1c5;
`;

export const Value = styled.div`
  text-align: left;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  padding-left: 5px;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ValueWrapper = styled.div`
  height: 23px;
  align-content: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 5px;
  &:hover {
    background-color: white;
  }
  background-color: #eaeaea;
`;

export const TokenTicker = styled.div`
  color: rgb(57,68,79);
  font-weight: ${props => props.stared ? "bold" : "normal"};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: auto;
  max-width: 50%;
  text-align: left;
`;

export const TokenTickerWrapper = styled.button`
  width: 85%;
  box-sizing: border-box;
  background-color: inherit;
  align-content: center;
  cursor: pointer;
  border: none;
  display: flex;
  justify-content: space-between;
`;

export const NotVerified = styled.span`
  color: rgb(150,167,184);
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: -0.5px;
`;