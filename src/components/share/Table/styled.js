import styled from 'styled-components';

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
  text-align: right;
  justify-content: flex-end;
  width: 100%;
`;

export const HeadCell = styled.div`
  color: rgb(97,118,139);
  border-bottom: 1px solid;
  padding-bottom: 5px;
  font-size: .9rem;
  user-select: none;
  & ${TableText}::after {
    ${props => props.text && Arrow(props.sorted ? 'white' : 'rgb(97,118,139)', props.sorted ? props.order : true)};
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
  /* min-width: min-content; */
  color: ${props => props.color};
`;

export const Row = styled.div`
  ${props => props.odd
    ? '&:nth-child(odd) {background-color: rgba(12,18,26,0.6313725490196078);}'
    : ''}

  display: grid;
  grid-template-columns: ${props => props.widths.map(w => w || '1fr').join(' ')};
  grid-auto-rows: 30px;
  align-items: center;
  padding: 0 20px;
`;