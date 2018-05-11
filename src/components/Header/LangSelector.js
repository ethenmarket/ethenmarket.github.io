import React from "react";
import { MenuToggler } from '../share';

import {
  Lang,
  LangWrapper,
  Option,
  CurrentLanguage
} from "./styled";

const LangSelector = ({ languages, selectLanguage }) => (
  <MenuToggler>
    {
      ({ isOpen, toggle }) => (
        <LangWrapper active={isOpen} onClick={toggle}>
          <CurrentLanguage >{languages.find(l => l.active).name}</CurrentLanguage>
          {
            isOpen && (
              <Lang active={isOpen} id="lang-selctor">
                {
                  languages.map(lang => (
                    <Option onClick={() => selectLanguage({ language: lang.code })} id={lang.code}>{lang.name}</Option>
                  ))
                }
              </Lang>
            )
          }
        </LangWrapper>
      )
    }
  </MenuToggler>
);

export default LangSelector;