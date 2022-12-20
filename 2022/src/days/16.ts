import { PuzzleHelper } from "@utils/PuzzleHelper";

class Valve {
  leads_to: Valve[] = [];
  steps_by_valves: Record<number, number> = {};

  constructor(
    readonly name: string,
    readonly id: number,
    readonly flow: number,
    readonly raw_paths: string[]
  ) {}
}

export default class Puzzle extends PuzzleHelper<number> {
  protected start_valve_name = "AA";

  protected start_valve?: Valve;
  protected valves: Valve[] = [];
  protected valves_with_flow: Valve[] = [];

  getStepsFor(valve: Valve, path: number[] = []) {
    const steps_by_valve = new Map<number, number>();

    valve.leads_to.forEach((valve2) => {
      if (path.includes(valve2.id)) return;

      const steps =
        valve2.flow > 0
          ? { [valve2.id]: 0 }
          : this.getStepsFor(valve2, path.concat(valve.id));

      const steps_by_valve2 = Object.keys(steps).map(Number);

      steps_by_valve2.forEach((id) => {
        steps_by_valve.set(
          id,
          Math.min(steps[id] + 1, steps_by_valve.get(id) ?? steps[id] + 1)
        );
      });
    });

    steps_by_valve.delete(valve.id);

    return Object.fromEntries(steps_by_valve);
  }

  findShortestPathFrom(start_valve: Valve) {
    const visited = new Map<string, number>();

    const queue: [Valve, number][] = [[start_valve, 0]];

    while (queue.length) {
      const target_valve = queue.shift();

      if (target_valve) {
        const [next, steps] = target_valve;

        // la idea es recordear la cantidad mínima de pasos de un path específico
        if (visited.has(next.name) && steps >= visited.get(next.name)!) {
          continue;
        }

        visited.set(next.name, steps);

        const steps_by_valve = Object.keys(next.steps_by_valves).map(Number);

        steps_by_valve.forEach((valve_id) =>
          queue.push([
            this.valves[valve_id],
            steps + next.steps_by_valves[valve_id],
          ])
        );
      }
    }

    visited.delete(start_valve.name);

    return Object.fromEntries(visited);
  }

  getMaxPressure(start_valve: Valve, startTime: number) {
    const shortestPaths = this.valves_with_flow.concat(start_valve).reduce(
      (prev, current) => ({
        ...prev,
        [current.name]: this.findShortestPathFrom(current),
      }),
      {} as Record<string, Record<string, number>>
    );

    const scores: [number[], number][] = [];
    const r_queue: [number[], string, number, number][] = [
      [[] as number[], start_valve.name, startTime, 0],
    ];

    while (r_queue.length) {
      const current_valve = r_queue.pop();

      if (current_valve) {
        const [visited, next, current_time, pressure] = current_valve;

        this.valves_with_flow.forEach((valve) => {
          if (!visited.includes(valve.id)) {
            scores.push([visited, pressure]);

            const steps = shortestPaths[next][valve.name],
              after_time = current_time - steps - 1;

            if (after_time > 0) {
              r_queue.push([
                visited.concat(valve.id),
                valve.name,
                after_time,
                pressure + after_time * valve.flow,
              ]);
            }
          }
        });
      }
    }

    return scores.sort((a, b) => b[1] - a[1]);
  }

  resolve() {
    this.cleanInput().forEach((row, index) => {
      const valves_matched = row.match(/[A-Z]{2}/g),
        flow_matched = row.match(/\d+/g);

      if (valves_matched && flow_matched) {
        const [name, ...leads_to] = valves_matched,
          flow = +flow_matched[0];

        const valve = new Valve(name, index, flow, leads_to);

        this.valves.push(valve);

        if (name == this.start_valve_name) {
          this.start_valve = valve;
        } else if (flow > 0) {
          this.valves_with_flow.push(valve);
        }
      }
    });

    // append the real valves class refs into valves.leads_to to all valves
    this.valves.forEach((valve) => {
      valve.raw_paths.forEach((valve_name) => {
        valve.leads_to.push(
          this.valves.find(
            ({ name: found_name }) => found_name == valve_name
          ) ?? this.valves[0]
        );
      });
    });

    // append how many steps gonna take walk from one valve to another (obviously the adjacent ones for each valve)
    this.valves.forEach((valve) => {
      valve.steps_by_valves = this.getStepsFor(valve);
    });

    const part_1_result = this.getMaxPressure(this.start_valve!, 30)[0][1];
    const candidates = this.getMaxPressure(this.start_valve!, 26).filter(
      ([, score]) => score
    );

    // used the u/ekwoka part2 solution
    const part_2_result = candidates.reduce((best, [path, score], i) => {
      if (score < ((best / 2) | 0)) return best;
      const splitPoint =
        best === 0
          ? undefined
          : Math.max(
              0,
              candidates.findIndex((candidate) => candidate[1] + score < best) +
                1 -
                i
            );

      const noOverlap = candidates
        .slice(i, splitPoint)
        .find((helper) => helper[0].every((valve) => !path.includes(valve)));
      if (!noOverlap) return best;
      return Math.max(best, noOverlap[1] + score);
    }, 0);

    return [part_1_result, part_2_result];
  }
}
