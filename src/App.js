import React from "react";
import Provider from "./Provider";
import Consumer from "./Consumer";

const Test = () => {
  return (
    <Provider
      messages={{
        "en-US": {
          translation: { foo: "bar" }
        }
      }}
    >
      <Consumer text="foo" />
    </Provider>
  );
};

export default Test;
