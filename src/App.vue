<template>
  <div class="app">
    <Hello />
    <div class="content">
      <img src="./pic.jpg" height="60" />
      <ul>
        <li v-for="item in list" :key="item">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import Hello from "./Hello";
export default {
  name: "App",
  components: {
    Hello
  },
  data() {
    return {
      list: ["Jack", "Peter"]
    };
  }
};
</script>
<style lang="less">
.app {
  width: 80%;
  border: 1px solid #ddd;
  margin: 20px auto;
  padding: 15px;
  box-shadow: 2px 2px 5px #ddd;
}

.content {
  display: flex;
  align-items: center;
}
</style>
