import React from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";

import { Context } from "./Context";
import Provider from "./Provider";

/**
 * Returns a localized string in for the active locale
 */
export class Consumer extends React.Component {
  /**
   * Build a set of parameters for translation
   * @param {number} count
   * @param {string} context
   * @returns {object}
   */
  makeTranslateProps(count, context) {
    // Set default translation options
    let translateProps = { skipInterpolation: true };
    // Count (pluralization)
    if (count || count === 0) {
      translateProps.count = count;
    }
    // Context
    if (context) {
      translateProps.context = context;
    }
    return translateProps;
  }

  /**
   * Fetch a localized string from the appropriate dictionary with the given key
   * @param {string} text
   * @param {object} translateProps
   * @param {object} i18n
   * @returns {string}
   */
  getText(text, translateProps, i18n) {
    // Return localized string if it exists in the dictionary
    return i18n.t(text, translateProps);
  }

  interpolate(text, values, i18n) {
    // Get the translated string
    let output = ReactDOMServer.renderToString(text);

    // Replace placeholders
    for (const placeholder in values) {
      // Render replacement
      const value = ReactDOMServer.renderToString(
        <Provider i18n={i18n}>{values[placeholder]}</Provider>
      );
      // Build regex
      const escapedPlaceholder = placeholder.replace(
        /([.*+?^=!:${}()|[\]/\\])/g,
        "\\$1"
      );
      const regex = new RegExp(`{{${escapedPlaceholder}}}`, "g");
      // Run replacement
      output = output.replace(regex, value);
    }
    // TODO: Find more comprehensive way of converting these
    // Unescape apostrophe
    output = output.replace(/&#x27;/g, "'");
    // Unescape ampersand
    output = output.replace(/&amp;/g, "&");
    // Unescape quotations
    output = output.replace(/&quot;/g, '"');
    // Unescape HTML chars
    output = output.replace(/&lt;/g, "<");
    output = output.replace(/&gt;/g, ">");
    if (
      output.includes("<b>") ||
      output.includes("<span") ||
      output.includes("</a>")
    ) {
      return <span dangerouslySetInnerHTML={{ __html: output }} />;
    }
    return output;
  }

  render() {
    const { i18n, i18nLoaded } = this.context;
    const { text, count, values, context } = this.props;
    // Hide values until i18n dict is ready
    if (!i18nLoaded) {
      return this.props.text;
    }
    const translateProps = this.makeTranslateProps(count, context);
    // Localize string
    const translateText = this.getText(text, translateProps, i18n);
    return this.interpolate(translateText, values, i18n);
  }
}
Consumer.contextType = Context;

/**
 * Replace placeholder strings with their intended values
 * This function is designed to ensure recursive rendering, in cases
 * where placeholder values are other components.
 * @param {string} text
 * @param {object} values
 * @param {object} i18n
 * @returns {string}
 */

Consumer.propTypes = {
  /***
   * The key of the message to look up
   */
  text: PropTypes.string.isRequired,
  /**
   * The quantity of the subject, for pluralization
   */
  count: PropTypes.number,
  /**
   * A set of placeholders to be injected into the output string
   */
  values: PropTypes.object,
  /**
   * A context to disambiguate strings by
   */
  context: PropTypes.string,
  i18nContext: PropTypes.object
};

export default Consumer;
