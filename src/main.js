import Vue from "vue";
import App from "./App.vue";
import "./App.less";

const env = process.env.NODE_ENV;

if (env === "development") {
  console.log("开发环境");
} else if (env === "qa") {
  console.log("测试环境");
} else if (env === "uat") {
  console.log("预发环境");
} else if (env === "prod") {
  console.log("正式环境");
}

const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 2000);
});

console.log(p);

new Vue({
  render: h => h(App)
}).$mount("#app");
