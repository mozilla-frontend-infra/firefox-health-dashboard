import React from "react";
import renderer from "react-test-renderer";
import NimbledroidGraph from "../../src/views/NimbledroidGraph";

it("renders correctly", () => {
  const props = {
    site: "test site",
    location: {
      search: "your search"
    }
  };
  const tree = renderer
    .create(<NimbledroidGraph location={props.location} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
