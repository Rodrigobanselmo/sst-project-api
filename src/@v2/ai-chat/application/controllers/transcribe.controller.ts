import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import OpenAI from 'openai';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

const SUPPORTED_FORMATS = ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/wav', 'audio/ogg', 'audio/flac'];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (Whisper API limit)

@Controller('ai-chat')
export class TranscribeController {
  @Post('transcribe')
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: {
        fileSize: MAX_FILE_SIZE, // 25MB hard limit at Multer level
      },
    }),
  )
  async transcribe(@User() _user: UserPayloadDto, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No audio file provided');

    if (!SUPPORTED_FORMATS.some((format) => file.mimetype.startsWith(format))) {
      throw new BadRequestException(`Unsupported audio format: ${file.mimetype}`);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File too large. Maximum size is 25MB');
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new BadRequestException('OpenAI API key not configured');
    }

    const openai = new OpenAI({ apiKey });

    const audioFile = new File([file.buffer], file.originalname, { type: file.mimetype });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
    });

    return { text: transcription, success: true };
  }
}
