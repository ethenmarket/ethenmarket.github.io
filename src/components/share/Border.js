import styled from 'styled-components';

export default styled.div`
  border-left: ${props => props.left ? '3px solid #566472' : ''};
  border-right: ${props => props.right ? '3px solid #566472' : ''};
  border-bottom: ${props => props.bottom ? '3px solid #566472' : ''};
  border-top: ${props => props.top ? '3px solid #566472' : ''};
  height: 100%;
  box-sizing: border-box;
  position: relative;
`;
