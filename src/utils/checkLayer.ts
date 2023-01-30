export function checkLayer(insideBlock: boolean, layer: number, key: string) {
  if (!insideBlock && key === "{") {
    insideBlock = true;
    layer = 1;
  } else if (insideBlock && key === "}" && layer === 1) {
    insideBlock = false;
    layer = 0;
  } else if (key === "{") {
    layer++;
  } else if (key === "}") {
    layer--;
  }

  return [insideBlock, layer] as [boolean, number];
}
