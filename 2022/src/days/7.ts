import { PuzzleHelper } from "@utils/PuzzleHelper";
import { PuzzleError } from "@utils/PuzzleError";

type FolderType = {
  name: string;
  files: (string | FolderType)[];
};

type FolderDirSizeType = {
  name: string;
  size: number;
};

class Directory {
  private files: Map<string, File | Directory> = new Map();

  constructor(readonly name: string) {}

  stringify() {
    const directory_arr: (string | FolderType)[] = [];

    for (const file_or_folder of this.files.values()) {
      if (file_or_folder instanceof Directory) {
        const directory = file_or_folder.stringify();
        directory_arr.push({
          name: file_or_folder.name,
          files: directory,
        });
      } else {
        directory_arr.push(file_or_folder.toString());
      }
    }

    return directory_arr;
  }

  size_of_directories(is_root = false): [number, FolderDirSizeType[]] {
    const sub_directories_with_sizes: FolderDirSizeType[] = [];
    let this_directory_size = 0;

    for (const file_or_folder of this.files.values()) {
      if (file_or_folder instanceof Directory) {
        const [size_of_directories_there, directories] =
          file_or_folder.size_of_directories() as [number, FolderDirSizeType[]];
        sub_directories_with_sizes.push(...directories);
        this_directory_size += size_of_directories_there;
      } else {
        this_directory_size += file_or_folder.size;
      }
    }

    if (!is_root) {
      sub_directories_with_sizes.push({
        name: this.name,
        size: this_directory_size,
      });
    }

    return [this_directory_size, sub_directories_with_sizes];
  }

  get_file(file_name: string): File | null {
    const file = this.files.get(file_name);

    if (file instanceof File) {
      return file as File;
    }

    return null;
  }

  get_dir(dir_name: string): Directory | null {
    const directory = this.files.get(dir_name);

    if (directory instanceof Directory) {
      return directory as Directory;
    }

    return null;
  }

  add(file: Directory | File, dir_path: string[]) {
    const [, target_path, ...left_path] = dir_path;

    if (!target_path) {
      this.files.set(file.name, file);
    } else {
      const directory = this.get_dir(target_path);

      if (!directory) {
        throw new PuzzleError(
          `Unable to add ${
            file.name
          } in the dir ${target_path} because it doesn't exists!!!11\nFull path: ${dir_path.join(
            "/"
          )}`
        );
      }

      directory.add(file, [target_path, ...left_path]);
    }
  }

  toString() {
    return `${this.name} (dir)`;
  }
}

class File {
  constructor(readonly size: number, readonly name: string) {}

  toString() {
    return `${this.name} (file, size=${this.size})`;
  }
}

export default class Puzzle extends PuzzleHelper<number> {
  readonly DISK_SPACE = 70000000;
  readonly UPDATE_REQUIRED_SPACE = 30000000;
  readonly MAX_DIR_SIZE = 100000;

  protected disk: Directory = new Directory("/");

  resolve() {
    let is_reading = false,
      current_dir: string[] = [""];

    this.cleanInput().forEach((line) => {
      const [cmd, arg] = line.replace(/\$\s/, "").split(/\s/);

      switch (cmd) {
        case "cd":
          is_reading = false;
          if (arg == "..") {
            current_dir = current_dir.slice(0, current_dir.length - 1);
          } else if (arg != "/") {
            current_dir.push(arg);
          }
          break;
        case "ls":
          is_reading = true;
          break;
        default:
          if (is_reading) {
            if (cmd == "dir") {
              const dir = new Directory(arg);
              this.disk.add(dir, current_dir);
            } else {
              // on a file case the "cmd" arg is the file size and the "arg" arg is the file name. :)
              const file = new File(+cmd, arg);
              this.disk.add(file, current_dir);
            }
          }
          break;
      }
    });

    const [used_disk_size, size_of_diretories_in_disk] =
      this.disk.size_of_directories(true);
    const part1_sum = size_of_diretories_in_disk
      .filter((directory) => directory.size < this.MAX_DIR_SIZE)
      .reduce((prev: number, current) => prev + current.size, 0);

    const available_disk_space = this.DISK_SPACE - used_disk_size;
    const left_required_space =
      this.UPDATE_REQUIRED_SPACE - available_disk_space;

    const candidates_to_be_deleted = size_of_diretories_in_disk
      .filter((dir) => dir.size >= left_required_space)
      .sort((a, b) => a.size - b.size);
    const part_2_smallest = candidates_to_be_deleted[0].size;

    return [part1_sum, part_2_smallest];
  }
}
