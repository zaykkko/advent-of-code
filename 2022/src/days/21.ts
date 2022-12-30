import { PuzzleHelper } from "@utils/PuzzleHelper";
import { InputError } from "@utils/InputError";

type Operation = {
  operand?: Monkey;
  operator: string;
  operand2?: Monkey;
};

class Monkey {
  yell = {} as Operation | number;

  constructor(
    readonly id: number,
    readonly name: string,
    readonly raw_input: string[]
  ) {}

  getNumber(): number {
    if (typeof this.yell == "number") {
      return this.yell;
    }

    const { operand, operator, operand2 } = this.yell;

    if (operand && operand2) {
      const result_1 = operand.getNumber(),
        result_2 = operand2.getNumber();

      switch (operator) {
        case "+":
          return result_1 + result_2;

        case "-":
          return result_1 - result_2;

        case "/":
          return result_1 / result_2;

        case "*":
          return result_1 * result_2;
      }

      throw new InputError(
        `Passed an unknown operand: ${operand}. Fix it and retry.`
      );
    }

    throw new InputError(
      `For some unknown reason inputs 1 or 2 are unavailable for monkey ${this.name}.`
    );
  }

  getHumnYellOperands(with_operands = false) {
    if (typeof this.yell == "number") return false;

    const { operand, operand2 } = this.yell;

    if (operand && operand2) {
      if (operand.name == "humn" || operand2.name == "humn") return true;

      if (operand.getHumnYellOperands())
        return with_operands ? [operand, operand2] : true;

      if (operand2.getHumnYellOperands())
        return with_operands ? [operand2, operand] : true;

      return false;
    }

    throw new InputError(
      `For some unknown reason inputs 1 or 2 are unavailable for monkey ${this.name}.`
    );
  }
}

export default class Puzzle extends PuzzleHelper<number> {
  resolve() {
    const monkeys = new Map<string, Monkey>();

    this.cleanInput().forEach((monkey, id) => {
      const matched = monkey.match(
        /^(.*?):\s((.*?)\s([\/|*|+|-])\s(.*?)|\d+)$/
      );

      if (matched) {
        const [, monkey_name, ...yell] = matched.filter((x) => x);

        const monke = new Monkey(id, monkey_name, yell);

        monkeys.set(monkey_name, monke);
      }
    });

    monkeys.forEach((monke) => {
      const [operand1_or_number, operator, operand2] =
        monke.raw_input.slice(-3);

      if (!isNaN(+operand1_or_number)) {
        monke.yell = +operand1_or_number;
      } else {
        monke.yell = {
          operand: monkeys.get(operand1_or_number),
          operator,
          operand2: monkeys.get(operand2),
        };
      }
    });

    const root_monke = monkeys.get("root")!,
      humn_monke = monkeys.get("humn")!;

    const part_1_result = root_monke.getNumber();

    const [affected_operand, opposite_operand] = root_monke.getHumnYellOperands(
      true
    ) as Monkey[];

    const target_result = opposite_operand.getNumber();

    humn_monke.yell = 0;
    const test_1 = affected_operand.getNumber();

    humn_monke.yell = 1;
    const test_2 = affected_operand.getNumber();

    const increment_type = test_1 < test_2 ? 1 : -1;

    let startingNumber = 100_000_000_000_000,
      isUnderTarget = true;

    let part_2_result = 0;

    while (affected_operand.getNumber() !== target_result) {
      const humn_result = affected_operand.getNumber();

      if (humn_result > target_result) {
        if (isUnderTarget) startingNumber /= 10;

        isUnderTarget = false;

        part_2_result -= startingNumber * increment_type;
      } else if (humn_result < target_result) {
        if (!isUnderTarget) startingNumber /= 10;

        isUnderTarget = true;

        part_2_result += startingNumber * increment_type;
      }

      humn_monke.yell = part_2_result;
    }

    return [part_1_result, part_2_result];
  }
}
