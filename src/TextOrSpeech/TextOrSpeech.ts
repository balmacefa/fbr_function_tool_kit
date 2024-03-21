import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech";

import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as tmp from 'tmp';

// Ensure you have the types for fluent-ffmpeg. If not, you might need to use any as a fallback for its types.

// Function to convert Base64 audio to MP3, with automatic cleanup



export class TextOrSpeech {
    private openai: OpenAI;

    constructor(openai?: OpenAI) {
        this.openai = openai || new OpenAI();
    }

    public async SpeechToText(base64Audio: string): Promise<string> {
        // Decode the base64 string to a Uint8Array
        const audioBuffer = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
        // Create a blob from the buffer, specifying the MIME type
        const audioBlob = new Blob([audioBuffer], { type: 'audio/ogg; codecs=opus' });
        // Create a File object from the Blob
        const audioFile = new File([audioBlob], "audio.ogg", { type: 'audio/ogg; codecs=opus', lastModified: new Date().getTime() });

        try {
            const transcription = await this.openai.audio.transcriptions.create({
                file: audioFile,
                model: "whisper-1",
                response_format: "text",
            });

            return transcription.text;
        } catch (error) {
            console.error("Error transcribing audio:", error);
            throw new Error("Failed to transcribe audio.");
        }
    }


    public async TextToSpeech(args: { input_text: string, voice_type?: SpeechCreateParams['voice'], hd_audio?: boolean }): Promise<{
        base64: string;
        mime_type: string;
    }> {
        const input_text = args.input_text;
        const voice_type = args.voice_type || "shimmer";
        const mp3 = await this.openai.audio.speech.create({
            model: args.hd_audio ? "tts-1-hd" : "tts-1",
            voice: voice_type,
            input: input_text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        const base64 = buffer.toString('base64');
        return {
            base64,
            mime_type: "audio/mpeg",
        };
    }

    convertBase64_ogg_AudioToMP3(base64Audio: string, outputFilePath: string): Promise<void> {
        // Decode Base64 to original binary data
        const audioBuffer = Buffer.from(base64Audio, 'base64');

        // Create a temporary file for the OGG audio
        const tempOggFile = tmp.fileSync({ postfix: '.ogg' });

        // Write the OGG audio to the temporary file
        fs.writeFileSync(tempOggFile.name, audioBuffer);


        // Return File object for the temporary mp3 file
        // Convert OGG to MP3 using ffmpeg
        return new Promise((resolve, reject) => {
            ffmpeg(tempOggFile.name)
                .setFfmpegPath(ffmpegStatic as string)
                .toFormat('mp3')
                .on('error', (err: Error) => {
                    console.error('An error occurred: ' + err.message);
                    // Ensure temporary file is cleaned up on error
                    tempOggFile.removeCallback();
                    reject(err);
                })
                .on('end', () => {
                    console.log('Conversion finished!');
                    // Clean up the temporary OGG file automatically
                    tempOggFile.removeCallback();
                    resolve();
                })
                .save(outputFilePath);
        });
    }
}

export default TextOrSpeech;
