declare namespace FactoryPlugin {
  export type Style = {
    state: "cached" | "updated" | "loading";
    filename: string;
    reference: string;
    classes: string;
    css: string;
  };
}