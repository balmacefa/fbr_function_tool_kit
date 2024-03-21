import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function SpeechToText(base64_audio: string) {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream("/path/to/file/speech.mp3"),
        model: "whisper-1",
        response_format: "text",
    });

    const result =
        console.log(transcription.text);
}
