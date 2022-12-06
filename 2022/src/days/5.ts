import { PuzzleHelper } from "@utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper<string> {
  protected crate_map: string[][] = [];
  protected crate_map_part2: string[][] = [];

  resolve() {
    const [crates, moves] = this.raw_input.split(/\n\n/);
    const raw_crate_map = crates.split(/\n/);
    const parsed_crate_map = raw_crate_map.slice(0, raw_crate_map.length - 1);

    for (let i = parsed_crate_map.length - 1; i >= 0; i--) {
      // https://regex101.com/r/DyDRkf/1
      const line = parsed_crate_map[i]
        .split(/([\[A-Z\]\s]{3})\s?/) // eslint-disable-line no-useless-escape
        .filter(Boolean)
        .map((crate) =>
          crate.replace(/^\s+|\s+$/g, "").replace(/\[(.*?)\]/, "$1")
        );

      line.forEach(
        (value, index) =>
          !!value &&
          (this.crate_map[index]
            ? this.crate_map[index].push(value)
            : this.crate_map.push([value]))
      );
    }

    this.crate_map_part2 = this.crate_map.map((crates) => crates.slice()); // fast way to clone a multi-dimensional array :$

    const raw_moves = moves.split(/\n/);
    const parsed_moves = raw_moves.map((move) =>
      move.match(/\d\d?/g)?.map(Number)
    );

    parsed_moves.forEach((move) => {
      if (move) {
        this.moveCrate(this.crate_map, ...(move as [number, number, number]));
        this.moveCrate(
          this.crate_map_part2,
          ...(move as [number, number, number]),
          true
        );
      }
    });

    const part1 = this.crate_map.reduce(
      (prev: string, current: string[]) => prev + current.slice(-1),
      ""
    );
    const part2 = this.crate_map_part2.reduce(
      (prev: string, current: string[]) => prev + current.slice(-1),
      ""
    );

    return [part1, part2];
  }

  moveCrate(
    crate_map: string[][],
    n_crates: number,
    target: number,
    destination: number,
    keep_order = false
  ) {
    const target_index = target - 1,
      destination_index = destination - 1;

    const extracted_crates = crate_map[target_index].slice(-n_crates);
    crate_map[destination_index].push(
      ...(keep_order ? extracted_crates : extracted_crates.reverse())
    );
    crate_map[target_index].splice(-n_crates);
  }

  printMap(crate_map: string[][]) {
    crate_map.forEach((crates, index) => {
      console.log(`${index + 1} ${crates.join(" ")}`);
    });
  }
}
