import React from 'react';
import styled, { keyframes } from 'styled-components';

import Button from './Button';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoaderWrap = styled.div`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};
  position: relative;
  & svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.fillContainer ? '100%' : '80px'};
    height: ${props => props.fillContainer ? '100%' : '80px'};
  }
  & svg circle {
    transform-origin: center;
    stroke-dasharray: 150,200;
    stroke-dashoffset: -30;
    stroke-linecap: round;
    animation: ${rotate360} 2s linear infinite;
  }
`;

const Error = styled.div`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.h3`
  display: flex;
  align-items: center;
`;

const CustomButton = Button.extend`
  margin-top: 10px;
`;

export default Component => ({ isLoading, error, requestData, ...props }) => {

  if (isLoading) {
    return (
      <LoaderWrap fillContainer={props.fillContainer} height={props.height} width={props.width}>
        <svg className="circular-loader" viewBox="0 0 100 100" >
          <circle className="loader-path" cx="50" cy="50" r="30" fill="none" stroke="#13B4CE" strokeWidth="6" />
        </svg>
      </LoaderWrap>
    );
  }
  else if (error) {
    return (
      <Error height={props.height}>
        <ErrorMessage>{props.errorMessage || 'Sorry, there was a problem during loading'}</ErrorMessage>
        {requestData ? <CustomButton onClick={requestData}>Try again</CustomButton> : null}
      </Error>
    );
  }

  return <Component {...props} />;
};