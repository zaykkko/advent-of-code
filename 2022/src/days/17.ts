import { PuzzleHelper } from "@utils/PuzzleHelper";

type Coords = Record<string, number>;

export default class Puzzle extends PuzzleHelper {
  may_take_longer = true;

  readonly part_1_cycles = 2022;
  readonly part_2_cycles = 1e12;

  readonly blocks: Coords[][] = [
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ], // ####
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 2 },
    ], // +
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ], // L (reversed)
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ], // |
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ], // []
  ];
  protected occupied = new Set<string>();

  checkBlockCollision(points: Coords[]) {
    for (const { x, y } of points) {
      if (this.occupied.has(`${x},${y}`)) return true; // collisioned other block
      if (y <= 0) return true; // collisioned floor
      if (x <= 0 || x >= 8) return true; //collisioned wall
    }
    return false; // no collision
  }

  resolve() {
    const wind = this.cleanInput()[0].split("");

    let tallestPoint = 0,
      wind_i = 0;

    let part_1_result = 0;

    for (let cycle = 0; cycle < this.part_2_cycles; cycle++) {
      if (cycle % 100_000 == 0)
        console.debug(`[INFO]: just reached cycle ${cycle}!`);

      const current_block = JSON.parse(
        JSON.stringify(this.blocks[cycle % this.blocks.length])
      ) as Coords[];

      current_block.forEach((block) => {
        block.x += 3;
        block.y += tallestPoint + 4;
      });

      while (1) {
        const wind_x_move = wind[wind_i++ % wind.length] == ">" ? 1 : -1;
        current_block.forEach((point) => {
          point.x += wind_x_move;
        });

        let x_collision = this.checkBlockCollision(current_block);
        if (x_collision) {
          current_block.forEach((point) => {
            point.x -= wind_x_move;
          });
        }

        current_block.forEach((point) => {
          point.y -= 1;
        });

        let y_collision = this.checkBlockCollision(current_block);
        if (y_collision) {
          current_block.forEach((point) => {
            point.y += 1;
            this.occupied.add(`${point.x},${point.y}`);
            tallestPoint = Math.max(tallestPoint, point.y);
          });
          break;
        }
      }

      if (cycle == this.part_1_cycles - 1) {
        part_1_result = tallestPoint;
      }

      if (cycle % 1000 == 0) {
        const tallest_points = new Set<string>();
        const found_tallest = Array.from({ length: 7 }, () => false);

        for (let y = tallestPoint; y > 0; y--) {
          for (let x = 1; x <= 7; x++) {
            if (!found_tallest[x - 1] && this.occupied.has(`${x},${y}`)) {
              tallest_points.add(`${x},${y}`);
              found_tallest[x - 1] = true;
            }
          }

          if (found_tallest.every((b) => b)) break;
        }

        this.occupied = new Set(tallest_points);
      }
    }

    return [part_1_result, tallestPoint];
  }
}
