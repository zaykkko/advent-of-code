import { PuzzleHelper } from "@utils/PuzzleHelper";

type Node = {
  value: number;
  index: number;
};

export default class Puzzle extends PuzzleHelper {
  readonly may_take_longer = true;

  private mixNodes(input: Node[], repeat = 1) {
    const mixed_input = [...input];

    for (let range = 0; range < repeat; range++) {
      input.forEach((node) => {
        const mixed_index = mixed_input.indexOf(node);
        const is_forward = node.value > 0;

        const fixed_steps = is_forward
          ? node.value % (input.length - 1)
          : -(Math.abs(node.value) % (input.length - 1));

        let new_index = mixed_index;
        for (let range = 0; range < Math.abs(fixed_steps); range++) {
          if (is_forward) {
            if (new_index == mixed_input.length - 1) new_index = 0; // circular last index <- 0, last index -> 0

            new_index++;
          } else {
            if (new_index == 0) new_index = mixed_input.length - 1;

            new_index--;
          }

          const node_index = mixed_input.findIndex(
            ({ index }) => index == node.index
          );

          mixed_input.splice(node_index, 1);
          mixed_input.splice(new_index, 0, node);
        }
      });
    }

    const zero_index = mixed_input.findIndex((node) => node.value == 0);

    return Array.from({ length: 3 }, (_, n) => ++n * 1000).reduce(
      (prev, index) =>
        prev + mixed_input[(zero_index + index) % mixed_input.length].value,
      0
    );
  }

  resolve() {
    const numbers = this.cleanInput().map((n) => +n);
    const input_1: Node[] = numbers.map((value, index) => ({ value, index }));
    const input_2: Node[] = structuredClone(input_1).map((node) => ({
      ...node,
      value: node.value * 811589153,
    }));

    const part_1_result = this.mixNodes(input_1);
    const part_2_result = this.mixNodes(input_2, 10);

    return [part_1_result, part_2_result];
  }
}
