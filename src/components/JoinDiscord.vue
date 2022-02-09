<template>
  <div class="join-discord">
    <div>
      <strong>Join Discord</strong>
      <p>Join Our Discord Server for Daily Updates</p>
    </div>
    <el-button type="primary" @click="joinDiscord">Join Server</el-button>
  </div>
</template>

<script>
export default {
  name: "JoinDiscord",
  methods: {
    joinDiscord() {
      window.open("http://discord.crunchy.network/", "_blank");
    },
  },
};
</script>

<style scoped>
.join-discord {
  background: url(../assets/discord.svg);
  background-size: cover;
  border-radius: 20px;
  border: 2px solid #e7e7e9;
  position: relative;
  width: 166px;
  height: 220px;
  margin: 0 auto;
  margin-top: 24px;
}
.join-discord div {
  padding: 18px;
}
p {
  font-size: 14px;
  color: rgb(117, 118, 121);
}
.el-button {
  position: absolute;
  bottom: 16px;
  left: 16px;
  width: 132px;
  border-radius: 12px;
  font-weight: bold;
}
</style>
