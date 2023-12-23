<template>
    <NodeBase title="Upload Image" :color="NODE_ACTION" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput kind="image" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput kind="url" :dirty="dirty" :value="url" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_ACTION } from '~/lib/colors';

let input = ref(new Blob());
let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let dirty = ref(true);

let url = ref("");
let working = ref(false);

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();

    working.value = true;
    let formData = new FormData();
    formData.append("file", input.value);
    url.value = await $fetch("/api/upload_image", {
        method: "POST",
        body: formData,
    });
    working.value = false;
}
</script>
