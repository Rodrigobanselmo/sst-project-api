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

// Formatos de áudio do iPhone que devem ser convertidos para MP3
const AUDIO_FORMATS_TO_CONVERT = ['m4a', 'caf', 'aac', 'aiff', '3gp'];

// Formatos de vídeo do iPhone que devem ser convertidos para MP4
const VIDEO_FORMATS_TO_CONVERT = ['mov', 'hevc', '3gp'];

export interface MediaConversionResult {
  outputPath: string;
  newExtension: string;
}

export function getMediaConversionInfo(extension: string): { shouldConvert: boolean; targetFormat: 'mp3' | 'mp4' | null; targetExtension: string | null } {
  const ext = extension.toLowerCase();

  if (AUDIO_FORMATS_TO_CONVERT.includes(ext)) {
    return { shouldConvert: true, targetFormat: 'mp3', targetExtension: 'mp3' };
  }

  if (VIDEO_FORMATS_TO_CONVERT.includes(ext)) {
    return { shouldConvert: true, targetFormat: 'mp4', targetExtension: 'mp4' };
  }

  return { shouldConvert: false, targetFormat: null, targetExtension: null };
}

export function convertMediaFile(inputPath: string, outputPath: string, targetFormat: 'mp3' | 'mp4'): Promise<string> {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    if (targetFormat === 'mp3') {
      command = command.toFormat('mp3').audioCodec('libmp3lame').audioBitrate('128k');
    } else if (targetFormat === 'mp4') {
      command = command.toFormat('mp4').videoCodec('libx264').audioCodec('aac').outputOptions(['-movflags', 'faststart']);
    }

    command
      .on('error', (err: Error) => {
        console.error(`An error occurred during conversion: ${err.message}`);
        reject(err);
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .save(outputPath);
  });
}
