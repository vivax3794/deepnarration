<template>
  <ResultQueue :request_id="req_id" v-model="show_result"></ResultQueue>
  <v-card style="margin-top: 20px">
    <v-card-text>
      <v-text-field v-model="target_url" label="Target image" prepend-inner-icon="mdi-web">
      </v-text-field>
      <img :src="target_url" class="center"> <br />
      <!-- TODO we want this to be a better selector, maybe show the gifs they can select between -->
      <v-select label="Select" v-model="danceChosen" :items="['dance1', 'dance2', 'dance3', 'dance4', 'dance5', 'dance6', 'dance7', 'dance8', 'dance9', 'dance10', 'dance11', 'dance12']"></v-select>
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

const target_url = useStorage("TransparentGif-Target", "");
const prompt = useStorage("TransparentGif-Prompt", "");
const danceChosen = useStorage("TransparentGif-DanceChosen", "");

const req_id = ref(0);
const show_result = ref(false);

function submit() {
  const url = "https://deepnarrationapi.matissetec.dev/startTransparentGif"

  req_id.value = Math.floor(Math.random() * 1000);

  const body = {
    discordId: discord.user_id,
    discordUsername: discord.username,
    targetPicture: target_url.value,
    prompt: prompt.value,
    danceChosen: danceChosen.value,
    id: req_id.value,
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify(body)
  })

  show_result.value = true;
}
</script>
