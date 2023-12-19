<template>
    <v-sheet id="node" :elevation="24" :color="held ? 'yellow-darken-4' : color" rounded width="min-content">
        <h1 id="" @mousedown="start_hold" @mouseup="() => held = false">{{ title }}</h1>

        <slot></slot>
    </v-sheet>
</template>

<script setup lang="ts">
let props = withDefaults(defineProps<{
    title: string,
    color: string
}>(), {
    title: "NO TITLE",
    color: "red"
});


let x = ref(100);
let y = ref(100);

let delta_x = 0;
let delta_y = 0;

let held = ref(false);

function start_hold(event: MouseEvent) {
    delta_x = x.value - event.pageX;
    delta_y = y.value - event.pageY;
    held.value = true;
}

function mousemove(event: MouseEvent) {
    if (!held.value) return;
    event.preventDefault()

    x.value = event.pageX + delta_x;
    y.value = event.pageY + delta_y;
}
onMounted(() => {
    document.addEventListener("mousemove", mousemove);
})
</script>

<style scoped>
#node {
    padding: 20px;

    position: absolute;
    left: calc(v-bind(x) * 1px);
    top: calc(v-bind(y) * 1px);
}

h1 {
    white-space: nowrap;
    user-select: none;
}
</style>
