import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Input = styled.input.attrs({
  type: 'checkbox'
})`
  display: none;
`;


const Slider = styled.span`
  position: relative;
  top: -2px;
  display: inline-block;
  cursor: pointer;
  width: 30px;
  height: 18px;
  margin: 0 6px;
  background-color: #ccc;
  transition: .4s;
  border-radius: 36px;
  &::before {
    border-radius: 50%;
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: rgb(19,180,206);
    transition: .4s;
  }
`;

const Label = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  & ${Input}:focus + ${Slider} {
    box-shadow: 0 0 1px #2196F3;
  }
  & ${Input}:checked + ${Slider}::before{
    transform: translateX(12px);
  }
`;

const Text = styled.div`
  color: ${props => props.active ? 'rgb(19,180,206)' : 'rgb(97,118,139)'};
`;

class Toggle extends Component {
  render() {
    const { leftText, rightText, position, onChange, style } = this.props;
    const checked = position === 'right';
    return (
      <Label style={style}>
        <Text active={!checked}>{leftText}</Text>
        <Input checked={checked} onChange={(e) => onChange(e.target.checked ? 'right' : 'left')} />
        <Slider />
        <Text active={checked}>{rightText}</Text>
      </Label>
    );
  }
}

Toggle.propTypes = {
  leftText: PropTypes.string.isRequired,
  rightText: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['left', 'right']).isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object
};

Toggle.defaultProps = {
  style: {}
};

export default Toggle;