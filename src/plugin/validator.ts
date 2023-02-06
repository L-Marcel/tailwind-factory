import path from "path";
import { writeFile } from "node:fs";
import { StyleController } from "./controller";
import { Logs } from "./logs";
import { existsSync, mkdir, readFile, unlink } from "fs";

export class Validator {
  private static validatorFolderPath = path.resolve(__dirname, "validator");

  private static validatorPath(filename: string) {
    return path.resolve(__dirname, "validator", filename);
  }

  private static save(filename: string, content: string) {
    const validatorPathAlreadyExists = existsSync(Validator.validatorFolderPath);

    if (!validatorPathAlreadyExists) {
      return mkdir(Validator.validatorFolderPath, {}, (err) => {
        if (err) {
          Logs.error("Unable to create validator folder");
          return;
        }

        Validator.save(filename, content);
      });
    }

    return writeFile(Validator.validatorPath(filename), content, (err) => {
      if (err) {
        Logs.error("Unable to create validator");
        return;
      }
    });
  }

  static validate(filename: string, content: string) {
    readFile(Validator.validatorPath(filename), (err, data) => {
      if (err) {
        StyleController.cleanCache(() => {
          Logs.info("styles stored in the cache were cleared by the validator");
        });
        Validator.save(filename, content);
        return;
      }

      const savedContent = data.toString();

      if (savedContent !== content) {
        Logs.warning(
          `Changes in "${filename}" detected by the validator. Restart the server to apply the changes!`
        );
        unlink(Validator.validatorPath(filename), (err) => {
          if (err) {
            Logs.error(
              `The validator is not able to reset the saved data of "${filename}"!`
            );
          }
        });
      }
    });
  }
}
