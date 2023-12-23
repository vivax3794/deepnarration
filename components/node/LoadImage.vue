<template>
    <NodeBase title="Load Image" :color="NODE_ACTION" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput name="Url" kind="url" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput kind="image" :dirty="dirty" :value="image" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_ACTION } from '~/lib/colors';

let input = ref("");
let image = ref(new Blob());
let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let dirty = ref(true);

let working = ref(false);

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();

    working.value = true;
    image.value = await $fetch(input.value).catch((err) => console.log(err));
    working.value = false;
}
</script>

