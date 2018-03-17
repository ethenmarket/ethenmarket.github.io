import styled from 'styled-components';

const Note = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 22;
  text-align: center;
  pointer-events: none;
  background-color: rgba(22,31,44, 0.95);
  border: 1px solid rgb(97,118,139);
  box-shadow: 0 0 3px rgb(97,118,139);
  user-select: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 0.9rem;
  transition: opacity ease 0.8s;
  opacity: ${props => props.show ? 1 : 0};
  /* color: rgb(97,118,139); */
`;

export default Note;