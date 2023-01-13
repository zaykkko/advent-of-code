import { PuzzleHelper } from "@utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper {
  readonly directions_offset: Record<string, [number, number]> = {
    L: [-1, 0],
    R: [1, 0],
    U: [0, 1],
    D: [0, -1],
  };
  readonly part_1_rope_size = 2;
  readonly part_2_rope_size = 10;

  resolve() {
    const rope = Array.from({ length: this.part_2_rope_size }, () => ({
      x: 0,
      y: 0,
    })); // Array(10).fill({x: 0, y:0}) generates the array with the object by ref :P

    const seen_positions = new Set(["0-0"]);
    const seen_positions_2 = new Set(["0-0"]);

    let tail = rope[1],
      tail_1 = rope[2];

    this.cleanInput().forEach((line) => {
      const [direction, n_steps] = line.split(/\s/);
      const [dir_x_offset, dir_y_offset] = this.directions_offset[direction];

      for (let i = 0; i < +n_steps; i++) {
        //index 0 = head, index > 0 = tail
        const head = rope[0];

        head.x += dir_x_offset;
        head.y += dir_y_offset;

        for (let j = 1; j < rope.length; j++) {
          tail = rope[j];
          if (j < this.part_1_rope_size) {
            tail_1 = tail;
          }
          const tmp_head = rope[j - 1];

          const distance_x = tmp_head.x - tail.x,
            distance_y = tmp_head.y - tail.y;

          if (Math.abs(distance_y) > 1 || Math.abs(distance_x) > 1) {
            if (tmp_head.y == tail.y) {
              tail.x += distance_x > 0 ? 1 : -1;
            } else if (tmp_head.x == tail.x) {
              tail.y += distance_y > 0 ? 1 : -1;
            } else {
              tail.x += tmp_head.x > tail.x ? 1 : -1;
              tail.y += tmp_head.y > tail.y ? 1 : -1;
            }
          }
        }

        seen_positions.add(`${tail_1.x}-${tail_1.y}`);
        seen_positions_2.add(`${tail.x}-${tail.y}`);
      }
    });

    return [seen_positions.size, seen_positions_2.size];
  }
}
