<template>
    <v-navigation-drawer permanent>
        <template v-for="node, index in possible_nodes">
            <v-divider v-if="node.divider === true" thickness="4px"></v-divider>
            <v-tooltip :text="node.tip">
                <template v-slot:activator="{ props }">
                    <v-card v-bind="props" class="pa-2 ma-3" :color="node.color" draggable="true"
                        @dragstart="(e) => dragstart(e, index)">
                        {{ node.name }}
                    </v-card>
                </template>
            </v-tooltip>
        </template>
    </v-navigation-drawer>

    <v-main>
        <div id="container" @dragover="(e) => e.preventDefault()" @drop="drop">
            <component v-for="node in nodes" :is="node.type" :key="node.id"></component>

            <Connection v-for="connection in connections" :from="connection.from" :to="connection.to" />
        </div>
    </v-main>
</template>

<script setup lang="ts">
import { NODE_DEBUG, NODE_MATH } from "~/lib/colors";
import NodeDisplayNumber from "~/components/node/DisplayNumber.vue";
import NodeLiteralNumber from "~/components/node/LiteralNumber.vue";
import NodeAdd from "~/components/node/Add.vue";
import NodeDelay from "~/components/node/Delay.vue";
import NodeLogTrigger from "~/components/node/LogTrigger.vue";
import NodeIsDirty from "~/components/node/IsDirty.vue";

import type { Component } from "vue";
import { markRaw } from "vue";
import { type SocketClick, inject_key, type SocketClickInput, type SocketClickOutput } from "~/lib/socket_click";

interface Connection {
    from: HTMLElement,
    to: HTMLElement,
}
let connections: Ref<Connection[]> = ref([]);

interface NodeInstance {
    type: Component,
    id: number,
}
let nodes: Ref<NodeInstance[]> = ref([]);

interface NodeItem {
    type: Component,
    color: string,
    name: string,
    divider?: boolean,
    tip: string,
}
let possible_nodes: NodeItem[] = [
    {
        type: markRaw(NodeLiteralNumber),
        color: NODE_MATH,
        name: "Number",
        tip: "Constant number"
    },
    {
        type: markRaw(NodeDisplayNumber),
        color: NODE_MATH,
        name: "Display (number)",
        tip: "Display the value of a number input"
    },
    {
        type: markRaw(NodeAdd),
        color: NODE_MATH,
        name: "+",
        tip: "Adds together two numbers",
    },
    {
        divider: true,
        type: markRaw(NodeDelay),
        color: NODE_DEBUG,
        name: "Delay (DEBUG)",
        tip: "Sleeps for 2 seconds to simulate api requests, for debugging purposes"
    },
    {
        type: markRaw(NodeLogTrigger),
        color: NODE_DEBUG,
        name: "Log Triggeres (DEBUG)",
        tip: "Counts how many times this node is asked to calculate its value, used to debug caching"
    },
    {
        type: markRaw(NodeIsDirty),
        color: NODE_DEBUG,
        name: "is dirty (DEBUG)",
        tip: "Displays wether the output is cached, used for debugging"
    }
]

function add_node(comp: Component, x: number, y: number) {
    let max_id = Math.max(...nodes.value.map((node) => node.id))
    nodes.value.push({
        type: comp,
        id: max_id + 1
    })
}

function dragstart(e: DragEvent, index: number) {
    e.dataTransfer?.setData("text/plain", index.toString());
}

function drop(e: DragEvent) {
    e.preventDefault();
    let index = Number.parseInt(e.dataTransfer?.getData("text/plain")!);
    console.log(index);
    add_node(possible_nodes[index].type)
}

let clicked_last: SocketClick | null = null;
function socket_clicked(socket: SocketClick) {
    if (clicked_last === null) {
        clicked_last = socket;
    } else {
        if (clicked_last.io === socket.io || clicked_last.kind !== socket.kind) {
            console.log(clicked_last, socket);
            clicked_last = null;
            return;
        }

        console.log(clicked_last, socket);
        connections.value.push({
            from: clicked_last.element,
            to: socket.element
        });

        let input: SocketClickInput;
        let output: SocketClickOutput;

        if (socket.io === "output" && clicked_last.io == "input") {
            output = socket;
            input = clicked_last;
        } else if (socket.io == "input" && clicked_last.io == "output") {
            output = clicked_last;
            input = socket;
        };

        input!.update_value(output!.data);
        output!.update_value(input!.data);

        clicked_last = null;
    }
}
provide(inject_key, socket_clicked);
</script>

<style scoped>
#container {
    width: 100%;
    height: 100%;

    position: relative;

    background: radial-gradient(circle, white 4px, rgba(0, 0, 0, 0) 1px);
    background-size: 40px 40px;
}
</style>
