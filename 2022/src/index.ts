import { existsSync } from "fs";
import { join, resolve } from "path";
import readline from "node:readline";

import type { PuzzleHelper } from "./utils/PuzzleHelper";

class PuzzleResolver {
  private _readline: readline.Interface;

  constructor() {
    this._readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.printCmds();

    this._readline.on("line", this.checkCommand);
  }

  printCmds() {
    console.clear();

    console.log(
      "\x1b[32m\x1b[4mWelcome to the Advent of Code 2022!\x1b[0m 🎄",
      "\n",
      "There are the available commands you can execute:",
      "\n",
      '* day <num_of_day> [<input_txt_file_path>="./data/<day>.txt"]',
      "\n"
    );
  }

  checkCommand = (line: string) => {
    const [cmd, ...args] = line.trim().split(/\s/);

    this._readline.pause();

    switch (cmd) {
      case "day":
        const [day, path] = args;

        if (isNaN(+day) || +day <= 0 || +day > 25) {
          console.error("Input a valid day number (1-25), ty.");
          break;
        }

        const day_path = join(__dirname, "days", `${day}.js`);
        const input_path = path ? resolve(path) : join("data", `${day}.txt`);

        if (!existsSync(day_path)) {
          console.error(`${day}.js doesn't even exists!!!`);
          break;
        }

        try {
          import(day_path).then(
            (module: {
              default: { new (input_path: string): PuzzleHelper };
            }) => {
              const pNow = performance.now();
              const puzzle = new module.default(input_path);
              const [part1, part2] = puzzle.resolve();
              const pAfter = performance.now();

              console.log(
                `\x1b[32m\x1b[4mDay ${day} responses are\x1b[0m:`,
                "\n",
                `\x1b[36m* Part 1: \x1b[33m${part1}\x1b[0m`,
                "\n",
                `\x1b[36m* Part 2: \x1b[33m${part2}\x1b[0m`,
                "\n",
                `Puzzle took ${(pAfter - pNow).toFixed(2)}ms to resolve.`,
                "\n"
              );
            }
          );
        } catch (e) {
          console.error(
            `An unexpected error just happened: ${(e as Error).message}`
          );
        }

        break;
    }

    this._readline.resume();
  };
}

export default new PuzzleResolver();
