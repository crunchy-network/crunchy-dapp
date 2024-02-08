<template>
  <div id="airdrop-tool" class="create-token">
    <nav-menu></nav-menu>
    <el-main>
      <el-row :gutter="20" type="flex" align="bottom">
        <el-col :span="24">
          <div class="grid-content">
            <h2 style="font-weight: 700; font-size: 24px; margin-bottom: 4px">
              Airdrop Tool
            </h2>
            <span class="color__subheading fs__16 fw__4"
              >Select a token to airdrop and choose between uploading our
              template full or airdrop information or manually enter your
              airdrop data. <br />
              A 10 $XTZ fee will be charged for this service.</span
            >
          </div>
        </el-col>
      </el-row>
      <form>
        <!-- Form fields go here -->
        <label for="token-to-airdrop">Token to Airdrop</label>
        <input
          id="token-to-airdrop"
          type="text"
          placeholder="Search for Token or Enter Token Address"
        />
        <select id="token-type">
          <option value="FA1.2">FA1.2</option>
          <option value="FA2.0">FA2</option>
          <option value="FA2.1">FA2.1</option>
          <option value="other">Other</option>
        </select>
        <label for="airdrop-file">
          Upload Airdrop List From Our
          <a href="Template">Template</a> (Optional)
        </label>
      </form>
      <div class="summary">
        <!-- Summary informational section goes here -->
      </div>
    </el-main>
  </div>
</template>

<script>
// import { mapState, mapActions } from "vuex";
import NavMenu from "./NavMenu.vue";
import ConnectButton from "./ConnectButton.vue";

export default {
  name: "AirdropTool",
  components: {
    NavMenu,
    ConnectButton,
  },
  // Component logic goes here
}
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
.airdrop-tool {
  display: flex;
  flex-direction: row;
}
</style>
