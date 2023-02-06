import path from "node:path";
import { Logs } from "./logs";
import { writeFile, readFileSync, existsSync, mkdir } from "node:fs";

let timer: NodeJS.Timeout | null = null;

export class StyleController {
  static isDev = true;

  private static filesInQueue: string[] = [];
  private static styles: FactoryPlugin.Style[] = [];

  static cacheFolderPath = path.resolve(__dirname, "cache");
  static cachePath = path.resolve(__dirname, "cache", "styles.json");

  private static updateStyles(filename: string, styles: FactoryPlugin.Style[]) {
    const stylesInCache = StyleController.getFormattedCache();

    const savedStyles = [...StyleController.styles, ...stylesInCache].filter((style) => {
      return style.filename !== filename;
    });

    StyleController.styles = [...styles, ...savedStyles].reduce((prev, style) => {
      const alreadyInPrev = prev.some((savedStyle) => {
        return savedStyle.classes === style.classes;
      });

      if (alreadyInPrev) {
        return prev;
      }

      prev.push(style);
      return prev;
    }, [] as FactoryPlugin.Style[]);
  }

  private static getFormattedFinalStyles(styles?: FactoryPlugin.Style[]) {
    return (styles ?? StyleController.styles)
      .map((style) => {
        return style.css;
      })
      .join("\n");
  }

  private static writeCache(styles: FactoryPlugin.Style[], callback: () => void) {
    const isDev = StyleController.isDev;
    const cachePathAlreadyExists = existsSync(StyleController.cacheFolderPath);

    if (!isDev) {
      return;
    }

    if (!cachePathAlreadyExists) {
      return mkdir(StyleController.cacheFolderPath, {}, (err) => {
        if (err) {
          Logs.error("Unable to create cache folder");
          return;
        }

        StyleController.writeCache(styles, callback);
      });
    }

    const cache = JSON.stringify(styles, null, 2);
    return writeFile(StyleController.cachePath, cache, (err) => {
      if (err) {
        Logs.error("Unable to create cache");
        return;
      }

      callback();
    });
  }

  private static updateUsedCache() {
    const cachedStyles = StyleController.getFormattedCache();
    const usedCachedStyles: FactoryPlugin.Style[] = [];

    StyleController.filesInQueue.forEach((file) => {
      cachedStyles.forEach((cachedStyle) => {
        const alreadyUsed = usedCachedStyles.some((usedStyle) => {
          return usedStyle.classes === cachedStyle.classes;
        });

        const usedStyled = StyleController.styles.find((style) => {
          return style.classes === cachedStyle.classes && cachedStyle.filename === file;
        });

        if (usedStyled && !alreadyUsed) {
          cachedStyle.filename = file;
          usedCachedStyles.push(cachedStyle);
        } else if (!alreadyUsed) {
          usedCachedStyles.push(cachedStyle);
        }
      });
    });

    StyleController.filesInQueue = [];
    StyleController.writeCache(usedCachedStyles, () => {
      Logs.info("styles stored in cache");
      setTimeout(() => {
        Logs.printedMessages = [];
      }, 1200);
    });
  }

  private static verifyCache() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(StyleController.updateUsedCache, 1000);
  }

  static getFormattedCache() {
    try {
      const rawCachedStyles = readFileSync(StyleController.cachePath).toString();
      const cachedStyles: FactoryPlugin.Style[] = JSON.parse(rawCachedStyles) ?? [];

      return cachedStyles;
    } catch (_) {
      return [];
    }
  }

  static startCacheCycle(filename: string) {
    const alreadyInQueue = StyleController.filesInQueue.some((fileInQueue) => {
      return fileInQueue === filename;
    });

    if (!alreadyInQueue) {
      StyleController.verifyCache();
      StyleController.filesInQueue.push(filename);
    }
  }

  static keepCacheCycle(filename: string) {
    const alreadyInQueue = StyleController.filesInQueue.some((fileInQueue) => {
      return fileInQueue === filename;
    });

    if (alreadyInQueue) {
      StyleController.verifyCache();
    }
  }

  static write(
    path: string,
    filename: string,
    styles: FactoryPlugin.Style[],
    callback: () => void
  ) {
    StyleController.updateStyles(filename, styles);
    const formattedStyles = StyleController.getFormattedFinalStyles();

    if (path && formattedStyles) {
      writeFile(path, formattedStyles, (err) => {
        if (err) {
          Logs.error("Unable to update styles");
          return;
        }

        console.warn = Logs.restoreExpectedWarnings();
        this.writeCache(StyleController.styles, callback);
      });
    } else if (!path) {
      Logs.error("Styles path not defined");
    }
  }
}
