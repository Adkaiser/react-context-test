import React from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import "url-search-params-polyfill";

import { Context } from "./Context";

// Avoid importing babel-polyfill twice
try {
  require("babel-polyfill");
} catch (e) {
  // Assume lib was already imported
}

/**
 * Manages the i18n configuration and dictionaries
 */
class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.updateLocale = this.updateLocale.bind(this);
    const { messages, i18n } = this.props;

    // Use URL param for locale if it exists
    let locale = "en-US";

    // Initialize locale object
    const loadedState = this.initLocale(locale, messages, i18n);
    this.state = loadedState;
  }

  /**
   * Change the currently selected locale for the context.
   * @param {string} locale
   */
  updateLocale(locale) {
    this.setState({
      locale
    });
    // Ensure that i18next knows what is up
    this.state.i18n.changeLanguage(locale);
  }

  /**
   * On component construction, build a i18n configuration object and store it in the state
   * @param {object} locale
   * @param {object} dict
   * @param {object} i18n
   }}
  */
  initLocale(locale, dict, passedI18n) {
    let i18n;
    // If i18n already exists, use it.
    if (passedI18n) {
      i18n = passedI18n;
      // Otherwise initialize a new one.
    } else {
      // Load dictionaries
      const tNamespace1 = "translation";
      // Build configuration object
      i18n = i18next.init({
        lng: locale,
        resources: dict,

        fallbackLng: "en-US",

        ns: [tNamespace1],
        defaultNS: tNamespace1,

        // Change separators from . so we can have namespaced keys
        nsSeparator: ":::",
        keySeparator: "::"
      });
    }
    // Store the configuration object
    return {
      i18n,
      locale,
      i18nLoaded: true,
      updateLocale: this.updateLocale
    };
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

Provider.propTypes = {
  /**
   * The translation dictionary, separated by locale and namespaces
   */
  messages: PropTypes.object,
  /**
   * Accept an i18n configuration object if it is already passed in
   */
  i18n: PropTypes.object
};

Provider.defaultProps = {
  messages: {}
};
export default Provider;
