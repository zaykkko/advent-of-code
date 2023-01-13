import { PuzzleHelper } from "@utils/PuzzleHelper";

type Coords = Omit<CoordsWithSteps, "steps" | "path">;
type CoordsWithSteps = {
  x: number;
  y: number;
  steps: number;
  path: number[][];
};

// TODO: un algorítmo simple que nesteará cada camino en subcaminos sucesivos hasta que uno de esos caminos llegue a la meta, el primero en llegar es el camino más corto, el último es el camino más largo. :)
export default class Puzzle extends PuzzleHelper {
  readonly hill_size_offset = 96;

  getLowestSteps(
    grid: number[][],
    start_point: Coords[] | Coords,
    end_point: Coords
  ): [number, number[][]] {
    const { x: end_x, y: end_y } = end_point;
    const queue = [
      ...(Array.isArray(start_point)
        ? start_point.map((start_point) => ({
            ...start_point,
            steps: 0,
            path: [],
          }))
        : [{ ...start_point, steps: 0, path: [] }]),
    ] as CoordsWithSteps[];

    const grid_width = grid[0].length,
      grid_height = grid.length;

    const seen = new Set<string>();

    while (queue.length) {
      // fixes @typescript-eslint/no-non-null-assertion
      const { x, y, steps, path } = queue.shift() ?? {
        ...end_point,
        steps: 0,
        path: [],
      };
      const key = `${x},${y}`;

      if (x == end_x && y == end_y) {
        return [steps, path];
      }

      if (seen.has(key)) continue;

      seen.add(key);

      const height = grid[y][x];

      // right
      if (x + 1 < grid_width && grid[y][x + 1] - height <= 1) {
        queue.push({
          x: x + 1,
          y,
          steps: steps + 1,
          path: path.concat([x, y]),
        });
      }

      // left
      if (x > 0 && grid[y][x - 1] - height <= 1) {
        queue.push({
          x: x - 1,
          y,
          steps: steps + 1,
          path: path.concat([x, y]),
        });
      }

      // down
      if (y + 1 < grid_height && grid[y + 1][x] - height <= 1) {
        queue.push({
          x,
          y: y + 1,
          steps: steps + 1,
          path: path.concat([x, y]),
        });
      }

      // top
      if (y > 0 && grid[y - 1][x] - height <= 1) {
        queue.push({
          x,
          y: y - 1,
          steps: steps + 1,
          path: path.concat([x, y]),
        });
      }
    }

    return [-1, []];
  }

  resolve() {
    let start = { x: 0, y: 0 },
      end = { x: 0, y: 0 };

    const a_arr = [] as Coords[];

    const grid = this.cleanInput().map((row, y) =>
      row.split("").map((letter, x) => {
        if (letter == "S") {
          start = { x, y };
          letter = "a"; // S is the lowest so.... it should be the first letter in the alphabet
        }

        if (letter == "E") {
          end = { x, y };
          letter = "z"; // E is the highest so it may be z
        }

        if (letter == "a") {
          a_arr.push({ x, y });
        }

        return letter.charCodeAt(0) - this.hill_size_offset;
      })
    );

    const [part1_steps] = this.getLowestSteps(grid, start, end),
      [part2_steps] = this.getLowestSteps(grid, a_arr, end);
    // el segundo arg para visualizar (en algún momento) jeje

    return [part1_steps, part2_steps];
  }
}
