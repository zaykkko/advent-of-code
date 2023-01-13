import { PuzzleHelper } from "@utils/PuzzleHelper";

interface Sensor {
  sensor_x: number;
  sensor_y: number;
  beacon_x: number;
  beacon_y: number;
  manhattan: number;
}

export default class Puzzle extends PuzzleHelper {
  readonly part_1_target_y = 2_000_000;
  readonly part_2_max_y = 4_000_000;

  resolve() {
    let min_x = Infinity,
      max_x = -Infinity;
    const sensors = [] as Sensor[];

    this.cleanInput().forEach((line) => {
      const line_match = line.match(/-?\d+/g);

      if (line_match) {
        const [sensor_x, sensor_y, beacon_x, beacon_y] = line_match.map(Number);

        min_x = Math.min(min_x, sensor_x, beacon_x);
        max_x = Math.max(max_x, sensor_x, beacon_x);

        sensors.push({
          sensor_x,
          sensor_y,
          beacon_x,
          beacon_y,
          manhattan:
            Math.abs(sensor_x - beacon_x) + Math.abs(sensor_y - beacon_y),
        });
      }
    });

    let empty_spots = 0;
    const max_manhattan =
      sensors.reduce(
        (prev, sensor) => (sensor.manhattan > prev ? sensor.manhattan : prev),
        0
      ) * 2;

    for (let x = min_x - max_manhattan; x <= max_x + max_manhattan; x++) {
      if (
        sensors.some(
          ({ beacon_x, beacon_y }) =>
            beacon_x == x && beacon_y == this.part_1_target_y
        )
      ) {
        continue;
      }

      for (const { sensor_x, sensor_y, manhattan } of sensors) {
        if (
          Math.abs(x - sensor_x) + Math.abs(this.part_1_target_y - sensor_y) <=
          manhattan
        ) {
          empty_spots++;
          break;
        }
      }
    }

    let target_x = 0,
      target_y = 0;

    for (let y = 0; y <= this.part_2_max_y; y++) {
      const ranges = [] as number[][];

      sensors.forEach(({ sensor_x, sensor_y, manhattan }) => {
        const distanceFromSensor = Math.abs(y - sensor_y);

        if (manhattan > distanceFromSensor) {
          const offsetX = manhattan - distanceFromSensor;

          ranges.push([
            Math.max(sensor_x - offsetX, 0),
            Math.min(sensor_x + offsetX, this.part_2_max_y),
          ]);
        }
      });

      let range_x1 = 0;

      while (true) {
        if (
          !ranges.some(([x1, x2]) => {
            if (x1 - 1 <= range_x1 && range_x1 < x2) {
              range_x1 = x2;
              return true;
            }

            return false;
          })
        ) {
          break;
        }
      }

      if (range_x1 != this.part_2_max_y) {
        target_x = range_x1;
        target_y = y;
        break;
      }
    }

    const freq = (target_x + 1) * 4_000_000 + target_y;

    return [empty_spots, freq];
  }
}
