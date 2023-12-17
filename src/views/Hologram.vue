<template>
  <ResultQueue :request_id="req_id" v-model="show_result"></ResultQueue>
  <v-card style="margin-top: 20px">
    <v-card-text>
      <v-text-field v-model="guidingImage" label="Guiding image" prepend-inner-icon="mdi-vector-arrange-below">
      </v-text-field>
      <v-select label="Select" v-model="guidingAdapter" :items="['close', 'face', 'close-face']"></v-select>
      <img :src="guidingImage" class="center"> <br />
      <v-text-field v-model="prompt" label="Guiding prompt">
      </v-text-field>
      <TimeoutButton color="blue" width="100%" @clicked="submit()">Submit</TimeoutButton>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.center {
  margin-left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
}

img {
  max-width: 80%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

import { useDiscordStore } from '@/store/discord';
import TimeoutButton from "@/components/TimeoutButton.vue";
import ResultQueue from '@/components/ResultQueue.vue';

const discord = useDiscordStore();

const guidingImage = useStorage("Hologram-GuidingImage", "");
const guidingAdapter = useStorage("Hologram-GuidingAdapter", "");

const prompt = useStorage("Hologram-Prompt", "");

const req_id = ref(0);
const show_result = ref(false);

function submit() {
  const url = "https://deepnarrationapi.matissetec.dev/startHologram"

  req_id.value = Math.floor(Math.random() * 1000);

  const body = {
    discordId: discord.user_id,
    discordUsername: discord.username,
    guidingImage: guidingImage.value,
    guidingAdapter: guidingAdapter.value,
    prompt: prompt.value,
    id: req_id.value,
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify(body)
  })

  show_result.value = true;
}
</script>
