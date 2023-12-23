<template>
    <NodeBase title="Combine" :color="NODE_LOCAL" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput name="First" kind="video" v-model:dirty="dirty" v-model="input_video_1" ref="video_element_1" />
        <SocketInput name="Last" kind="video" v-model:dirty="dirty" v-model="input_video_2" ref="video_element_2" />
        <SocketOutput kind="video" :dirty="dirty" :value="result_video" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_LOCAL } from '~/lib/colors';

let input_video_1 = ref(new Blob());
let input_video_2 = ref(new Blob());
let result_video = ref(new Blob());

let video_element_1: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let video_element_2: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let dirty = ref(true);
let working = ref(false);

async function calc() {
    let { load_ffmpeg } = await import("~/lib/video");
    let { fetchFile } = await import("@ffmpeg/util");

    dirty.value = false;
    await Promise.all([
        video_element_1.value?.calc(),
        video_element_2.value?.calc(),
    ]);

    working.value = true;
    await navigator.locks.request("ffmpeg", async () => {
        let ffmpeg = await load_ffmpeg();

        await ffmpeg.writeFile("input_1.mp4", await fetchFile(input_video_1.value));
        await ffmpeg.writeFile("input_2.mp4", await fetchFile(input_video_2.value));
        await ffmpeg.writeFile("list.txt", `
        file 'input_1.mp4'
        file 'input_2.mp4'
        `);
        await ffmpeg.exec([
            "-f", "concat",
            "-safe", "0",
            "-i", "list.txt",
            "-c", "copy",
            "output.mp4"
        ], 1000);
        let data = await ffmpeg.readFile("output.mp4");
        result_video.value = new Blob([data], { type: "video/mp4" })
    })

    working.value = false;
}
</script>
