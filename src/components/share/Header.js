import styled from 'styled-components';
import { withPadding } from '../../styles';

export default styled.h1`
  height: ${props => props.height || '42px'};
  background-color: ${props => props.theme.bg1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-transform: uppercase;
  font-size: 0.9rem;
  ${withPadding()}
`;
