<template>
    <!-- <h1>{{ zoom }}</h1> -->
    <div id="container">
        <NodeLiteralNumber />
        <NodeDisplayNumber />
        <NodeDelay />
        <NodeDelay />
        <NodeDelay />
        <NodeAdd />

        <Connection v-for="connection in connections" :from="connection.from" :to="connection.to" />
    </div>
</template>

<script setup lang="ts">
import { type SocketClick, inject_key } from "~/lib/socket_click";

interface Connection {
    from: HTMLElement,
    to: HTMLElement,
}
let connections: Ref<Connection[]> = ref([]);


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

        connections.value.push({
            from: clicked_last.element,
            to: socket.element
        });

        let input;
        let output;

        if (socket.io === "output") {
            output = socket;
            input = clicked_last;
        } else {
            output = clicked_last;
            input = socket;
        }

        input.set_get_value!(output.get_value!)

        clicked_last = null;
    }
}
provide(inject_key, socket_clicked);
</script>

<style scoped>
#container {
    width: 100vw;
    height: 100vh;

    background: radial-gradient(circle, white 4px, rgba(0, 0, 0, 0) 1px);
    background-size: 40px 40px;
}
</style>
