<template>
    <NodeBase title="Fold End" :color="NODE_CONTROL_FLOW" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <div style="width: 200px"></div>
        <SocketInput name="Repeats" kind="number" v-model:dirty="dirty" v-model="repeats" ref="repeats_element" />
        <SocketInput name="Fold" kind="fold" v-model:dirty="fold_dirty" v-model="fold_data" ref="fold_element" />
        <SocketInput v-for="index in value_kinds.length" generic :name="`Result ${index}`"
            v-model:kind="value_kinds[index - 1]" v-model:dirty="input_dirty[index - 1]" v-model="result_values[index - 1]"
            ref="result_elements" />

        <SocketOutput v-for="index in value_kinds.length " :name="`Final ${index}`" :kind="value_kinds[index - 1]"
            :dirty="dirty" :value="result_values[index - 1]" :calc="calc" />

        <v-progress-linear :max="repeats" v-model="current"></v-progress-linear>
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_CONTROL_FLOW } from '~/lib/colors';
import { watch } from 'vue';
import { limit_to_one } from '~/lib/async_cache';

let dirty = ref(true);
let fold_dirty = ref(false);
let working = ref(false);
watch(fold_dirty, async () => {
    if (fold_dirty.value) {
        dirty.value = true;
        fold_dirty.value = false;
        await fold_element.value?.calc();
        if (fold_data.value !== undefined) {
            value_kinds.value = fold_data.value?.data_kinds;
        }
    };
}, { immediate: true })

let value_kinds = ref([])
let result_values: Ref<any[]> = ref([undefined]);
let result_elements: Ref<(InstanceType<typeof SocketInput> | null)[]> = ref([null]);
let input_dirty: Ref<boolean[]> = ref([true]);

let fold_data: Ref<any> = ref(undefined);

let repeats = ref(0);
let repeats_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let fold_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let resolve_dirty_promise: ((value: null) => void) | null = null;
watch(input_dirty, () => {
    console.log("INPUT DIRTIES", { ...input_dirty.value })
    if (input_dirty.value.every((x) => x) && resolve_dirty_promise !== null) {
        resolve_dirty_promise(null);
    }
    if (!working.value && !input_dirty.value.every((x) => !x)) {
        dirty.value = true;
    }
}, { deep: true })

let current = ref(0);
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const calc = limit_to_one(async () => {
    dirty.value = false;
    working.value = true;
    current.value = 0;

    await Promise.all([
        repeats_element.value?.calc(),
        fold_data.value.load_inital()
    ]);
    if (!input_dirty.value.every((x) => x)) await new Promise((resolve, _) => { resolve_dirty_promise = resolve });
    await sleep(100);

    for (let i = 0; i < repeats.value; i++) {
        console.log(i);
        await Promise.all([
            ...result_elements.value.map((s) => s?.calc()),
        ]);
        input_dirty.value = input_dirty.value.map((_) => false);
        if (i < repeats.value - 1) {
            fold_data.value.update_data(result_values.value)
            await new Promise((resolve, _) => { resolve_dirty_promise = resolve });
            await sleep(100);
        }
        current.value = i + 1;
    }
    dirty.value = false;
    fold_dirty.value = false;
    working.value = false;
}
)
</script>
