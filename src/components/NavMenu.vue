<template>
  <div id="nav-menu" style="background: #fff; margin-bottom: 35px">
    <el-row
      class="el-menu-row"
      type="flex"
      style="align-items: center; min-height: 100px"
      justify="space-between"
    >
      <button
        @click="toggleMenu"
        v-if="mobile"
        class="show-mobile clear-btn"
        style="color: #f15d59; font-size: 30px; margin: 0 20px"
      >
        <i class="fa-solid fa-bars"></i>
      </button>
      <div :class="[mobile && 'mobile-menu', showMenu && 'active']">
        <el-menu
          @click="toggleMenu"
          class="nav-menu-wrapper"
          style="background: transparent; border: none"
          :mode="mobile ? 'vertical' : 'horizontal'"
          :router="true"
        >
          <button
            @click="toggleMenu"
            v-if="mobile"
            class="show-mobile close-btn clear-btn"
            style="color: #df4759"
          >
            <i
              style="font-size: 24px !important; width: unset !important"
              class="fa-solid fa-circle-xmark"
            ></i>
          </button>

          <el-menu-item>
            <div style="text-align: center">
              <img
                src="../assets/logo_transparent_background.png"
                width="150"
              />
            </div>
          </el-menu-item>
          <el-menu-item>
            <el-divider v-if="!mobile" direction="vertical"></el-divider>
            <el-divider v-if="mobile" direction="horizontal"></el-divider>
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

          <el-submenu index="1">
            <template slot="title">DeFi</template>

            <router-link
              tag="li"
              class="el-menu-item"
              :to="{ name: 'deep-freezer-listing' }"
              active-class="is-active"
            >
              <span>Deep Freezers</span>
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

            <router-link
              tag="li"
              class="el-menu-item"
              :to="{ name: 'fire-pit' }"
              active-class="is-active"
            >
              <span>Fire Pit</span>
            </router-link>

            <!-- <router-link
              tag="li"
              class="el-menu-item"
              :to="{ name: 'deep-freezer-listing' }"
              active-class="is-active"
            >
              <span>Pie Slicer</span>
            </router-link> -->

            <router-link
              tag="li"
              class="el-menu-item"
              :to="{ name: 'deep-freezer-listing' }"
              active-class="is-active"
            >
              <span>Exchange</span>
            </router-link>
          </el-submenu>
          <router-link
            tag="li"
            class="el-menu-item"
            to="/wtz"
            active-class="is-active"
          >
            <span>WTZ</span>
          </router-link>

          <el-submenu index="2">
            <template slot="title">More</template>
            <el-menu-item index="2-1">Docs</el-menu-item>
            <el-menu-item index="2-2">Discord</el-menu-item>
            <el-menu-item index="2-3">Telegram</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div style="padding: 0 40px">
        <slot />
      </div>
      <div class="grid-content" style="text-align: right; padding: 0 20px">
        <nav-wallet />
      </div>
    </el-row>
  </div>
</template>

<script>
import NavWallet from "./NavWallet.vue";
export default {
  components: { NavWallet },
  name: "NavMenu",
  data() {
    return {
      mobile: false,
      showMenu: false,
      windowWidth: window.innerWidth,
    };
  },
  watch: {
    windowWidth() {
      if (window.innerWidth <= 992) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    },
  },
  created() {
    if (window.innerWidth <= 992) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.addEventListener("resize", (e) => {
      this.windowWidth = window.innerWidth;
      if (window.innerWidth <= 992) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });
  },
  methods: {
    toggleMenu() {
      if (window.innerWidth < 992) {
        this.showMenu = !this.showMenu;
      }
    },
    menuOrientation() {},
  },
};
</script>

<style lang="scss" scoped>
@import "~element-ui/packages/theme-chalk/src/common/var";
.el-menu-row {
  border-right: none !important;
  margin: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
.el-menu-item {
  color: #909399 !important;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  border: 0 !important;
  padding: 40px 15px;
  background: transparent !important;
  max-height: 80px;
  i.fas,
  i.fak {
    margin-right: 14px;
    width: 24px;
    text-align: center;
    font-size: 24px;
    vertical-align: middle;
  }
  .el-button i {
    font-size: 24px !important;
    width: 24px !important;
  }
  &:hover,
  &.is-active {
    color: #f15d59 !important;
  }
  /* &.is-active {
    color: #f64947;
    border-right: 6px solid #ff7a7a;
  } */
}
.el-divider--vertical {
  height: 55px !important;
}
@media (max-width: 992px) {
  .mobile-menu {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 20000;
    background: #fff;
    left: -100%;
    padding-right: 30px;
    padding-top: 40px;
    overflow-y: auto;
    transition: 0.45s ease all;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    .close-btn {
      position: absolute;
      margin-left: auto;
      right: -18px;
      top: -20px;
    }
    .el-menu-item {
      padding-top: 20px;
      padding-bottom: 20px;
    }
    &.active {
      left: 0;
    }
  }
  .clear-btn {
    background: transparent;
    border: 0;
    cursor: pointer;
  }
}
</style>
