<template>
    <div class="line" id="start"></div>
    <div class="line" id="middle"></div>
    <div class="line" id="end"></div>
</template>

<script setup lang="ts">
import { onUnmounted, computed, ref } from 'vue';

import { SOCKET_NUMBER } from '~/lib/colors';

let props = defineProps<{
    from: HTMLElement,
    to: HTMLElement,
    page_scale: number,
}>();

let xs = ref(0);
let ys = ref(0);
let xe = ref(0);
let ye = ref(0);

function update() {
    let offset = (15 / 2 - 5 / 2) * props.page_scale;

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
    background-color: v-bind(SOCKET_NUMBER);

    --xs: calc(v-bind(xs) * 1px);
    --ys: calc(v-bind(ys) * 1px);
    --xe: calc(v-bind(xe) * 1px);
    --ye: calc(v-bind(ye) * 1px);

    --xm: calc((var(--xs) + var(--xe)) / 2);
    --lwr: calc((var(--xe) - var(--xs))/ 2);
    --lhr: calc(var(--ye) - var(--ys));

    --lw: calc(max(var(--lwr), -1*var(--lwr)));
    --lh: calc(max(var(--lhr), -1*var(--lhr)));
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
