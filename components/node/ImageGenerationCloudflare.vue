<template>
    <NodeBase title="Ai - Image - Cloudflare" :color="NODE_AI" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput name="Prompt" kind="string" v-model:dirty="dirty" v-model="prompt" ref="prompt_element" />
        <SocketOutput kind="image" :dirty="dirty" :value="result" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_AI } from '~/lib/colors';
let dirty = ref(true);

let prompt_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let prompt = ref("")
let result = ref(new Blob())
let working = ref(false)

async function calc() {
    dirty.value = false;
    await prompt_element.value?.calc();

    working.value = true;
    result.value = await $fetch("/api/image_generation_cloudflare", { method: "POST", body: { prompt: prompt.value } })
    working.value = false;
}
</script>
