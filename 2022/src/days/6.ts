import { PuzzleHelper } from "@utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper<number> {
  readonly max_chars = 4;
  readonly max_chars_part2 = 14;

  resolve() {
    let last_received = "",
      last_received_part2 = "",
      part1 = 0,
      part2 = 0;

    for (let i = 0; i < this.raw_input.length && (!part1 || !part2); i++) {
      // rip DRY principie
      if (!part1) {
        last_received += this.raw_input[i];

        if (last_received.length > this.max_chars) {
          last_received = last_received.slice(-this.max_chars);

          if (!/([a-z]).*?\1/.test(last_received)) {
            part1 = i + 1;
          }
        }
      }

      if (!part2) {
        last_received_part2 += this.raw_input[i];

        if (last_received_part2.length > this.max_chars_part2) {
          last_received_part2 = last_received_part2.slice(
            -this.max_chars_part2
          );

          if (!/([a-z]).*?\1/.test(last_received_part2)) {
            part2 = i + 1;
          }
        }
      }
    }

    return [part1, part2];
  }
}
