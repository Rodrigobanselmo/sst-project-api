import fs from 'fs';

export const unlinkFilesPaths = async (paths: string[]) => {
  paths
    .filter((i) => !!i && typeof i == 'string')
    .forEach((path) => {
      try {
        fs.unlinkSync(path);
      } catch (e) {}
    });
};
