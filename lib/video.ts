import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
let loaded = false;

export async function load_ffmpeg(): Promise<FFmpeg> {
    /// Clear out memory? 
    ffmpeg.terminate()
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.5/dist/esm';
    ffmpeg.on("log", ({ message }) => {
        console.log(message)
    });
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    })
    loaded = true;
    return ffmpeg
}
