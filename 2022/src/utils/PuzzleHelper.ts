import { readFileSync } from "fs";
import { InputError } from "./InputError";

export abstract class PuzzleHelper<RT = number | string> {
  protected raw_input = "";

  constructor(readonly input_path: string) {
    try {
      this.raw_input = readFileSync(input_path, "utf-8");
    } catch (err) {
      if (
        err instanceof Error &&
        (err as NodeJS.ErrnoException).code === "ENOENT"
      ) {
        throw new InputError(
          `No input file was found for path "${input_path}".`
        );
      }

      throw err;
    }
  }

  cleanInput() {
    return this.raw_input
      .split(/\n/)
      .map((value) => value.trim())
      .filter((value) => value.length);
  }

  abstract resolve(): RT[];
}
