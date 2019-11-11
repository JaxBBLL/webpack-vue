<template>
  <div class="title">{{ msg }}</div>
</template>
<script>
export default {
  name: "Hello",
  data() {
    return {
      msg: "Webpack configuration by vue"
    };
  },
  methods: {
    setMsg() {
      this.msg = this.msg + ". Hello!";
    }
  }
};
</script>
<style scoped>
.title {
  font-size: 2em;
}
</style>
