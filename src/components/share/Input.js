import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colorUtil from "color";

import warningIcon from './warning.svg';

const isProcent = width => width[width.length - 1] === '%';

const InputStyled = styled.input`
  height: 36px;
  text-align: ${props => props.align};
  width: ${props => isProcent(props.width) ? '100%' : props.width};
  border-radius: 2px;
  color: black;
  border: ${props => props.border || 'none'};
  font-family: 'Effra';
  padding: 0 10px 0 ${props => `${props.desc.length * 10.2 || 10}px`};
  box-sizing: border-box;
  color: #161f2c;
  background-color: ${props => props.bgColor || 'white'};
  &:focus ${props => (props.activeStyle ? ", &:active" : "")} {
    outline: none;
    box-shadow: 0 0 4px 0.5px black;
    box-shadow: 0 0 3px 0.5px ${props => props.color};
    background-color: ${({ color }) =>
    colorUtil(color)
      .lightness(94)
      .saturationl(62)
      .string()};
  }
`;

const InputWrap = styled.label`
  position: relative;
  width: ${props => isProcent(props.width) ? props.width : 'auto'};
  display: block;
  &::before {
    content: ${props => `"${props.desc}"`};
    display: flex;
    font-size: 0.8rem;
    color: rgb(97, 118, 139);
    position: absolute;
    left: 10px;
    top: 2px;
    bottom: 0;
    align-items: center;

    ${props => props.invalide ? `
      content: "";
      background: url(${warningIcon}) no-repeat center;
      background-size: contain;
      top: 0;
      ${props.desc ? '' : `right: 10px; left: auto;`}
      width: 20px;
    ` : ''}
  }
`;

const Input = ({
  desc,
  placeholder,
  onChange,
  value,
  color,
  validate,
  width,
  style,
  invalide,
  ...props
}) => (
  <InputWrap
    invalide={invalide}
    desc={desc}
    style={style}
    width={width}
  >
    <InputStyled
      desc={desc}
      color={color}
      width={width}
      type="text"
      placeholder={placeholder}
      onChange={e => {
        const inputValue = e && e.target && e.target.value;
        if (validate(inputValue)) onChange(inputValue);
      }}
      value={value}
      {...props}
    />
  </InputWrap>
);

Input.propTypes = {
  desc: PropTypes.string,
  placeholder: PropTypes.string,
  color: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
  validate: PropTypes.func,
  width: PropTypes.string,
  style: PropTypes.object,
  align: PropTypes.string,
  invalide: PropTypes.bool
};

Input.defaultProps = {
  onChange: console.log,
  placeholder: "",
  desc: "",
  color: "#16899b",
  validate: () => true,
  width: '200px',
  style: {},
  align: 'right',
  invalide: false
};

export default Input;
