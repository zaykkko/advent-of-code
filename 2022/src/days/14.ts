import { PuzzleHelper } from "@utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper<number> {
  readonly sand_pound_start_pos = [500, 0];

  resolve() {
    //por temas de visualización almacenar el mínimo x y máximo x, y la profundidad de "y" nada más el máximo ya que el punto de inicio siempre es 0 en dicho eje y pues, siempre va a ser el valor más bajo xd
    let max_width = 0,
      max_height = 0;

    const rocks_pos = new Set<string>();

    this.cleanInput().forEach((line) => {
      const lines = line.split(/\s->\s/);

      // skip last one cause its already in the set heh
      for (let i = 0; i < lines.length - 1; i++) {
        const position = lines[i];
        const [x, y] = position.split(",").map(Number);
        const [next_x, next_y] = lines[i + 1].split(",").map(Number);

        max_height = Math.max(max_height, y, next_y);
        max_width = Math.max(max_width, x, next_x);

        if (x == next_x) {
          const max_y = Math.max(y, next_y),
            min_y = Math.min(y, next_y);

          for (let j = min_y; j <= max_y; j++) {
            rocks_pos.add(`${x},${j}`);
          }
        } else {
          const max_x = Math.max(x, next_x),
            min_x = Math.min(x, next_x);

          for (let j = min_x; j <= max_x; j++) {
            rocks_pos.add(`${j},${y}`);
          }
        }
      }
    });

    // copiar las posiciones de las piedras para que no sea necesario hacer condicionales extras para verificar si una posición xy está ocupada por arena o por alguna pared (más que nada por lo último xd)
    const occupied_pos = new Set(rocks_pos);
    let total_sand_part1 = 0,
      total_sand_part2 = 0;

    while (true) {
      let [x, y] = this.sand_pound_start_pos;

      // "until a unit of sand comes to rest at 500,0" // check every time we gonna add sand
      if (occupied_pos.has(this.sand_pound_start_pos.join(","))) {
        total_sand_part2 = occupied_pos.size - rocks_pos.size;
        break;
      }

      while (true) {
        if (
          !total_sand_part1 &&
          y == max_height &&
          occupied_pos.size > rocks_pos.size
        ) {
          total_sand_part1 = occupied_pos.size - rocks_pos.size;
          break;
        }

        //"two plus the highest y coordinate o" // two - 1 cause that one is the floor, so 2 - 1 = 1 + highest y coordinate :)
        if (y == max_height + 1) {
          occupied_pos.add(`${x},${y}`);
          break;
        }

        if (!occupied_pos.has(`${x},${y + 1}`)) {
          // se puede continuar descendiendo?
          y++;
        } else if (!occupied_pos.has(`${x - 1},${y + 1}`)) {
          // se puede continuar descendiendo hacia la izquierda?
          x--;
          y++;
        } else if (!occupied_pos.has(`${x + 1},${y + 1}`)) {
          // se puede continuar descendiendo hacia la derecha?
          x++;
          y++;
        } else {
          // profundiad máxima ya q se choca con una piedra, asi q la sand se queda there
          occupied_pos.add(`${x},${y}`);
          break;
        }
      }
    }

    return [total_sand_part1, total_sand_part2]; //14302 ?????
  }
}
