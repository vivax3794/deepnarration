<template>
    <NodeBase title="Fold" :color="NODE_CONTROL_FLOW" v-model:dirty="dirty" v-bind="$attrs" :working="working">
        <div style="width: 200px"></div>
        <SocketOutput name="Fold End" kind="fold" :dirty="fold_dirty" :value="fold_data"
            :calc="async () => { fold_data.data_kinds = value_kinds.slice(0, -1); fold_dirty = false }" />
        <SocketOutput name="Invalidate Cache" kind="cache" :dirty="dirty_cache" :value="null"
            :calc="async () => { dirty_cache = false }" />

        <SocketInput v-for="index in value_kinds.length" generic :name="`Init ${index}`"
            v-model:kind="value_kinds[index - 1]" v-model:dirty="dirty" v-model="starting_values[index - 1]"
            ref="start_elements" />

        <SocketOutput v-for="index in results.length" :name="`Current ${index}`" :kind="value_kinds[index - 1]"
            :dirty="value_dirty" :value="results[index - 1]" :calc="async () => { value_dirty = false }" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_CONTROL_FLOW } from '~/lib/colors';
import { watch } from 'vue';

let dirty = ref(true);
let fold_dirty = ref(true);
let working = ref(false);

let value_kinds = ref(["generic"])
let starting_values: Ref<any[]> = ref([undefined]);
let start_elements: Ref<(InstanceType<typeof SocketInput> | null)[]> = ref([null]);
let results: Ref<any[]> = ref([]);
let dirty_cache = ref(true);

function update_data(data: any[]) {
    value_dirty.value = true;
    results.value = data;
    dirty_cache.value = true;
}
async function load_inital() {
    await Promise.all([
        ...start_elements.value.map((s) => s?.calc()),
    ]);
    dirty.value = false;
    value_dirty.value = true;
    results.value = starting_values.value.slice(0, -1);
}

let fold_data = ref({
    data_kinds: [""],
    update_data,
    load_inital,
});

watch(value_kinds, () => {
    if (value_kinds.value[value_kinds.value.length - 2] === "generic" && value_kinds.value[value_kinds.value.length - 1] === "generic") {
        value_kinds.value.pop()
        starting_values.value.pop()
        start_elements.value.pop()
        results.value.pop()
        dirty.value = true;
        fold_dirty.value = true;
    }
    if (value_kinds.value[value_kinds.value.length - 1] !== "generic") {
        value_kinds.value.push("generic");
        starting_values.value.push(undefined);
        start_elements.value.push(null);
        results.value.push(null);
        dirty.value = true;
        fold_dirty.value = true;
    }
}, { deep: true })

let value_dirty = ref(true);
watch(dirty, () => {
    if (dirty.value) {
        value_dirty.value = true;
        fold_dirty.value = true;
        dirty_cache.value = true;
    };
})


</script>
