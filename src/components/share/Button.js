import styled from 'styled-components';
import colorUtil from 'color';

export default styled.button`
  background-color: ${ props => props.color || '#16899b' };
  border: none;
  height: 36px;
  min-width: ${props => (props.width && `${props.width}px`) || 'auto'};
  color: ${props => props.textColor || 'white'};
  text-transform: uppercase;
  font-size: 0.9rem;
  border-radius: 2px;
  cursor: pointer;

  @media (max-width: 1440px) {
    max-width: 180px;
    min-width: ${props => Math.min(180, props.width)}px;
    height: 30px;
    line-height: 30px;
  }

  &:active, &:focus {
    outline: none;
    box-shadow: 0 0 4px ${ ({color = "#16899b"}) => colorUtil(color).alpha(0.7).string() };
  }
`;