<template>
  <div id="app-bar">
    <!-- <button class="mobile-menu">
      <span></span>
      <span></span>
      <span></span>
    </button> -->

    <div class="wallet-connect">
      <NavWallet />
    </div>
  </div>
</template>

<script>
import NavWallet from "./NavWallet.vue";
export default {
  components: { NavWallet },
  name: "AppBar",
  methods: {
    connectWallet: () => {},
  },
  data: () => ({
    pkh: "",
  }),
  mounted() {
    this.pkh = this.$store.state.pkh;
  },
};
</script>

<style lang="scss" scoped>
#app-bar {
  padding: 15px 10px;
  border-bottom: 1.5px solid #757679;
  margin: 0px 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media all and (max-width: 996px) {
    margin: 0px 20px;
  }
}

.wallet-connect {
  margin-left: auto;
  /* min-width: max-content; */
}

.mobile-menu {
  border: 0;
  padding: 2px;
  background: transparent;
  cursor: pointer;
  & > span {
    display: block;
    width: 35px;
    height: 5px;
    border-radius: 16px;
    background: #757679;
    margin-bottom: 5px;
    transition: 0.35s ease all;
    &:last-child {
      margin-bottom: 0px;
    }
  }

  &:hover > span {
    background: #555cff;
  }
}
</style>