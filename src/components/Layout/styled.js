// import React from 'react';
import styled from "styled-components";

const Layout = styled.div`
    display: grid;
    height: 100%;
    min-width: 900px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: max-content;
    grid-template-areas:
        "balance   balance   balance balance"
        "balance balance balance balance";

    @media (max-width: 1100px) {
        grid-template-areas:
        "balance      balance      balance      balance"
        "balance balance balance     balance"
        "balance    balance    balance    balance";
    }

    @media (min-width: 1100px) {
        height: calc(100vh - 53px)
    }
`;

export const Block = styled.div`
  grid-area: ${({ type }) => type};
  height: 100%;
  box-sizing: border-box;
`;
export default Layout;
