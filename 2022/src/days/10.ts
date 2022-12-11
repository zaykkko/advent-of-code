import { PuzzleHelper } from "@utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper {
  readonly cycles = [20, 60, 100, 140, 180, 220];

  resolve() {
    let x_1 = 1,
      cycle_1 = 0;

    const strength_by_instruction = this.cleanInput().map((line) => {
      const [instruction, value] = line.split(/\s/);
      const loops = instruction == "addx" ? 2 : 1;
      let strength = 0;

      for (let i = 0; i < loops; i++) {
        strength =
          this.cycles.indexOf(++cycle_1) > -1 ? cycle_1 * x_1 : strength;
      }

      x_1 += instruction == "addx" ? +value : 0;

      return strength;
    });

    const strength_sum = strength_by_instruction.reduce((a, b) => a + b, 0);

    let x_2 = 1,
      cycle_2 = 0,
      row = "";

    this.cleanInput().map((line) => {
      const [instruction, value] = line.split(/\s/);
      const loops = instruction == "addx" ? 2 : 1;

      for (let i = 0; i < loops; i++) {
        row += x_2 - 1 <= cycle_2 && cycle_2 <= x_2 + 1 ? "#" : " ";

        if (++cycle_2 % 40 == 0) {
          console.log(row);
          row = "";
          x_2 += 40;
        }
      }

      x_2 += instruction == "addx" ? +value : 0;
    });

    return [strength_sum, "(text above)"];
  }
}
