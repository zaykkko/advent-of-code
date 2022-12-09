import { PuzzleHelper } from "@utils/PuzzleHelper";
import { groupArray } from "@utils/Arrays";

export default class Puzzle extends PuzzleHelper<number> {
  readonly abecedario = "abcdefghijklmnopqrstuvwxyz".split("");
  readonly upper_offset = 26;

  getPriority(letter: string) {
    const is_upper = letter == letter.toUpperCase();

    const priority = this.abecedario.indexOf(letter.toLowerCase()) + 1;

    return is_upper ? priority + this.upper_offset : priority;
  }

  resolve() {
    let priority_sum = 0,
      group_priority_sum = 0;

    const cleaned_input = this.cleanInput();

    const rucksacks_compartments = cleaned_input.map((rucksack) => [
      rucksack.slice(0, rucksack.length / 2),
      rucksack.slice(rucksack.length / 2, rucksack.length),
    ]);
    rucksacks_compartments.forEach(([compartment1, compartment2]) => {
      let repeated_letter = "";

      for (let i = 0; i < compartment1.length; i++) {
        if (compartment2.indexOf(compartment1[i]) != -1) {
          repeated_letter = compartment1[i];
          break;
        }
      }

      priority_sum += this.getPriority(repeated_letter);
    });

    const rucksacks_grouped = groupArray<string>(cleaned_input, 3);
    rucksacks_grouped.forEach((rucksack_group) => {
      const [item_1, item_2, item_3] = rucksack_group.sort(
        (a, b) => a.length - b.length
      ); // let's loop the short one!
      let repeated_letter = "";

      for (let i = 0; i < item_1.length; i++) {
        const letter = item_1[i];

        if (item_2.indexOf(letter) != -1 && item_3.indexOf(letter) != -1) {
          repeated_letter = letter;
          break;
        }
      }

      group_priority_sum += this.getPriority(repeated_letter);
    });

    return [priority_sum, group_priority_sum];
  }
}
