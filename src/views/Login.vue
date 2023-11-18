<template>
  <v-tooltip text="We require discord so we can ping you on discord when results are ready!" location="top">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" id="login" color="blue" size="x-large" rounded="lg" prepend-icon="mdi-login"
        href="https://discord.com/api/oauth2/authorize?client_id=1142575897753440288&redirect_uri=https%3A%2F%2Fprivate.vivax.dev%2F&response_type=token&scope=identify">
        Login with discord
      </v-btn>
    </template>
  </v-tooltip>
</template>

<style scoped>
#login {
  position: absolute;

  margin-left: 50vw;
  margin-top: 30vh;

  transform: translateX(-50%);
}
</style>

