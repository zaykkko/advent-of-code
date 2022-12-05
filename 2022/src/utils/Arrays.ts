export function groupArray<T>(arr: T[], n_items: number) {
  return arr.reduce((prev: T[][], current: T, index) => {
    if (index % n_items) {
      (prev[prev.length - 1] as T[]).push(current);
    } else {
      prev.push([current]);
    }

    return prev;
  }, []);
}
