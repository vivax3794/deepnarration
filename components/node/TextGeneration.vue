<template>
    <NodeBase title="Ai - Text" :color="NODE_AI" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput name="System Prompt" kind="string" v-model:dirty="dirty" v-model="system" ref="system_element" />
        <SocketInput name="Prompt" kind="string" v-model:dirty="dirty" v-model="prompt" ref="prompt_element" />
        <SocketOutput kind="string" :dirty="dirty" :value="result" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_AI } from '~/lib/colors';
let dirty = ref(true);

let system_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let prompt_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let prompt = ref("")
let system = ref("")
let result = ref("")
let working = ref(false)

async function calc() {
    dirty.value = false;
    await Promise.all([
        system_element.value?.calc(),
        prompt_element.value?.calc(),
    ]);

    working.value = true;
    result.value = await $fetch("/api/text_generation", { method: "POST", body: { prompt: prompt.value, system: system.value ? system.value : undefined } })
    working.value = false;
}
</script>
