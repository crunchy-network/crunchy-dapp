<template>
  <div style="background: #1f2128; margin-bottom: 35px">
    <el-menu mode="horizontal" :router="true">
      <el-menu-item>
        <div style="text-align: center">
          <img src="../assets/logo_transparent_background.png" width="150" />
        </div>
      </el-menu-item>
      <el-menu-item style="padding: 40px 0px !important">
        <el-divider direction="vertical"></el-divider>
      </el-menu-item>
      <router-link
        tag="li"
        class="el-menu-item"
        :to="{ name: 'home' }"
        exact
        active-class="is-active"
      >
        <span>Home</span>
      </router-link>

      <router-link
        tag="li"
        class="el-menu-item"
        :to="{ name: 'ifo-list' }"
        active-class="is-active"
      >
        <span>IFO</span>
      </router-link>

      <router-link
        tag="li"
        class="el-menu-item"
        :to="{ name: 'farm-listing' }"
        active-class="is-active"
      >
        <span>Farms</span>
      </router-link>

      <!-- <router-link
        tag="li"
        class="el-menu-item"
        :to="{ name: 'wtz' }"
        active-class="is-active"
      >
        <span>WTZ</span>
      </router-link> -->

      <router-link
        tag="li"
        class="el-menu-item"
        :to="{ name: 'deep-freezer-listing' }"
        active-class="is-active"
      >
        <span>Deep Freezers</span>
      </router-link>

      <div style="display: flex; justify-content: flex-end;">
        <el-menu-item  style="padding-right: 0px !important">
          <div class="grid-content" style="text-align: right">
            <NavWallet />
          </div>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
import NavWallet from "./NavWallet.vue";
export default {
  components: { NavWallet },
  name: "NavMenu",
};
</script>

<style lang="scss" scoped>
@import "~element-ui/packages/theme-chalk/src/common/var";
.el-menu {
  border-right: none !important;
  background: #1f2128;
  margin: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.el-menu-item,
li.el-submenu {
  color: #ffffff !important;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  border: 0 !important;
  padding: 40px;
  background: transparent !important;
  i.fas,
  i.fak {
    margin-right: 14px;
    width: 24px;
    text-align: center;
    font-size: 24px;
    vertical-align: middle;
  }

  .el-submenu__title {
    height: unset !important;
    line-height: 0 !important;
    color: #ffffff !important;
  }

  &:hover,
  &.is-active {
    color: #f15d59 !important;
  }
  .el-divider--vertical {
    height: 55px !important;
    background: rgba(255, 255, 255, 0.3) !important;
  }

  /* &.is-active {
    color: #f64947;
    border-right: 6px solid #ff7a7a;
  } */
}
</style>
