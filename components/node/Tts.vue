
<template>
    <NodeBase title="Tts" :color="NODE_AI" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput kind="string" v-model:dirty="dirty" v-model="text" ref="input_element" />
        <SocketOutput kind="audio" :dirty="dirty" :value="result" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_AI } from '~/lib/colors';
let dirty = ref(true);

let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let text = ref("")
let result = ref(new Blob())
let working = ref(false)

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();

    working.value = true;
    result.value = await $fetch(`https://api.streamelements.com/kappa/v2/speech?voice=Amy&text=${text.value}`);
    working.value = false;
}
</script>
