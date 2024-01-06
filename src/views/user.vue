<template>
  <h1>User page</h1>
  <v-virtual-scroll :items="images" height="calc(100vh - 50px)">
    <template v-slot="{ item: url }">
      <img :src="url" />
    </template>
  </v-virtual-scroll>
</template>

<script setup lang="ts">
import { useDiscordStore } from '@/store/discord';
import { ref, type Ref } from 'vue';
import { watch } from 'vue';

const URL = "https://deepnarrationapi.matissetec.dev/getUser"
const discord = useDiscordStore()

const images: Ref<string[]> = ref([])
async function load_data() {
  let url = `${URL}/${discord.user_id}`
  let response = await fetch(url)
  let data: string[] = await response.json()
  data.reverse()
  images.value = data
}

watch(() => discord.user_id, () => {
  if (discord.user_id !== undefined) load_data()
}, { immediate: true })
</script>
