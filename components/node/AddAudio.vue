<template>
    <NodeBase title="Add Audio" :color="NODE_LOCAL" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput kind="video" v-model:dirty="dirty" v-model="input_video" ref="video_element" />
        <SocketInput kind="audio" v-model:dirty="dirty" v-model="audio" ref="audio_element" />
        <SocketOutput kind="video" :dirty="dirty" :value="result_video" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_LOCAL } from '~/lib/colors';

let input_video = ref(new Blob());
let audio = ref(new Blob());
let result_video = ref(new Blob());

let video_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let audio_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let dirty = ref(true);
let working = ref(false);

async function calc() {
    let { load_ffmpeg } = await import("~/lib/video");
    let { fetchFile } = await import("@ffmpeg/util");

    dirty.value = false;
    await Promise.all([
        video_element.value?.calc(),
        audio_element.value?.calc(),
    ]);

    working.value = true;
    await navigator.locks.request("ffmpeg", async () => {
        let ffmpeg = await load_ffmpeg();

        await ffmpeg.writeFile("input.mp4", await fetchFile(input_video.value));
        await ffmpeg.writeFile("input.mp3", await fetchFile(audio.value));
        await ffmpeg.exec([
            "-i", "input.mp4",
            "-i", "input.mp3",
            "-c:v", "copy",
            "-c:a", "copy",
            "-map", "0:v:0",
            "-map", "1:a:0",
            "output.mp4"
        ], 1000);
        let data = await ffmpeg.readFile("output.mp4");
        result_video.value = new Blob([data], { type: "video/mp4" })
    })

    working.value = false;
}
</script>
