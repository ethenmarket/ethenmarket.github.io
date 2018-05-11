import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Input = styled.input`
  display: none;
  visibility: hidden;
  opacity: 0;
`;

const Checkmark = styled.span`
  position: relative;
  top: -2px;
  @media (max-width: 1440px) {
    top: -4px;
  }
  margin-right: 6px;
  height: 14px;
  width: 15px;
  background-color: inherit;
  border: 1px solid #96a7b8;
  border-radius: 2px;
  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 1.3px;
    width: 4px;
    height: 7px;
    border: 1px solid rgb(19,180,206);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const Label = styled.label`
  display: flex;
  align-content: center;
  text-transform: none;
  position: relative;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  user-select: none;
  color: ${props => props.color};
  &:hover ${Input} ~ ${Checkmark} {
    background-color: inherit;
  }

  & ${Input}:checked ~ ${Checkmark}:after {
    display: block;
  }
`;


const Checkbox = ({ checked, label, onChange, color, id }) => (
  // eslint-disable-next-line
  <Label id={id} checked={checked} color={color}>
    <Input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <Checkmark />
    {label}
  </Label>
);

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  color: PropTypes.string
};

Checkbox.defaultProps = {
  color: 'white',
  id: null
};

export default Checkbox;