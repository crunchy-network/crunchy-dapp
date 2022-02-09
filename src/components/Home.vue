<template>
  <div id="home">
    <!-- Desktop -->
    <!-- <el-container class="hidden-sm-and-down"> -->
    <el-header
      style="
        position: fixed;
        height: 90px;
        top: 0;
        left: 230px;
        right: 0;
        background: #fff;
        z-index: 999;
        border-bottom: 1px solid #e8e8e9;
      "
    >
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content" style="text-align: right">
            <NavWallet />
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="margin-top: 90px">
      <el-row :gutter="20" type="flex" style="margin-top: 35px">
        <el-col :span="16">
          <div class="grid-content" style="height: 100%">
            <el-card class="box-card" shadow="never" style="height: 100%">
              <h2>Crunchy.Network</h2>
              <el-alert
                title="Crunchy.Network is in beta"
                type="info"
                description="You are using Crunchy.Network products and services at your own risk. Any losses incurred due to your actions are your own responsibility. By using Crunchy.Network you agree to these terms."
                show-icon
                :closable="false"
              >
              </el-alert>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content" style="height: 100%">
            <DaasCard />
          </div>
        </el-col>
      </el-row>
    </el-main>
    <!-- </el-container> -->

    <!-- Mobile -->
    <!-- <el-container class="hidden-md-and-up" style="margin-top: 50px;">
      <el-main>
        <el-row :gutter="20" type="flex">
          <el-col :span="24">
            <div class="grid-content">
              <el-card class="box-card" shadow="never">
                <h2>Crunchy.Network</h2>
                <el-alert
                  title="Crunchy.Network is in beta"
                  type="info"
                  description="You are using Crunchy.Network products and services at your own risk. Any losses incurred due to your actions are your own responsibility. By using Crunchy.Network you agree to these terms."
                  show-icon
                  :closable="false">
                </el-alert>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" style="margin-top: 20px;">
          <el-col :span="24">
            <div class="grid-content" style="height: 100%;">
              <DaasCard />
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container> -->
  </div>
</template>

<script>
import NavWallet from "./NavWallet.vue";
import DaasCard from "./DaasCard.vue";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {
    NavWallet,
    DaasCard,
  },
  computed: {
    ...mapState(["wallet"]),
  },
};
</script>

<style scoped>
#home {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
}
</style>
