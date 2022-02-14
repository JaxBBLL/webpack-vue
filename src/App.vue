<template>
  <div class="container">
    <h1 class="title">{{ msg }}</h1>
    <div>
      {{ env }}
    </div>
    <div>{{ envConfig }}</div>
    <img class="img" @click="clickHandle" src="~@images/1.jpg" width="200" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const msg = ref('App home');
const clickHandle = (e) => {
  msg.value = 'Hello World';
};
const env = ref(process.env.NODE_ENV);
const envConfig = ref(process.envConfig);
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  .title {
    color: var(--primary-color);
  }
  .img {
    border-radius: 0.25rem;
  }
}
</style>
