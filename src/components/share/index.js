import Header from "./Header";
import Table from "./Table";
import Checkbox from "./Checkbox";
import Border from "./Border";
import Toggle from "./Toggle";
import Button from "./Button";
import Input from "./Input";
import Loading from "./Loading";
import Star from "./Star";
import Note from "./Note";
import ErrorMessage from './ErrorMessage';

const Arrow = color => `
  content: "";
  border-color: ${color} transparent transparent;
  border-style: solid;
  border-width: 5px 5px 2.5px;
  display: inline-block;
  height: 0;
  width: 0;
  margin-left: 4px;
`;

export {
  Header,
  Table,
  Checkbox,
  Border,
  Toggle,
  Button,
  Arrow,
  Input,
  Loading,
  Star,
  Note,
  ErrorMessage
};
