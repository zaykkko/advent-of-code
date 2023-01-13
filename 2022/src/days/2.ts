import { PuzzleHelper } from "utils/PuzzleHelper";

enum RPS {
  ROCK = 0,
  PAPER = 1,
  SCISSORS = 2,
}
enum RPS_MATCH_RESULT {
  DRAW = 3,
  WIN = 6,
  LOSE = 0,
}

export default class Puzzle extends PuzzleHelper {
  readonly RPS_ALIASES: Record<string, number> = {
    A: RPS.ROCK,
    B: RPS.PAPER,
    C: RPS.SCISSORS,
    X: RPS.ROCK,
    Y: RPS.PAPER,
    Z: RPS.SCISSORS,
    // for the second part, where X = lose, Y = draw, Z = win
    X2: RPS_MATCH_RESULT.LOSE,
    Y2: RPS_MATCH_RESULT.DRAW,
    Z2: RPS_MATCH_RESULT.WIN,
  };
  readonly RPS_RULE: number[] = [RPS.SCISSORS, RPS.ROCK, RPS.PAPER];

  battleElements(other: number, me: number) {
    const points = me + 1;

    if (this.RPS_RULE[other] === me) {
      return points + RPS_MATCH_RESULT.LOSE;
    }

    if (this.RPS_RULE[me] === other) {
      return points + RPS_MATCH_RESULT.WIN;
    }

    return points + RPS_MATCH_RESULT.DRAW;
  }

  getMyChoice(other: number, result: number) {
    if (result === RPS_MATCH_RESULT.LOSE) {
      return this.RPS_RULE[other];
    }

    if (result === RPS_MATCH_RESULT.WIN) {
      return this.RPS_RULE.indexOf(other);
    }

    return other;
  }

  resolve() {
    let total_points = 0,
      total_points_2 = 0;

    // Podría haber calculado ambos resultados con un único loop, pero como la idea de AoC no se basa en el mejor algorítmo para la mejor performance sino que encontrarle la solución al problema... heh//lo terminé haciendo en un único loop kekw

    this.cleanInput().forEach((round) => {
      const [other, second_arg] = round.split(/\s/);

      // First part of the challenge, second_arg = my_choice
      const result_1 = this.battleElements(
        this.RPS_ALIASES[other],
        this.RPS_ALIASES[second_arg]
      );

      total_points += result_1;

      // Second part of the challenge, second_arg = type of result
      const my_choice = this.getMyChoice(
        this.RPS_ALIASES[other],
        this.RPS_ALIASES[second_arg + "2"]
      );

      const result_2 = this.battleElements(this.RPS_ALIASES[other], my_choice);

      total_points_2 += result_2;
    });

    return [total_points, total_points_2];
  }
}
