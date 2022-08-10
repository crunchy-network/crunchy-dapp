<template>
  <div id="bakery">
    <el-header
      style="
        position: fixed;
        height: 90px;
        top: 0;
        left: 230px;
        right: 0;
        background: #fff;
        z-index: 999;
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
      <el-divider></el-divider>
    </el-header>
    <el-main style="margin-top: 90px">
      <el-row :gutter="20" type="flex">
        <el-col :span="16">
          <div class="grid-content" style="height: 100%">
            <el-card
              class="box-card bakery"
              shadow="always"
              style="height: 100%"
            >
              <h2>Token Bakery</h2>
              <p>Crunchy offers ...</p>
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
  </div>
</template>

<script>
import NavWallet from "./NavWallet.vue";
import DaasCard from "./DaasCard.vue";

export default {
  name: "Bakery",
  components: {
    NavWallet,
    DaasCard,
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#bakery {
  position: relative;
  width: 100%;
}

.bakery {
  position: relative;

  &:before {
    position: absolute;
    font-family: "Font Awesome 5 Pro";
    font-weight: 400;
    bottom: -65px;
    right: 25px;
    content: "\f86b";
    font-size: 172px;
    color: $--color-primary-light-8;
    z-index: 0;
  }

  p {
    font-size: 14px;
    color: rgb(117, 118, 121);
  }
}

.bakery div,
.bakery p {
  position: relative;
  z-index: 1;
}
</style>
