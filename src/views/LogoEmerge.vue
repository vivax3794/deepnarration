<template>
  <ResultQueue :request_id="req_id" v-model="show_result"></ResultQueue>
  <v-card style="margin-top: 20px">
    <v-card-text>
      <v-text-field v-model="firstImage" label="First Image" prepend-inner-icon="mdi-vector-arrange-below">
      </v-text-field>
      <v-select label="Select" v-model="firstAdapter" :items="['close', 'face', 'close-face']"></v-select>
      <img :src="firstImage" class="center"> <br />
      <v-text-field v-model="secondImage" label="Second Image" prepend-inner-icon="mdi-vector-arrange-below">
      </v-text-field>
      <v-select label="Select" v-model="secondAdapter" :items="['close', 'face', 'close-face']"></v-select>
      <img :src="secondImage" class="center"> <br />
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

const firstImage = useStorage("LogoEmerge-FirstImage", "");
const firstAdapter = useStorage("LogoEmerge-FirstAdapter", "");
const secondImage = useStorage("LogoEmerge-SecondImage", "");
const secondAdapter = useStorage("LogoEmerge-SecondAdapter", "");

const prompt = useStorage("LogoEmerge-Prompt", "");

const req_id = ref(0);
const show_result = ref(false);

function submit() {
  const url = "https://deepnarrationapi.matissetec.dev/startLogoEmerge"

  req_id.value = Math.floor(Math.random() * 1000);

  const body = {
    discordId: discord.user_id,
    discordUsername: discord.username,
    firstImage: firstImage.value,
    firstAdapter: firstAdapter.value,
    secondImage: secondImage.value,
    secondAdapter: secondAdapter.value,
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
