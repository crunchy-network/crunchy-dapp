<template>
  <div id="home">
    <!-- Desktop -->
    <!-- <el-container class="hidden-sm-and-down"> -->
    
    <el-main style="margin-top: 90px">
      <el-row :gutter="20" type="flex" style="margin-top: 35px">
        <el-col :span="16">
          <div class="grid-content" style="height: 100%">
            <el-card class="box-card" shadow="always" style="height: 100%">
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
