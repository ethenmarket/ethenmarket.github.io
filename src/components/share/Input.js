import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colorUtil from "color";

import warningIcon from './warning.svg';

const isProcent = width => width[width.length - 1] === '%';

const InputStyled = styled.input`
  height: ${props => props.height || '36px'};
  text-align: ${props => props.align};
  width: ${props => isProcent(props.width) ? '100%' : props.width};

  @media (max-width: 1440px) {
    ${props => props.responsive ? '' : 'max-width: 180px;'}
    height: 30px;
  }

  border-radius: 2px;
  color: black;
  border: ${props => props.border || props.theme.inputBorderColor ? `solid 1px ${props.theme.inputBorderColor}` : 'none'};
  font-family: 'Effra';
  padding: 0 10px 0 ${props => props.labelWidth};
  box-sizing: border-box;
  color: #161f2c;
  font-size: 0.9rem;
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

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelWidth: `${props.desc.length * 10.5 || 10}px`
    };
  }

  componentDidMount() {
    this.initLabelSize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.desc !== this.props.desc) {
      this.initLabelSize();
    }
  }

  initLabelSize = () => {
    const width = window.getComputedStyle(this.label, '::before').getPropertyValue('width');
    const labelWidth = parseFloat(width.slice(0, -2)) + 15;
    this.setState({ labelWidth: `${labelWidth}px` });
  }
  render() {
    const {
      desc,
      placeholder,
      onChange,
      value,
      color,
      validate,
      width,
      style,
      invalide,
      responsive,
      ...props
    } = this.props;

    const { labelWidth } = this.state;

    return (
      <InputWrap
        innerRef={(e) => {this.label = e;}}
        invalide={invalide}
        desc={desc}
        style={style}
        width={width}
      >
        <InputStyled
          labelWidth={labelWidth}
          responsive={responsive}
          desc={desc}
          color={color}
          width={width}
          type="text"
          placeholder={placeholder}
          onChange={e => {
            const inputValue = e && e.target && e.target.value;
            if (validate(inputValue)) {
              if (props.onChangeFullEvent) {
                e.persist();
                onChange(e);
              } else {
                onChange(inputValue);
              }
            };
          }}
          value={value}
          {...props}
        />
      </InputWrap>
    );
  }
}


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
  invalide: PropTypes.bool,
  responsive: PropTypes.bool,
  onChangeFullEvent: PropTypes.bool
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
  invalide: false,
  responsive: false,
  onChangeFullEvent: false
};

export default Input;
