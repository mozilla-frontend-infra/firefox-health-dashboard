import React from "react";
import renderer from "react-test-renderer";
import JsTeam from "../../src/views/JsTeam";

it("renders correctly", () => {
  const tree = renderer.create(<JsTeam />).toJSON();

  expect(tree).toMatchSnapshot();
});
