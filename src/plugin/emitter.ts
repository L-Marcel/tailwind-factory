import { EventEmitter } from "node:events";
import { generateId } from "../utils/generateId";
import { StyleController } from "./controller";
import { DeepStyleClass, StyleFactory } from "./factory";

export type ProcessDataParams = {
  filename: string;
  reference: string;
  classes: string;
  outputStylePath?: string;
};

export type ProcessDeepClassesParams = {
  filename: string;
  reference: string;
  deepClass: DeepStyleClass;
  outputStylePath?: string;
  inputStylePath?: string;
  configPath?: string;
};

type RegisterStyleResponse = {
  state: FactoryPlugin.Style["state"];
  reference: string;
};

type CreateStyleParams = {
  filename: string;
  styles: FactoryPlugin.Style[];
  path: string;
};

type Event = {
  process(this: StyleEmitter, data: ProcessDeepClassesParams): void;
  create(this: StyleEmitter, data: CreateStyleParams): void;
};

export class StyleEmitter extends EventEmitter {
  private _on = super.on;
  private _emit = super.emit;

  on<U extends keyof Event>(eventName: U, listener: Event[U]) {
    return this._on(eventName, listener);
  }

  emit<U extends keyof Event>(eventName: U, options: Parameters<Event[U]>[0]) {
    return this._emit(eventName, options);
  }

  private loadedFiles: string[] = [];
  private files: string[] = [];
  private cachedStyles: FactoryPlugin.Style[] = [];
  private styles: FactoryPlugin.Style[] = [];

  private reset(filename?: string, error = false) {
    if (filename) {
      this.styles = this.styles.filter((style) => {
        return style.filename !== filename;
      });

      this.files = this.files.filter((file) => {
        return file !== filename;
      });

      this.loadedFiles = this.loadedFiles.filter((loadedFile) => {
        return loadedFile !== filename;
      });

      this.cachedStyles = this.cachedStyles.filter((cachedStyle) => {
        return cachedStyle.filename !== filename || !error;
      });

      return;
    }

    this.styles = [];
    this.files = [];
    this.loadedFiles = [];
    this.cachedStyles = [];
  }

  getCache(filename?: string) {
    try {
      const cachedStyles = StyleController.getFormattedCache();

      if (Array.isArray(cachedStyles)) {
        this.reset(filename);
        this.cachedStyles = cachedStyles.map((cachedStyle) => {
          return {
            ...cachedStyle,
            state: "cached",
          };
        });
      }
    } catch (_) {
      this.reset(filename, true);
    }
  }

  constructor() {
    super();
    this.getCache();
  }

  private getRegisteredStyleUsingCache(filename: string, classes: string) {
    const styles = this.styles.find((style) => {
      return style.classes === classes;
    });

    if (!styles) {
      return this.cachedStyles.find((style) => {
        return style.classes === classes && style.filename == filename;
      });
    }

    return styles;
  }

  private getStyleIndexByReference(filename: string, reference: string) {
    return this.styles.findIndex((style) => {
      return style.filename === filename && style.reference === reference;
    });
  }

  private getStyleByFile(filename: string) {
    return this.styles.filter((style) => {
      return style.filename === filename;
    });
  }

  private registerStyle(
    { reference, classes, filename }: Omit<FactoryPlugin.Style, "css" | "state">,
    css = "",
    state: "loading" | "updated" = "loading"
  ) {
    this.styles.push({
      reference,
      classes,
      filename,
      css,
      state,
    });
  }

  updateStyle(
    { reference, filename, css }: Omit<FactoryPlugin.Style, "classes" | "state">,
    outputStylePath?: string
  ) {
    const index = this.getStyleIndexByReference(filename, reference);

    if (index !== -1) {
      StyleController.keepCacheCycle(filename);

      this.styles[index] = {
        ...this.styles[index],
        css,
        state: "updated",
      };

      this.checkStyles(outputStylePath);
    }
  }

  private getFile(filename: string) {
    return this.files.find((file) => {
      return file === filename;
    });
  }

  setLoadedFile(filename: string, outputStylePath?: string) {
    const file = this.getFile(filename);

    if (file) {
      this.loadedFiles.push(filename);
      this.checkStyles(outputStylePath);
    }
  }

  clearLoadedFile(filename: string) {
    const file = this.getFile(filename);

    if (file) {
      this.loadedFiles = this.loadedFiles.filter((file) => {
        return file !== filename;
      });
    }
  }

  private registerFile(filename: string) {
    const file = this.getFile(filename);

    if (!file) {
      this.files.push(filename);
    }
  }

  register(
    filename: string,
    classes: string,
    _reference?: string
  ): RegisterStyleResponse {
    const style = this.getRegisteredStyleUsingCache(filename, classes);

    if (style) {
      const wasCached = style.state === "cached";

      if (wasCached) {
        this.registerFile(filename);
        this.registerStyle(
          {
            reference: style.reference,
            classes: style.classes,
            filename,
          },
          style.css,
          "updated"
        );
      }

      return {
        reference: style.reference,
        state: "updated",
      };
    } else {
      const id = generateId();
      const reference = _reference ?? `factory__${id}`;

      this.registerFile(filename);
      this.registerStyle({
        reference,
        classes,
        filename,
      });

      return {
        reference: reference,
        state: "loading",
      };
    }
  }

  checkStyles(outputStylePath = "") {
    this.files = this.files.reduce((prev, file) => {
      const styles = this.getStyleByFile(file);

      const allStylesWereLoaded = styles.every((style) => {
        const state = style.state;
        return state === "updated";
      });

      const processWasFinished = allStylesWereLoaded && this.loadedFiles.includes(file);

      if (!processWasFinished) {
        prev.push(file);
        return prev;
      }

      this.emit("create", {
        filename: file,
        styles,
        path: outputStylePath,
      });

      return prev;
    }, [] as string[]);
  }
}

const emitter = new StyleEmitter();

emitter.on("create", async function ({ filename, path, styles }) {
  StyleController.write(path, filename, styles, () => {
    this.getCache(filename);
  });
});

emitter.on(
  "process",
  async function ({
    deepClass,
    outputStylePath,
    inputStylePath,
    filename,
    reference,
    configPath,
  }) {
    StyleController.keepCacheCycle(filename);

    const css = await StyleFactory.generateClassTree(deepClass, {
      reference,
      configPath,
      inputStylePath,
    });

    this.updateStyle({ reference, filename, css }, outputStylePath);
  }
);

export { emitter };
