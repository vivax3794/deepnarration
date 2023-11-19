<template>
  <v-card title="Peak Detection">
    <v-card-text>
      <v-file-input v-model="file_inputs" prepend-icon="mdi-music" accept="audio/*" label="Audio file"></v-file-input>
      <v-expand-transition>
        <div v-if="audio_file !== null">
          <v-container>
            <v-row>
              <v-col :cols="1">
                <v-range-slider :max="1" :min="0" v-model="strengthRange" direction="vertical">
                  <template v-slot:prepend>
                    <span class="center-text">
                      Random
                    </span>
                  </template>
                  <template v-slot:append>
                    <span class="center-text">
                      Exact
                    </span>
                  </template>
                </v-range-slider>
              </v-col>
              <v-col :cols="11">
                <Line id="graph" :data="{
                  labels: [...Array(show_peaks.length).keys()],
                  datasets: [{ label: 'Strength values', data: show_peaks, yAxisID: 'yAxis' }]
                }" :options="{ scales: { yAxis: { min: 0, max: 1, } }, animation: false }">
                </Line>
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="12">
                <v-range-slider :max="100" :min="0" v-model="audioRange">
                </v-range-slider>
              </v-col>
            </v-row>
          </v-container>
          <v-alert v-if="Math.abs(1 - audio_scale) >= 0.1" color="red" title="Length mismatch"
            :text="`Your video will be ${story.total_time} seconds, your audio is ${audio_buffer?.duration.toFixed(2)} seconds, and will be scaled to fit.`"></v-alert>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.center-text {
  text-align: center;
  width: 100%;
}

#graph {
  width: 100px;
  height: 100px;
}
</style>

<script setup lang="ts">
import { useStoryStore } from '@/store/story';
import { watch } from 'vue';
import { computed } from 'vue';
import { Ref } from 'vue';
import { ref } from 'vue';

import { Line } from "vue-chartjs";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, LineController, Colors } from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, LineController, Colors)

const story = useStoryStore();
const show_peaks: Ref<number[]> = ref([]);

const file_inputs: Ref<File[]> = ref([]);
const audio_file = computed(() => {
  if (file_inputs.value.length !== 0) {
    return file_inputs.value[0];
  } else {
    return null;
  }
});
watch(() => audio_file.value, () => {
  if (audio_file.value !== null) {
    decode_audio_buffer(audio_file.value);
  }
})

const strengthRange = ref([0.45, 0.85]);

const minStrength = computed(() => strengthRange.value[0]);
const maxStrength = computed(() => strengthRange.value[1]);

const audioRange = ref([0, 100]);

const audio_buffer: Ref<AudioBuffer | null> = ref(null);
async function decode_audio_buffer(audio_file: File) {
  const audio_context = new AudioContext();
  audio_buffer.value = await audio_context.decodeAudioData(await audio_file.arrayBuffer());

  calculatePeaks();
}

const SPF = 0.1;
const audio_scale = computed(() => story.total_time / ((audio_buffer.value?.duration || story.total_time) * (audioRange.value[1] - audioRange.value[0]) / 100 || 1))

function min(arg: Float32Array): number {
  return arg.reduce((acc, elem) => Math.min(acc, elem), Infinity);
}
function max(arg: Float32Array): number {
  return arg.reduce((acc, elem) => Math.max(acc, elem), 0);
}

watch(strengthRange, () => calculatePeaks())
watch(audioRange, () => calculatePeaks())
watch(() => story.total_time, () => calculatePeaks())

function calculatePeaks() {
  const r_audio_buffer = audio_buffer.value!;

  let audio_data = r_audio_buffer.getChannelData(0);

  const range_start = Math.floor(audioRange.value[0] / 100 * audio_data.length);
  const range_end = Math.floor(audioRange.value[1] / 100 * audio_data.length);

  if (range_start === range_end) {
    return;
  }

  audio_data = audio_data.slice(range_start, range_end).map(Math.abs);

  const audio_spf = Math.floor(audio_data.length / (story.total_time / SPF));

  let smallestVolume = min(audio_data);
  let highestVolume = max(audio_data);

  let peaks = [];
  show_peaks.value = [];
  let frame = 0;
  for (let frame_start = 0; frame_start <= audio_data.length; frame_start += audio_spf) {
    const peak_value = max(audio_data.slice(frame_start, frame_start + audio_spf));
    const normalized_value = (peak_value - smallestVolume) / (highestVolume - smallestVolume);
    const flipped_value = 1 - normalized_value;
    const strength_value = flipped_value * (maxStrength.value - minStrength.value) + minStrength.value;

    peaks.push(`${frame}:(${strength_value})`)
    show_peaks.value.push(strength_value);
    frame++;
  }

  story.peaks = peaks;
  story.audio_file = audio_file.value;
}
</script>
