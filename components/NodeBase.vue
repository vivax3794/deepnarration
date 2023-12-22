<template>
    <div id="border" :class="{ animated_border: working, static_border: dirty && !working }">
        <v-sheet id="node" :elevation="24" :color="held ? 'yellow-darken-4' : color" rounded width="min-content">
            <h1 id="" @mousedown="start_hold">{{ title }}</h1>

            <slot></slot>
        </v-sheet>
    </div>
</template>

<script setup lang="ts">
let props = withDefaults(defineProps<{
    title: string,
    color: string,
    x: number,
    y: number,
    page_scale: number,
    dirty: boolean,
    working: boolean,
}>(), {
    title: "NO TITLE",
    color: "red",
    x: 0,
    y: 0,
    page_scale: 1,
    working: false,
});

let emit = defineEmits<{
    (e: "update:x", value: number): void,
    (e: "update:y", value: number): void,
    (e: "update:dirty", value: boolean): void,
}>();

let delta_x = 0;
let delta_y = 0;

let held = ref(false);

function start_hold(event: MouseEvent) {
    delta_x = props.x - event.pageX / props.page_scale;
    delta_y = props.y - event.pageY / props.page_scale;
    held.value = true;
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", end_hold);
}

function end_hold(_event: MouseEvent) {
    held.value = false;
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", end_hold);
}

function mousemove(event: MouseEvent) {
    if (!held.value) return;
    event.preventDefault()

    emit("update:x", event.pageX / props.page_scale + delta_x);
    emit("update:y", event.pageY / props.page_scale + delta_y);
}
</script>

<style scoped>
#node {
    padding: 20px;

    border: 100px;
    border-color: red;
}

#border {
    padding: 5px;

    position: absolute;
    left: calc(v-bind(x) * 1px);
    top: calc(v-bind(y) * 1px);
}

.static_border {
    outline: dashed yellow;
}

/* https://stackoverflow.com/a/52963366 */
.animated_border {
    background-image: linear-gradient(90deg, green 50%, transparent 50%), linear-gradient(90deg, green 50%, transparent 50%), linear-gradient(0deg, green 50%, transparent 50%), linear-gradient(0deg, green 50%, transparent 50%);
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 15px 4px, 15px 4px, 4px 15px, 4px 15px;
    background-position: left top, right bottom, left bottom, right top;
    animation: border-dance 1s infinite linear;
}

@keyframes border-dance {
    0% {
        background-position: left top, right bottom, left bottom, right top;
    }

    100% {
        background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px;
    }
}

h1 {
    white-space: nowrap;
    user-select: none;
}
</style>
