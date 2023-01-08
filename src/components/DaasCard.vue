<template>
  <el-card class="box-card" shadow="always" style="height: 100%; width: 100%">
    <h2>DeFi-as-a-Service (DaaS)</h2>
    <p>
      Crunchy provides DeFi services and solutions on Tezos to projects and
      developers.
    </p>
    <el-button type="danger" round @click="openDocs"
      >Read the Docs <i class="fas fa-arrow-right fa-icon-right"></i
    ></el-button>
  </el-card>
</template>

<script>
export default {
  name: "DaasCard",
  methods: {
    openDocs() {
      window.open("https://docs.crunchy.network/", "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 14px;
  color: rgb(117, 118, 121);
}
.el-button {
  font-weight: bold;
}
</style>
