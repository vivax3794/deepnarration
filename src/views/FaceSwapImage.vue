<template>
  <ResultQueue :request_id="req_id" v-model="show_result"></ResultQueue>
  <v-card style="margin-top: 20px">
    <v-card-text>
      <v-text-field v-model="person_url" label="Image of a persons face" prepend-inner-icon="mdi-web">
      </v-text-field>
      <img :src="person_url" class="center"> <br />
      <v-icon class="center" size="x-large">mdi-arrow-down</v-icon>
      <img :src="target_url" class="center"> <br />
      <v-text-field v-model="target_url" label="Target image" prepend-inner-icon="mdi-web">
      </v-text-field>
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

const target_url = useStorage("FaceSwapImage-Target", "");
const person_url = useStorage("FaceSwapImage-Person", "");
const prompt = useStorage("FaceSwapImage-Prompt", "");

const req_id = ref(0);
const show_result = ref(false);

function submit() {
  const url = "https://deepnarrationapi.matissetec.dev/startImageFaceSwap"

  req_id.value = Math.floor(Math.random() * 1000);

  const body = {
    discordId: discord.user_id,
    discordUsername: discord.username,
    personPicture: person_url.value,
    targetPicture: target_url.value,
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
