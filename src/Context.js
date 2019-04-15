import React from "react";

export const defaultState = {
  i18n: {},
  locale: "en-US",
  i18nLoaded: false
};

export const Context = React.createContext(defaultState);
