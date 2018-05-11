import React from "react";
import { MenuToggler } from "../share";
import { RightMenuButton, RightMenuItem, RightMenuItemsWrap, RightMenuWrap } from "./styled";

const BurgerMenu = ({
  showUserGuide,
  translate,
  currentLanguage,
  toogleTheme,
  currentTheme
}) => (
  <MenuToggler>
    {({ isOpen, toggle }) => (
      <RightMenuWrap>
        <RightMenuButton active={isOpen} onClick={toggle} />
        {isOpen && (
          <RightMenuItemsWrap active={isOpen}>
            <RightMenuItem
              onClick={() => toogleTheme()}
              icon={currentTheme}
            >
              {currentTheme === "dark" ? translate("LIGHT_THEME") : translate("DARK_THEME")}
            </RightMenuItem>
            <RightMenuItem icon="tutorial" onClick={() => showUserGuide()}>
              {translate("USER_GUIDE")}
            </RightMenuItem>
            <RightMenuItem icon="question">
              <a href={`/faq.${currentLanguage.code}.html`}>
                {translate("FAQ")}
              </a>
            </RightMenuItem>
          </RightMenuItemsWrap>
        )}
      </RightMenuWrap>
    )}
  </MenuToggler>
);

export default BurgerMenu;
