import { PuzzleHelper } from "@utils/PuzzleHelper";

type PacketList = (number | PacketList)[];

enum COMPARE_RESULT {
  NOT_IN_RIGHT_ORDER = 0,
  IN_RIGHT_ORDER = 1,
  INVALID_EQUAL_NUM = 2,
}

export default class Puzzle extends PuzzleHelper<number> {
  readonly divisors: PacketList = [[[2]], [[6]]];

  compare(left: PacketList, right: PacketList): number {
    const min_length = Math.min(left.length, right.length);

    for (let i = 0; i < min_length; i++) {
      const left_val = left[i],
        right_val = right[i];

      if (typeof left_val === "number" && typeof right_val === "number") {
        if (right_val > left_val) {
          return COMPARE_RESULT.IN_RIGHT_ORDER;
        }

        if (left_val > right_val) {
          return COMPARE_RESULT.NOT_IN_RIGHT_ORDER;
        }

        // continues cause both numbers are the same
      }

      let result = COMPARE_RESULT.INVALID_EQUAL_NUM;

      if (typeof left_val === "object" && typeof right_val === "object") {
        result = this.compare(left_val, right_val);
      } else if (
        typeof left_val === "number" &&
        typeof right_val === "object"
      ) {
        result = this.compare([left_val], right_val);
      } else if (
        typeof left_val === "object" &&
        typeof right_val === "number"
      ) {
        result = this.compare(left_val, [right_val]);
      }

      if (result < COMPARE_RESULT.INVALID_EQUAL_NUM) {
        return result;
      }
    }

    if (right.length > left.length) {
      return COMPARE_RESULT.IN_RIGHT_ORDER;
    }

    if (right.length < left.length) {
      return COMPARE_RESULT.NOT_IN_RIGHT_ORDER;
    }

    // both arrays have the same numbers in the same indexes... invalid
    return COMPARE_RESULT.INVALID_EQUAL_NUM;
  }

  resolve() {
    const packet_not_grouped = ([] as PacketList).concat(this.divisors);
    const packets = this.raw_input.split(/\n\s*\n/).map((packet) =>
      packet
        .split(/\n/)
        .filter((line) => line.length)
        .map((line) => {
          const parsed_line = JSON.parse(line) as PacketList;

          packet_not_grouped.push(parsed_line);

          return parsed_line;
        })
    );

    const packets_summ = packets.reduce(
      (prev, [left, right], index) =>
        prev + (this.compare(left, right) ? index + 1 : 0),
      0
    );

    const sorted_packets = packet_not_grouped.sort((line_a, line_b) =>
      this.compare(line_a as PacketList, line_b as PacketList) ? -1 : 1
    );
    const packets_decode_key = this.divisors.reduce(
      (prev: number, arr) => prev * (sorted_packets.indexOf(arr) + 1),
      1
    );

    return [packets_summ, packets_decode_key];
  }
}
