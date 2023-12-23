
<template>
    <NodeBase title="Duration" :color="NODE_LOCAL" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput kind="audio" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput kind="number" :dirty="dirty" :value="duration" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_LOCAL } from '~/lib/colors';

let input = ref(new Blob());
let duration = ref(0);
let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let dirty = ref(true);

// https://stackoverflow.com/a/73874283
const getDuration = async (file: Blob): Promise<number> => {
    const url = URL.createObjectURL(file);

    return new Promise((resolve) => {
        const audio = document.createElement("audio");
        audio.muted = true;
        const source = document.createElement("source");
        source.src = url; //--> blob URL
        audio.preload = "metadata";
        audio.appendChild(source);
        audio.onloadedmetadata = function () {
            resolve(audio.duration)
        };
    });
}

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();
    duration.value = await getDuration(input.value);
}
</script>
