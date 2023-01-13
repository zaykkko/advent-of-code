import { PuzzleHelper } from "@utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper {
  readonly conversion: Record<string, number> = {
    0: 0,
    1: 1,
    2: 2,
    "-": -1,
    "=": -2,
  };

  // thanks @dedrika for the help solution on python, reworked a bit on javascript
  private encodeDecimal(decimal: number): string {
    if (decimal) {
      const entries = Object.entries(this.conversion);

      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];

        if ((value + 5) % 5 == decimal % 5) {
          const new_digit = Math.floor((decimal - value) / 5);

          return this.encodeDecimal(new_digit) + key;
        }
      }
    }

    return "";
  }

  resolve() {
    const input_number = this.cleanInput().reduce((prev_number, line) => {
      let decoded_number = 0;

      for (let i = 0; i < line.length; i++) {
        decoded_number +=
          this.conversion[line[i]] * Math.pow(5, line.length - 1 * i);
      }

      return prev_number + decoded_number;
    }, 0);

    const part_1_result = this.encodeDecimal(input_number);

    return [part_1_result, "2022 AoC almost done xd"];
  }
}
