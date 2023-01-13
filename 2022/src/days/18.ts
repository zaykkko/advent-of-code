import { PuzzleHelper } from "@utils/PuzzleHelper";

type TridimensionalGrid = (0 | 1)[][][];

export default class Puzzle extends PuzzleHelper {
  readonly adjacent_offsets = [
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  private isConnectedToAir(
    cubes_tri_map: TridimensionalGrid,
    ...point: number[]
  ) {
    const queue = [point];
    const visited = new Set<string>();

    const max_x = cubes_tri_map.length - 1,
      max_y = cubes_tri_map[0].length - 1,
      max_z = cubes_tri_map[0][0].length - 1;

    while (queue.length) {
      const current_point = queue.shift();

      if (current_point) {
        const [x, y, z] = current_point;

        if (cubes_tri_map[x][y][z] || visited.has(current_point.join(",")))
          continue;

        visited.add(current_point.join(","));

        if (
          x == 0 ||
          x == max_x ||
          y == 0 ||
          y == max_y ||
          z == 0 ||
          z == max_z
        ) {
          return true;
        }

        this.adjacent_offsets.forEach(([off_x, off_y, off_z]) => {
          queue.push([x + off_x, y + off_y, z + off_z]);
        });
      }
    }

    return false;
  }

  private getSurfaceArea(cubes: Set<string>) {
    const unvisited = new Set(cubes);

    let surface = cubes.size * 6;

    const point_exists = (...args: number[]) =>
      cubes.has(args.join(",")) ? args.join(",") : "";

    const queque: string[] = [];

    while (unvisited.size) {
      if (!queque.length) {
        queque.push(Array.from(unvisited)[0]);
      }

      const current_cube = queque.shift();

      if (current_cube) {
        if (!unvisited.has(current_cube)) continue;

        unvisited.delete(current_cube);

        const [x, y, z] = current_cube.split(/,/).map(Number);

        this.adjacent_offsets.forEach(([off_x, off_y, off_z]) => {
          const exists = point_exists(x + off_x, y + off_y, z + off_z);

          if (exists) {
            surface--;
            queque.push(exists);
          }
        });
      }
    }

    return surface;
  }

  resolve() {
    let max_x = 0,
      max_y = 0,
      max_z = 0;

    const all_cubes = new Set<string>();

    this.cleanInput().forEach((point) => {
      const [x, y, z] = point.split(",").map(Number);

      all_cubes.add(point);

      max_x = Math.max(max_x, x);
      max_y = Math.max(max_y, y);
      max_z = Math.max(max_z, z);
    });

    const part_1_area = this.getSurfaceArea(all_cubes);

    const all_cubes2 = new Set(all_cubes);

    const cubes_tri_map = Array.from({ length: max_x + 1 }, () =>
      Array.from({ length: max_y + 1 }, () => Array(max_z + 1).fill(0))
    );

    all_cubes.forEach((cube) => {
      const [x, y, z] = cube.split(/,/).map(Number);

      cubes_tri_map[x][y][z] = 1;
    });

    cubes_tri_map.forEach((yz_cubes, x) => {
      yz_cubes.forEach((z_cubes, y) => {
        z_cubes.forEach((is_occupied, z) => {
          if (!is_occupied && !this.isConnectedToAir(cubes_tri_map, x, y, z)) {
            all_cubes2.add(`${x},${y},${z}`);
          }
        });
      });
    });

    const part_2_result = this.getSurfaceArea(all_cubes2);

    return [part_1_area, part_2_result];
  }
}
