<template>
    <div id="border" :class="{ animated_border: working || no_cache, static_border: dirty && !working && !no_cache }">
        <v-sheet id="node" :elevation="24" :color="held ? 'yellow-darken-4' : color" rounded width="max-content"
            @contextmenu="open_menu">
            <div @mousedown="start_hold" style="min-height: 20px; padding-left: 20px">
                <h1>{{ title }}</h1>
            </div>

            <div style="padding: 0px 20px;">
                <slot></slot>
            </div>
        </v-sheet>
        <v-menu activator="parent" v-model="menu" :open-on-click="false">
            <v-list>
                <slot name="context"></slot>
                <v-list-item>
                    <v-btn variant="plain" :disabled="dirty || no_cache" @click="$emit('update:dirty', true)">Invalidate
                        Cache</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="plain" @click="no_cache = !no_cache; $emit('update:dirty', true)">
                        {{ no_cache ? "Enable Cache" : "Disable Cache" }}
                    </v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn variant="plain" color="red" @click="$emit('delete')">Delete Node</v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
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
    working?: boolean,
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
    (e: "delete"): void,
}>();

let delta_x = 0;
let delta_y = 0;

let no_cache = ref(false);
watch(() => props.dirty, () => {
    if (no_cache.value && !props.dirty) setTimeout(() => emit("update:dirty", true), 100);
})

let menu = ref(false);
function open_menu(event: Event) {
    event.preventDefault();
    menu.value = true;
}

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

let border_color = computed(() => {
    if (props.working) return "green"
    if (no_cache.value) return "yellow"
    return "red"
})
</script>

<style scoped>
#node {
    padding: 5px 0px;

    border: 100px;
    border-color: red;
}

#border {
    padding: 5px;

    position: absolute;
    z-index: 100;
    left: calc(v-bind(x) * 1px);
    top: calc(v-bind(y) * 1px);
}

.static_border {
    outline: dashed yellow;
}

/* https://stackoverflow.com/a/52963366 */
.animated_border {
    background-image: linear-gradient(90deg, v-bind(border_color) 50%, transparent 50%), linear-gradient(90deg, v-bind(border_color) 50%, transparent 50%), linear-gradient(0deg, v-bind(border_color) 50%, transparent 50%), linear-gradient(0deg, v-bind(border_color) 50%, transparent 50%);
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
