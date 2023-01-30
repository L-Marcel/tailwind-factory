import { isIntrinsicElement } from "../../../src/utils/isIntrinsicElement";
describe("[Utils] IsIntrinsicElement", () => {
  it("Should be able to detect if is an intrinsic element", () => {
    const example = "div";
    const anotherExample = "text-red-500";

    let isIntrinsic = isIntrinsicElement(example);
    expect(isIntrinsic).toEqual(true);

    isIntrinsic = isIntrinsicElement(anotherExample);
    expect(isIntrinsic).toEqual(false);
  });
});
