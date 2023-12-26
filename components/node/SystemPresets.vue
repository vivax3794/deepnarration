<template>
    <NodeBase title="System Prompt" :color="NODE_CONSTANT" v-model:dirty="dirty" v-bind="$attrs">
        <SocketOutput kind="string" :calc="async () => { dirty = false }" :value="input" v-model:dirty="dirty" />
        <div style="width: 200px"></div>
        <v-select variant="outlined" v-model="input" :items="options"></v-select>
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_CONSTANT } from '~/lib/colors';

let input = ref("");
watch(input, () => dirty.value = true)
let dirty = ref(true);

const options = [
    {
        title: "Image Prompt",
        value: "You are a prompt generator. You take user input, which can be anything from stories to image descriptions, and write a prompt for a AI image generator to generate a fitting image."
    },
    {
        title: "Image Prompt - Remix",
        value: "You are a prompt generator. You take user input, which will be image descriptions, and write a prompt for a AI image generator to generate a related, but very different picture. to be clear you are NOT allowed to repeat back the same description, it has to describe a new image."
    },
    {
        title: "Story",
        value: "You are a story generator, keep your stories to two paragraphs max."
    }
]
</script>
