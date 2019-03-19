import React from "react";
import renderer from "react-test-renderer";
import TargetStatus from "../../src/quantum/target-status";

it("renders correctly", () => {
  const tree = renderer.create(<TargetStatus notes={{ status: 1 }} />).toJSON();

  expect(tree).toMatchSnapshot();
});
