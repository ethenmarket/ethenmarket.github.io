import styled from 'styled-components';
import colorUtil from "color";

const Arrow = (color, down = true) => `
  content: "";
  border-color: ${down ? `${color} transparent transparent` : `transparent transparent ${color}`};
  border-style: solid;
  border-width: ${down ? `5px 5px 2.5px` : `2.5px 5px 5px`};
  display: inline-block;
  ${!down && 'transform: translateY(-2.5px)'};
  height: 0;
  width: 0;
  margin-left: 4px;
`;


export const TableBody = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: 100%;
`;

export const TablePreHeader = TableBody.extend`
  height: auto;
`;

export const TableHeader = styled.div`
  padding: 5px 20px;
  box-sizing: border-box;
  width: 100%;
  display: grid;
  justify-content: right;
  grid-template-columns: ${props => props.widths.map(w => w || '1fr').join(' ')};
`;


export const TableText = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: ${props => props.align === 'left' ? 'flex-start' : 'flex-end'};
  width: 100%;
`;

export const HeadCell = styled.div`
  color: ${props => props.theme.borderColorDark};
  border-bottom: 1px solid;
  ${props => props.preHeader && 'padding-top: 5px;border-top: 1px solid;'}
  padding-bottom: 5px;
  font-size: .9rem;
  user-select: none;
  & ${TableText}::after {
    ${props => props.text && Arrow(props.sorted ? props.theme.mainFontColor : props.theme.borderColorDark, props.sorted ? props.order : true)};
    cursor: pointer;
  }
`;

export const Cell = styled.span`
  font-size: 1rem;
  font-family: "Effra";
  letter-spacing: 1px;
  height: 100%;
  display: flex;
  align-items: center;
  color: ${props => props.color};
`;

export const Row = styled.div`
  padding: 0 20px;
  box-sizing: border-box;
  ${props => props.odd
    ? `&:nth-child(odd) {background-color: ${colorUtil(props.theme.bg1).darken(0.1).toString()};}`
    : ''}
  ${props => props.grouped ?
    `
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
      padding-top: 5px;
      padding-bottom: 2px;
      text-align: right;
    ` :
    `
      display: grid;
      grid-template-columns: ${props.widths.map(w => w || '1fr').join(' ')};
      grid-auto-rows: 30px;
      align-items: center;
    `}
`;