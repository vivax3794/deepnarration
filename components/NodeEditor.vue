<template>
    <v-snackbar :text="error_message" v-model="error" location="top center" color="red"></v-snackbar>
    <v-navigation-drawer permanent>
        <template v-for="node, index in possible_nodes">
            <v-divider v-if="node.divider === true" thickness="4px"></v-divider>
            <v-tooltip :text="health_checks?.[index] === undefined ? node.tip : health_checks[index]">
                <template v-slot:activator="{ props }">
                    <v-card v-bind="props" class="pa-2 ma-3"
                        :color="health_checks?.[index] === undefined ? node.color : 'gray'"
                        :draggable="health_checks?.[index] === undefined" @dragstart="(e) => dragstart(e, index)">
                        {{ node.name }}
                    </v-card>
                </template>
            </v-tooltip>
        </template>
    </v-navigation-drawer>

    <v-main>
        <div id="container" @dragover="(e) => e.preventDefault()" @drop="drop" @mousemove="handle_pan" @wheel="handle_zoom">
            <div id="node_container" ref="node_container">
                <component v-for="node, index in nodes" :is="node.type" :key="node.id" v-model:x="node.x" v-model:y="node.y"
                    :page_scale="scale" @delete="nodes.splice(index, 1)">
                </component>
            </div>
            <Connection v-for="connection in connections" :from="connection.from" :to="connection.to" :page_scale="scale"
                :kind="connection.kind" />
            <Connection v-if="clicked_last !== null && mouse_tracker !== null" :from="clicked_last.element"
                :kind="clicked_last.kind" :to="mouse_tracker" :page_scale="scale" />
        </div>
    </v-main>

    <div id="mouse_tracker" ref="mouse_tracker"></div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { type SocketClick, inject_key, type SocketClickInput, type SocketClickOutput } from "~/lib/socket_click";
import { possible_nodes } from "~/lib/nodes";

interface Connection {
    from: HTMLElement,
    to: HTMLElement,
    id: number,
    kind: string,
}
let connections: Ref<Connection[]> = ref([]);

interface NodeInstance {
    type: Component,
    x: number,
    y: number,
    id: number,
}
let nodes: Ref<NodeInstance[]> = ref([]);

let { data: health_checks } = await useAsyncData(
    "healthchecks",
    () => Promise.all(possible_nodes.map((node) => node.healthcheck?.()))
)

function add_node(comp: Component, x: number, y: number) {
    let max_id = Math.max(...nodes.value.map((node) => node.id))

    if (!Number.isFinite(max_id)) {
        max_id = 0;
    }

    nodes.value.push({
        type: comp,
        x,
        y,
        id: max_id + 1
    })
}

function dragstart(e: DragEvent, index: number) {
    e.dataTransfer?.setData("text/plain", index.toString());
}

function drop(e: DragEvent) {
    e.preventDefault();
    let index = Number.parseInt(e.dataTransfer?.getData("text/plain")!);

    let x = (e.offsetX - pan_x.value) / scale.value;
    let y = (e.offsetY - pan_y.value) / scale.value;

    add_node(possible_nodes[index].type, x, y);
}

function remove_connection(id: number) {
    connections.value = connections.value.filter((con) => con.id !== id);
}

let clicked_last: Ref<SocketClick | null> = ref(null);
let error = ref(false);
let error_message = ref("");
function socket_clicked(socket: SocketClick) {
    if (clicked_last.value === null) {
        if (socket.io === "output" && socket.kind === "generic") {
            error.value = true;
            error_message.value = "Can not use generic output, try providing the generic inputs first.";
            return;
        }
        if (socket.io === "input" && socket.kind === "generic") {
            error.value = true;
            error_message.value = "To connect to a generic input please select the output first.";
            return;
        }
        clicked_last.value = socket;
    } else {
        if (clicked_last.value.io === socket.io) {
            error.value = true;
            error_message.value = "Can not connect Input-Input or Output-Output"
            clicked_last.value = null;
            return;
        }
        if (clicked_last.value.kind !== socket.kind) {
            if (socket.kind === "generic" && socket.io == "input") {
                socket.update_kind(clicked_last.value.kind)
                socket.kind = clicked_last.value.kind;
            } else {
                error.value = true;
                error_message.value = "Sockets need to have the same type.";
                clicked_last.value = null;
                return;
            }
        }

        let connection_id = Math.random();
        connections.value.push({
            from: clicked_last.value.element,
            to: socket.element,
            id: connection_id,
            kind: clicked_last.value.kind,
        });
        let kill_connection = () => remove_connection(connection_id);

        let input: SocketClickInput;
        let output: SocketClickOutput;

        if (socket.io === "output" && clicked_last.value.io == "input") {
            output = socket;
            input = clicked_last.value;
        } else if (socket.io == "input" && clicked_last.value.io == "output") {
            output = clicked_last.value;
            input = socket;
        };

        input!.update_value(output!.data, kill_connection);
        output!.update_value(input!.data, kill_connection);

        clicked_last.value = null;
    }
}
provide(inject_key, socket_clicked);

let pan_x = ref(0);
let pan_y = ref(0);
let scale = ref(1);

function handle_pan(event: MouseEvent) {
    mouse_x.value = event.pageX;
    mouse_y.value = event.pageY;

    if ((event.buttons & 4) !== 0) {
        pan_x.value += event.movementX;
        pan_y.value += event.movementY;
    }
}

let node_container: Ref<HTMLElement | null> = ref(null);

function handle_zoom(event: WheelEvent) {
    event.preventDefault();

    let new_scale = scale.value - event.deltaY / 1000.0;
    new_scale = Math.max(Math.min(new_scale, 2), 0.1)

    let rect = node_container.value!.getBoundingClientRect();
    let mouse_x = event.pageX - rect.left;
    let mouse_y = event.pageY - rect.top;

    let relative_scale = new_scale / scale.value;
    let scaled_mouse_x = mouse_x * relative_scale;
    let scaled_mouse_y = mouse_y * relative_scale;

    let delta_x = scaled_mouse_x - mouse_x;
    let delta_y = scaled_mouse_y - mouse_y;

    pan_x.value -= delta_x;
    pan_y.value -= delta_y;

    scale.value = new_scale;
}

let mouse_x = ref(0);
let mouse_y = ref(0);
let mouse_tracker: Ref<HTMLElement | null> = ref(null);

</script>

<style scoped>
#mouse_tracker {
    width: 0px;
    height: 0px;

    position: fixed;
    left: calc(v-bind(mouse_x) * 1px);
    top: calc(v-bind(mouse_y) * 1px)
}

#container {
    width: 100%;
    height: 100%;

    position: relative;

    background: radial-gradient(circle, white 4px, rgba(0, 0, 0, 0) 1px);
    background-size: 40px 40px;
}

#node_container {
    width: 0px;
    height: 0px;
    position: relative;
    z-index: 100;

    left: calc(v-bind(pan_x) * 1px);
    top: calc(v-bind(pan_y) * 1px);
    transform: scale(v-bind(scale));
}
</style>
