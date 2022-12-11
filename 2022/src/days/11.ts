import { PuzzleHelper } from "@utils/PuzzleHelper";

class Monkey {
  inventory: number[];
  inventory_part2: number[];
  total_inspects = 0;
  total_inspects_part2 = 0;

  constructor(
    starting_items: number[],
    readonly operation: string[],
    readonly divisible: number,
    readonly ifTrue_target: number,
    readonly ifFalse_target: number
  ) {
    this.inventory = ([] as number[]).concat(starting_items);
    this.inventory_part2 = ([] as number[]).concat(starting_items);
  }

  doMonkeMath(old: number) {
    const [sign, number] = this.operation;

    if (sign == "*") return old * (number == "old" ? old : +number);

    return old + (number == "old" ? old : +number);
  }
}

export default class Puzzle extends PuzzleHelper<number> {
  readonly part1_total_rounds = 20;
  readonly part2_total_rounds = 10000;

  resolve() {
    const monkeys_turns = this.raw_input
      .split(/\n\n/)
      .map((monkey) => monkey.trim().split(/\n/));

    const monkeys = monkeys_turns.map((monkey) => {
      const [, items, operation, test, if_true, if_false] = monkey;

      let monkey_starting_items = [] as number[];
      const matched_items = items.match(/(\d+)(,\s*\d+)*/);
      if (matched_items)
        monkey_starting_items = matched_items[0].split(/,\s/).map(Number);

      let monkey_operation = [] as string[];
      const matched_operation = operation.match(
        /([\d|\w+]{1,3})\s(\*|\+)\s([\d|\w+]{1,3})/
      );
      if (matched_operation) monkey_operation = matched_operation.slice(-2);

      // +(...) ?? 1 -> fixes @typescript-eslint/no-non-null-assertion
      const monkey_divisible = +(test.match(/\d+/)?.at(0) ?? 1);

      const monkey_true_target = +(if_true.match(/\d+/)?.at(0) ?? 1);

      const monkey_false_target = +(if_false.match(/\d+/)?.at(0) ?? 1);

      return new Monkey(
        monkey_starting_items,
        monkey_operation,
        monkey_divisible,
        monkey_true_target,
        monkey_false_target
      );
    });

    const superModulo = monkeys.reduce((a, b) => a * b.divisible, 1);

    for (let round = 0; round < this.part2_total_rounds; round++) {
      monkeys.forEach((monke) => {
        if (round < this.part1_total_rounds) {
          monke.inventory.forEach((item_worry_level) => {
            const new_worry_level = Math.floor(
              monke.doMonkeMath(item_worry_level) / 3
            );

            if (new_worry_level % monke.divisible == 0)
              monkeys[monke.ifTrue_target].inventory.push(new_worry_level);
            else monkeys[monke.ifFalse_target].inventory.push(new_worry_level);

            monke.total_inspects++;
          });

          monke.inventory = [];
        }

        monke.inventory_part2.forEach((item_worry_level) => {
          const new_worry_level =
            monke.doMonkeMath(item_worry_level) % superModulo;

          if (new_worry_level % monke.divisible == 0)
            monkeys[monke.ifTrue_target].inventory_part2.push(new_worry_level);
          else
            monkeys[monke.ifFalse_target].inventory_part2.push(new_worry_level);

          monke.total_inspects_part2++;
        });

        monke.inventory_part2 = [];
      });
    }

    const monke_business_part1 = monkeys
      .sort((a, b) => b.total_inspects - a.total_inspects)
      .slice(0, 2)
      .reduce((a, b) => a * b.total_inspects, 1);

    const monke_business_part2 = monkeys
      .sort((a, b) => b.total_inspects_part2 - a.total_inspects_part2)
      .slice(0, 2)
      .reduce((a, b) => a * b.total_inspects_part2, 1);

    return [monke_business_part1, monke_business_part2];
  }
}
