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
  ${props => props.inline && 'display: inline-block;'}
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
  ${props => props.padding && `padding: 0 ${props.padding}px;`}
`;

const ErrorMessage = styled.h3`
  display: flex;
  align-items: center;
  text-align: center;
`;

const CustomButton = Button.extend`
  margin-top: 10px;
`;

const Loading = Component => class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.error
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      this.setState({ error: nextProps.error });
    }
  }

  componentDidCatch(err) {
    this.setState({ error: { message: err.message }});
  }

  render() {
    const { isLoading, requestData, ...props } = this.props;
    const { error } = this.state;
    if (isLoading) {
      return (
        <LoaderWrap inline={props.inline} fillContainer={props.fillContainer} height={props.height} width={props.width}>
          <svg className="circular-loader" viewBox="0 0 100 100" >
            <circle className="loader-path" cx="50" cy="50" r="30" fill="none" stroke="#13B4CE" strokeWidth="6" />
          </svg>
        </LoaderWrap>
      );
    }
    else if (error) {
      const { translate } = props;
      return (
        <Error height={props.height} padding={props.padding}>
          <ErrorMessage>
            {
              error.message ||
              translate(props.errorMessage || 'LOADING_ERROR')
            }
          </ErrorMessage>
          {
            requestData && (
              <CustomButton
                onClick={requestData}
              >
                {
                  translate(props.buttonCaption || 'TRY_AGAIN')
                }
              </CustomButton>
            )
          }
        </Error>
      );
    }

    return <Component {...props} />;
  }
};

export default Loading;


export const Loader = Loading(() => null);