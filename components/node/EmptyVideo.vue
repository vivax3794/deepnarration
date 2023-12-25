<template>
    <NodeBase title="Empty Video" :color="NODE_CONSTANT" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketOutput kind="video" :dirty="dirty" :value="video" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_CONSTANT } from '~/lib/colors';

let video = ref(new Blob());

let dirty = ref(true);
let working = ref(false);

async function calc() {
    let { load_ffmpeg } = await import("~/lib/video");

    dirty.value = false;
    working.value = true;

    await navigator.locks.request("ffmpeg", async () => {
        let ffmpeg = await load_ffmpeg();

        // fmpeg -f lavfi -i color=c=black:s=1280x720:r=25:d=0.04 -c:v libx264 -pix_fmt yuv420p -t 1 one_frame.mp4
        await ffmpeg.exec([
            "-f", "lavfi",
            "-t", "0.04",
            "-i", "color=c=black:s=1280x720:r=25:d=0.04",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            'output.mp4'
        ], 1000);
        let data = await ffmpeg.readFile("output.mp4");
        video.value = new Blob([data], { type: "video/mp4" })
    });

    working.value = false;

}
</script>
