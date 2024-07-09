import ffmpeg from 'fluent-ffmpeg';

export function convert3gpToMp3(inputPath: string, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('error', (err: Error) => {
        console.error(`An error occurred: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .save(outputPath);
  });
}

// Example usage
// const inputPath = 'src/audio.3gp'; // Path to the input 3GP file
// const outputPath = 'src/output.mp3'; // Path for the output MP3 file

// convert3gpToMp3(inputPath, outputPath)
//     .then((outputPath) => console.log(`File has been converted successfully: ${outputPath}`))
//     .catch((error) => console.error(`Failed to convert file: ${error.message}`));
