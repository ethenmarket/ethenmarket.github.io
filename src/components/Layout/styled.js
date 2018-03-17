// import React from 'react';
import styled from 'styled-components';

const Layout = styled.div`
    display: grid;
    height: 100%;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: minmax(max-content, max-content) minmax(300px, auto);
    grid-template-areas:
        "balance balance balance balance"
        "balance balance balance balance";
`;

export const Block = styled.div`
    grid-area: ${({ type }) => type};
    height: 100%;
    /* padding: 10px; */
    box-sizing: border-box;
`;
export default Layout;