<template>
  <v-expand-transition>
    <v-card class="margin" v-if="modelValue" :color="result_color()">
      <v-card-title>
        <v-btn icon="mdi-close" variant="plain" @click="close_results"></v-btn>
        Result - {{ our_job ? 'Yours' : `Queue: ${our_position} - ${estimated_until_us}S until your turn.` }}
      </v-card-title>
      Results will be on discord, for now.
      <v-progress-linear :model-value="time_remaing / max_time * 100" height="20" color="orange"
        :striped="time_remaing > max_time">
        Estimated Progress - If inaccurate blame matisse
      </v-progress-linear>
    </v-card>
  </v-expand-transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import * as api from "@/api";
import { onUnmounted } from 'vue';

const props = defineProps<{
  request_id: number,
  modelValue: boolean,
}>();

const emit = defineEmits<{
  (e: "update:modelValue", new_value: boolean): void
}>();

const our_job = ref(false);
const time_remaing = ref(-1);
const max_time = ref(-1);
const our_position = ref(-1);
const estimated_until_us = ref(-1);

let last_position: number | null = -1;
let update_id: ReturnType<typeof setInterval> | undefined = undefined;

onUnmounted(() => {
  clearInterval(update_id);
})

function reset() {
  our_job.value = false;
  time_remaing.value = -1;
  max_time.value = -1;
  last_position = -1;
  our_position.value = -1;
}

watch(() => props.modelValue, () => {
  if (props.modelValue) start()
})

function start() {
  reset();

  clearInterval(update_id);
  update_job_status();
  update_id = setInterval(update_job_status, 2000);
}

async function update_job_status() {
  time_remaing.value += 2;
  let status = await api.getJobsStatus(props.request_id);

  if (status.position === null) {
    our_job.value = true;
  } else {
    our_job.value = false;
    our_position.value = status.position + 1;
  }

  if (status.position !== last_position) {
    last_position = status.position;
    time_remaing.value = 0;
    estimated_until_us.value = status.estimated_time_until_your_turn;
  }
  max_time.value = status.total_time;

  if (time_remaing.value > max_time.value && our_job.value) {
    clearInterval(update_id);
  }

}

function result_color(): string {
  if (our_job.value) {
    if (time_remaing.value > max_time.value) {
      return "green";
    } else {
      return "teal";
    }
  } else {
    return "gray";
  }
}

function close_results() {
  emit("update:modelValue", false);
  clearInterval(update_id);
}
</script>
