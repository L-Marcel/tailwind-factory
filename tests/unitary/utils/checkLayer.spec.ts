import { checkLayer } from "../../../src/utils/checkLayer";
describe("[Utils] CheckLayer", () => {
  it("Should be able to detect if is inside a block", () => {
    let isInsideBlock = false;
    let layer = 0;

    const classesExample = [
      "text-red-500",
      "h2",
      "{",
      "text-blue-200",
      "h3",
      "{",
      "text-blue-500",
      "}",
      "}",
    ];

    const block = [];
    for (const i in classesExample) {
      const cur = classesExample[i];
      const [isStillInsideBlock, currentLayer] = checkLayer(isInsideBlock, layer, cur);
      isInsideBlock = isStillInsideBlock;
      layer = currentLayer;

      if (isInsideBlock) {
        block.push(cur);
      }
    }

    block.shift();
    expect(block).toEqual(["text-blue-200", "h3", "{", "text-blue-500", "}"]);
  });
});
