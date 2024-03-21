import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech";

const openai = new OpenAI();

export async function SpeechToText(base64_audio: string): Promise<string> {
    // 'audio/ogg; codecs=opus'

    const base64_file = new Blob([Buffer.from(base64_audio, 'base64')]);

    const file = new File([base64_file], "audio.ogg", { type: 'audio/ogg; codecs=opus', lastModified: Date.now() });

    const transcription = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
        response_format: "text",
    });

    const text = transcription.text;
    return text;
}

export async function TextToSpeech(args: { input_text: string, voice_type?: SpeechCreateParams['voice'], hd_audio?: boolean }): Promise<{
    base64: string;
    mime_type: string;
}> {
    const input_text = args.input_text;
    const voice_type = args.voice_type || "shimmer";
    const mp3 = await openai.audio.speech.create({
        model: args.hd_audio ? "tts-1-hd" : "tts-1",
        voice: voice_type,
        input: input_text,
    });
    //speech.mp3
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const base64 = buffer.toString('base64');
    return {
        base64,
        mime_type: "audio/mpeg",
    };

}
