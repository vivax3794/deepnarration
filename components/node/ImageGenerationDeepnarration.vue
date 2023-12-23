<template>
    <NodeBase title="Ai - Image - Deepnarration" :color="NODE_AI" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput name="Prompt" kind="string" v-model:dirty="dirty" v-model="prompt" ref="prompt_element" />
        <SocketOutput name="image" kind="image" :dirty="dirty" :value="result" :calc="calc" />
        <SocketOutput name="url" kind="url" :dirty="dirty" :value="url" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import pRetry from 'p-retry';
import { NODE_AI } from '~/lib/colors';
let dirty = ref(true);

let prompt_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let prompt = ref("")
let result = ref("")
let url = ref("")
let working = ref(false)

const DISCORD_ID = "366331361583169537"

async function calc() {
    dirty.value = false;
    await prompt_element.value?.calc();

    working.value = true;
    let job_id: string = await $fetch("https://deepnarrationapi.matissetec.dev/startCreateImage", {
        method: "POST",
        body: {
            prompt: prompt.value,
            discordId: DISCORD_ID,
            discordUsername: "vivax",
        }
    }).catch((err) => console.log(err));

    // TODO: Matisse is shit
    url.value = `https://imagegenerator.matissetec.dev/output/createImage/${job_id}`;
    result.value = await pRetry(() => $fetch(url.value), {
        forever: true,
        minTimeout: 1000,
        maxTimeout: 5000,
        factor: 1.2,
        randomize: true,
    })

    working.value = false;
}
</script>
