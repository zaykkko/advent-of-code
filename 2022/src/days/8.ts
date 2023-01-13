import { PuzzleHelper } from "@utils/PuzzleHelper";

export default class Puzzle extends PuzzleHelper {
  // Not the performant way to resolve this, but hey I'm practicing and learning hehe
  resolve() {
    const grid = this.cleanInput().map((row) => row.split("").map(Number));

    let visible_trees = (grid.length + grid[0].length) * 2 - 4,
      best_tree_score = 0; // le restamos las 4 esquinas que son las que se overlapean

    const grid_height = grid.length,
      grid_width = grid[0].length;

    grid.forEach((row, row_index) => {
      row.forEach((current_tree_height, column_index) => {
        if (
          row_index == 0 ||
          row_index == grid_height - 1 ||
          column_index == 0 ||
          column_index == grid_width - 1
        )
          return;

        const left_trees = grid[row_index].slice(0, column_index),
          right_trees = grid[row_index].slice(column_index + 1, grid_width),
          // https://stackoverflow.com/a/47064373/10942774 :*
          top_trees = grid
            .filter((_, index) => index < row_index)
            .map((tree_row) => tree_row.slice(column_index, column_index + 1))
            .flat(),
          bottom_trees = grid
            .filter((_, index) => index > row_index)
            .map((tree_row) => tree_row.slice(column_index, column_index + 1))
            .flat();

        let top_visible = true,
          right_visible = true,
          left_visible = true,
          bottom_visible = true;

        let left_view_score_looping = true,
          top_view_score_looping = true,
          left_view_score = 0,
          right_view_score = 0,
          top_view_score = 0,
          bottom_view_score = 0;

        left_trees.forEach((tree_height, column_index_2) => {
          left_visible = left_visible && current_tree_height > tree_height;

          if (left_view_score_looping) {
            const reversed_column_index =
              left_trees.length - 1 - column_index_2;

            left_view_score_looping =
              current_tree_height > left_trees[reversed_column_index];
            left_view_score++;
          }
        });

        right_trees.forEach((tree_height) => {
          if (right_visible) right_view_score++;

          right_visible = right_visible && current_tree_height > tree_height;
        });

        top_trees.forEach((tree_height, column_index_2) => {
          top_visible = top_visible && current_tree_height > tree_height;

          if (top_view_score_looping) {
            const reversed_column_index = top_trees.length - 1 - column_index_2;

            top_view_score_looping =
              current_tree_height > top_trees[reversed_column_index];
            top_view_score++;
          }
        });

        bottom_trees.forEach((tree_height) => {
          if (bottom_visible) bottom_view_score++;

          bottom_visible = bottom_visible && current_tree_height > tree_height;
        });

        const total_view_score =
          left_view_score *
          bottom_view_score *
          right_view_score *
          top_view_score;

        if (total_view_score > best_tree_score)
          best_tree_score = total_view_score;

        if (left_visible || right_visible || bottom_visible || top_visible) {
          visible_trees++;
        }
      });
    });

    return [visible_trees, best_tree_score];
  }
}
