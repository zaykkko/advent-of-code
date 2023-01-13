import { PuzzleHelper } from "utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper {
  resolve() {
    const per_elf_raw = this.raw_input.split(/\n\n/);
    const per_elf_parsed = per_elf_raw.map((line) =>
      line.split(/\n/).map((amount) => +amount)
    );
    const per_elf_total = per_elf_parsed
      .map((line) => line.reduce((prev, current) => prev + current, 0))
      .sort((a, b) => b - a);

    const greater_one = per_elf_total[0];
    const first_three_greater_sum = per_elf_total
      .slice(0, 3)
      .reduce((prev, curr) => prev + curr, 0);

    return [greater_one, first_three_greater_sum];
  }
}
