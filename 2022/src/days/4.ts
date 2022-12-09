import { PuzzleHelper } from "@utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper<number> {
  resolve() {
    let totally_contained = 0,
      partially_contained = 0;

    const pairs_parsed = this.cleanInput().map((value) => value.split(","));

    pairs_parsed.forEach(([range1, range2]) => {
      const [range_x1, range_x2] = range1.split("-").map(Number);
      const [range_y1, range_y2] = range2.split("-").map(Number);

      if ((range_y1 - range_x1) * (range_y2 - range_x2) <= 0) {
        totally_contained++;
      }

      //2 <= 8 && 4 <= 6
      if (range_x1 <= range_y2 && range_y1 <= range_x2) {
        partially_contained++;
      }
    });

    return [totally_contained, partially_contained];
  }
}
