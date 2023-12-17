<template>
    <ResultQueue :request_id="req_id" v-model="show_result"></ResultQueue>
    <v-card style="margin-top: 20px">
      <v-card-text>
        <v-text-field v-model="target_url" label="Target image" prepend-inner-icon="mdi-web">
        </v-text-field>
        <img :src="target_url" class="center"> <br />
        <v-text-field v-model="prompt" label="Guiding prompt"></v-text-field>
        <v-text-field type="number" v-model="left" label="left"></v-text-field>
        <v-text-field type="number" v-model="right" label="right"></v-text-field>
        <v-text-field type="number" v-model="up" label="up"></v-text-field>
        <v-text-field type="number" v-model="down" label="down"></v-text-field>
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
  
  const target_url = useStorage("OutpaintImages-Target", "");
  const prompt = useStorage("OutpaintImages-Prompt", "");
  const left = useStorage("OutpaintImages-Left", "");
  const right = useStorage("OutpaintImages-Right", "");
  const up = useStorage("OutpaintImages-Up", "");
  const down = useStorage("OutpaintImages-Down", "");
  
  const req_id = ref(0);
  const show_result = ref(false);
  
  function submit() {
    const url = "https://deepnarrationapi.matissetec.dev/startOutpaintImages"
  
    req_id.value = Math.floor(Math.random() * 1000);
  
    const body = {
      discordId: discord.user_id,
      discordUsername: discord.username,
      targetPicture: target_url.value,
      prompt: prompt.value,
      left: left.value,
      right: right.value,
      up: up.value,
      down: down.value,
      id: req_id.value,
    }
  
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body)
    })
  
    show_result.value = true;
  }
  </script>
  