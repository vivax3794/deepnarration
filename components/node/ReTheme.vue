<template>
    <NodeBase title="Ai - ReTheme Image" :color="NODE_AI" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <SocketInput name="Cache" kind="cache" v-model:dirty="dirty" ref="cache_element" :model-value="null" />
        <SocketInput name="Prompt" kind="string" v-model:dirty="dirty" v-model="prompt" ref="prompt_element" />
        <SocketInput name="Original image" kind="url" v-model:dirty="dirty" v-model="image" ref="image_element" />
        <SocketOutput name="image" kind="image" :dirty="dirty" :value="result" :calc="calc" :working="working" />
        <SocketOutput name="url" kind="url" :dirty="dirty" :value="url" :calc="calc" :working="working" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import pRetry from 'p-retry';
import { NODE_AI } from '~/lib/colors';
import { limit_to_one } from "~/lib/async_cache";
let dirty = ref(true);

let prompt_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let cache_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let image_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let prompt = ref("")
let result = ref("")
let image = ref("")
let url = ref("")
let working = ref(false)

const DISCORD_ID = "366331361583169537"

const calc = limit_to_one(async () => {
    dirty.value = false;
    await Promise.all([
        cache_element.value?.calc(),
        prompt_element.value?.calc(),
        image_element.value?.calc(),
    ]);

    working.value = true;
    url.value = await $fetch("https://deepnarrationapi.matissetec.dev/startRethemeImage", {
        method: "POST",
        body: {
            prompt: prompt.value,
            targetPicture: image.value,
            discordId: DISCORD_ID,
            discordUsername: "vivax",
        }
    }).catch((err) => console.log(err));

    // TODO: Matisse is shit
    // url.value = `https://imagegenerator.matissetec.dev/output/createImage/${job_id}`;
    result.value = await pRetry(() => $fetch(url.value), {
        forever: true,
        minTimeout: 1000,
        maxTimeout: 5000,
        factor: 1.2,
        randomize: true,
    })

    working.value = false;
})
</script>
