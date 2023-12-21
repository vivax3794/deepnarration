<template>
    <div class="line" id="start"></div>
    <div class="line" id="middle"></div>
    <div class="line" id="end"></div>
</template>

<script setup lang="ts">
import { onUnmounted, computed, ref } from 'vue';

let props = defineProps<{
    from: HTMLElement,
    to: HTMLElement
}>();

let xs = ref(0);
let ys = ref(0);
let xe = ref(0);
let ye = ref(0);

function update() {
    let offset = 15 / 2 - 5 / 2;

    let rect_s = props.from.getBoundingClientRect();
    xs.value = rect_s.x + offset;
    ys.value = rect_s.y + offset;

    let rect_e = props.to.getBoundingClientRect();
    xe.value = rect_e.x + offset;
    ye.value = rect_e.y + offset;
}
let interval = setInterval(update, 10);
onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.line {
    pointer-events: none;
    position: fixed;
    --line-width: 5px;
    background-color: pink;
    /* z-index: -1; */

    --xs: calc(v-bind(xs) * 1px);
    --ys: calc(v-bind(ys) * 1px);
    --xe: calc(v-bind(xe) * 1px);
    --ye: calc(v-bind(ye) * 1px);

    --xm: calc((var(--xs) + var(--xe)) / 2);
    --lw: calc(abs(var(--xe) - var(--xs)) / 2);
    --lh: calc(abs(var(--ye) - var(--ys)));
}

#start {
    height: var(--line-width);
    width: var(--lw);

    left: calc(min(var(--xs), var(--xm)));
    top: var(--ys);
}

#end {
    height: var(--line-width);
    width: var(--lw);

    left: calc(min(var(--xe), var(--xm)));
    top: var(--ye);
}

#middle {
    height: calc(var(--lh) + var(--line-width));
    width: var(--line-width);

    left: var(--xm);
    top: calc(min(var(--ys), var(--ye)));
}
</style>
