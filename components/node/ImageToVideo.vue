<template>
    <NodeBase title="Static Video" :color="NODE_LOCAL" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput kind="image" v-model:dirty="dirty" v-model="image" ref="image_element" />
        <SocketInput name="duration" kind="number" v-model:dirty="dirty" v-model="duration" ref="duration_element" />
        <SocketOutput kind="video" :dirty="dirty" :value="video" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_LOCAL } from '~/lib/colors';

let image = ref(new Blob());
let duration = ref(0);
let video = ref(new Blob());

let image_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let duration_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let dirty = ref(true);
let working = ref(false);

async function calc() {
    let { load_ffmpeg } = await import("~/lib/video");
    let { fetchFile } = await import("@ffmpeg/util");

    dirty.value = false;
    await Promise.all([
        image_element.value?.calc(),
        duration_element.value?.calc(),
    ]);

    working.value = true;

    await navigator.locks.request("ffmpeg", async () => {
        let ffmpeg = await load_ffmpeg();

        await ffmpeg.writeFile("input.png", await fetchFile(image.value));
        await ffmpeg.exec(["-framerate", `1/${duration.value}`, "-loop", "1", "-i", "input.png", "-t", duration.value.toString(), "-pix_fmt", "yuv420p", "-vf", "scale=1280:-2", "output.mp4"], 10000);
        let data = await ffmpeg.readFile("output.mp4");
        video.value = new Blob([data], { type: "video/mp4" })
    });

    working.value = false;

}
</script>
