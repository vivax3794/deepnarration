<template>
    <NodeBase title="Discord webhook" :color="NODE_ACTION" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <v-btn @click="calc">Send</v-btn>
        <SocketInput name="Url" kind="string" v-model:dirty="dirty" v-model="url" ref="url_element" />
        <SocketInput name="Message" kind="string" v-model:dirty="dirty" v-model="message" ref="message_element" />
        <SocketInput name="Image" kind="image" v-model:dirty="dirty" v-model="image" ref="image_element" />
        <SocketInput name="Video" kind="video" v-model:dirty="dirty" v-model="video" ref="video_element" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_ACTION } from '~/lib/colors';
let dirty = ref(true);

let url_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let message_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let image_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let video_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let url = ref("");
let message = ref("")
let image = ref(new Blob())
let video = ref(new Blob())

let working = ref(false)

async function calc() {
    dirty.value = false;
    await Promise.all([
        url_element.value?.calc(),
        message_element.value?.calc(),
        image_element.value?.calc(),
        video_element.value?.calc(),
    ]);

    working.value = true;

    let formData = new FormData();
    formData.append("payload_json", JSON.stringify({ content: message.value }))

    if (image.value !== undefined && image.value.size !== 0) formData.append("file", image.value, "result.png")
    if (video.value !== undefined && video.value.size !== 0) formData.append("file", video.value, "result.mp4")

    await $fetch(url.value, {
        method: "POST",
        body: formData
    });
    working.value = false;
}
</script>
