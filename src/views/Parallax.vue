<template>
  <ResultQueue :request_id="req_id" v-model="show_result"></ResultQueue>
  <v-card style="margin-top: 20px">
    <v-card-text>
      <v-text-field v-model="outerImage" label="Boarder image" prepend-inner-icon="mdi-vector-arrange-below">
      </v-text-field>
      <v-select label="Select" v-model="outerAdapter" :items="['close', 'face', 'close-face']"></v-select>
      <img :src="outerImage" class="center"> <br />
      <v-text-field v-model="secondImage" label="Image between boarder and center" prepend-inner-icon="mdi-vector-arrange-below">
      </v-text-field>
      <v-select label="Select" v-model="secondAdapter" :items="['close', 'face', 'close-face']"></v-select>
      <img :src="secondImage" class="center"> <br />
      <v-text-field v-model="middleImage" label="Center Image" prepend-inner-icon="mdi-vector-arrange-below">
      </v-text-field>
      <v-select label="Select" v-model="middleAdapter" :items="['close', 'face', 'close-face']"></v-select>
      <img :src="middleImage" class="center"> <br />
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

const outerImage = useStorage("Parallax-OuterImage", "");
const secondImage = useStorage("Parallax-SecondImage", "");
const middleImage = useStorage("Parallax-MiddleImage", "");
const outerAdapter = useStorage("Parallax-outerAdapter", "");
const secondAdapter = useStorage("Parallax-secondAdapter", "");
const middleAdapter = useStorage("Parallax-MiddleAdapter", "");

const prompt = useStorage("Parallax-Prompt", "");

const req_id = ref(0);
const show_result = ref(false);

function submit() {
  const url = "https://deepnarrationapi.matissetec.dev/startParallax"

  req_id.value = Math.floor(Math.random() * 1000);

  const body = {
    discordId: discord.user_id,
    discordUsername: discord.username,
    outerImage: outerImage.value,
    secondImage: secondImage.value,
    middleImage: middleImage.value,
    outerAdapter: outerAdapter.value,
    secondAdapter: secondAdapter.value,
    middleAdapter: middleAdapter.value,
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
