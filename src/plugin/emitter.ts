/* eslint-disable prettier/prettier */
import { EventEmitter } from "node:events";
import { writeFile, readFileSync, existsSync, mkdir } from "node:fs";
import { generateId } from "../utils/generateId";

import postcss from "postcss";
import tailwind from "tailwindcss";
import path from "node:path";

type ProcessDataParams = {
  filename: string;
  reference: string;
  classes: string;
  stylePath?: string;
};

type CheckCacheParams = {
  filename: string;
  reference: string;
  stylePath?: string;
};

type Style = {
  state: "cached" | "updated" | "loading";
  filename: string;
  reference: string;
  classes: string;
  css: string;
};

type RegisterStyleResponse = {
  state: Style["state"];
  reference: string;
};

type Event = {
  process(this: StyleEmitter, data: ProcessDataParams): void;
  createCache(this: StyleEmitter, cache: string): void;
};

const cacheFolderPath = path.resolve(__dirname, "cache");
const cachePath = path.resolve(__dirname, "cache", "styles.json");

export class StyleEmitter extends EventEmitter {
  private _on = super.on;
  private _emit = super.emit;

  on<U extends keyof Event>(eventName: U, listener: Event[U]) {
    return this._on(eventName, listener);
  }

  emit<U extends keyof Event>(eventName: U, options: Parameters<Event[U]>[0]) {
    return this._emit(eventName, options);
  }

  private files: string[] = [];
  private styles: Style[] = [];

  private getCache() {
    try {
      const rawCachedStyles = readFileSync(cachePath).toString();
      const cachedStyles: Style[] = JSON.parse(rawCachedStyles) ?? [];

      if(Array.isArray(cachedStyles)) {
        this.styles = cachedStyles.map((cachedStyle) => {
          this.registerFile(cachedStyle.filename);
          return {
            ...cachedStyle,
            state: "cached"
          };
        });
      }
    } catch(_) {
      this.styles = [];
    }
  }

  constructor() {
    super();
    this.getCache();
  }

  private getStyle(classes: string) {
    return this.styles.find((style) => { 
      return style.classes === classes; 
    });
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

  private registerStyle({ reference, classes, filename }: Omit<Style, "css" | "state">) {
    this.styles.push({
      reference,
      classes,
      filename,
      css: "",
      state: "loading"
    });
  }

  updateStyle({ reference, filename, css }: Omit<Style, "classes" | "state">, stylePath?: string) {
    const index = this.getStyleIndexByReference(filename, reference);

    if(index !== -1) {
      this.styles[index] = {
        ...this.styles[index],
        css,
        state: "updated"
      };

      this.checkStyles(stylePath);
    }
  }

  forceUpdateState(filename: string, reference: string) {
    const index = this.getStyleIndexByReference(filename, reference);

    if(index !== -1) {
      this.styles[index] = {
        ...this.styles[index],
        state: "updated"
      };
    }
  }

  private getFile(filename: string) {
    return this.files.find((file) => { 
      return file === filename;
    });
  }

  private registerFile(filename: string) {
    const file = this.getFile(filename);

    if(!file) {
      this.files.push(filename);
    }
  }

  register(filename: string, classes: string): RegisterStyleResponse {
    const style = this.getStyle(classes);

    if(style) {
      const wasCached = style.state === "cached";

      if(wasCached) {
        this.forceUpdateState(filename, style.reference);
      }

      return {
        reference: style.reference,
        state: "updated"
      };
    } else {
      const id = generateId();
      const reference = `factory__${id}`;

      this.registerFile(filename);
      this.registerStyle({
        reference,
        classes,
        filename
      });

      return {
        reference: reference,
        state: "loading"
      };
    }
  }

  private stylesWereUpdated() {
    const allStylesInFilesWereLoaded = this.files.every((file) => {
      const styles = this.getStyleByFile(file);

      const allStylesWereLoaded = styles.every((style) => {
        const state = style.state;
        return state !== "loading";
      });

      return allStylesWereLoaded;
    });
    
    return allStylesInFilesWereLoaded;
  }

  private deleteUnnecessaryCachedStyles() {
    this.styles = this.styles.filter((style) => { return style.state !== "cached"; });
  }

  private getFormattedFinalStyles() {
    return this.styles.map((style) => { return style.css; }).join(" ");
  }

  checkStyles(stylesPath = "") {
    const stylesWereUpdated = this.stylesWereUpdated();

    if (stylesWereUpdated) {
      this.deleteUnnecessaryCachedStyles();
      
      const finalStyles = this.getFormattedFinalStyles();
      this.putStyles(finalStyles, stylesPath);
    }
  }

  private putStyles(finalStyle: string, path: string) {
    if(path && finalStyle) {
      writeFile(path, finalStyle, (err) => {
        if(err) {
          console.log("factory - unable to update styles");
        }

        console.log("factory - styles updated!");

        this.emit("createCache", JSON.stringify(this.styles, null, 2));
      });
    } else if(path) {
      console.log("factory - no deep classes detected");
    } else {
      console.log("factory - styles path not defined");
    }
  }

  writeCache(cache: string) {
    writeFile(cachePath, cache, (err) => {
      if(err) {
        console.log("factory - unable to create cache");
      }

      this.getCache();
    });
  }
}

const emitter = new StyleEmitter();

emitter.on("createCache", async function(cache) {
  const cachePathAlreadyExists = existsSync(cacheFolderPath);
  
  if(!cachePathAlreadyExists) {
    mkdir(cacheFolderPath, {}, (err) => {
      if(err) {
        console.log("factory - unable to create cache folder");
      } else {
        this.writeCache(cache);
      }
    });
  }
    
  this.writeCache(cache);
});

emitter.on("process", async function({ classes, stylePath, filename, reference }) {
  const res = await postcss(tailwind({
    corePlugins: {
      preflight: false
    },
    content: [
      {
        raw: classes
      }
    ],
  })).process("@tailwind utilities;", {
    from: undefined
  });

  const css = res.css;

  this.updateStyle({ reference, filename, css }, stylePath);
});

export { emitter };
