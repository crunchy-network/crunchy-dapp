<template>
  <div style="margin-bottom: 120px">
    <el-header
      id="nav-menu"
      style="
        min-height: 100px;
        background: #fff;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 999;
        display: flex;
        align-items: center;
      "
    >
      <el-row
        class="el-menu-row"
        type="flex"
        style="align-items: center; width: 100%"
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
              <i v-if="mobile" class="fak fa-crunchy-home"></i>
              <span>Home</span>
            </router-link>

            <el-submenu index="1">
              <template slot="title">DeFi</template>

              <router-link
                tag="li"
                class="el-menu-item submenu-item"
                :to="{ name: 'deep-freezer-listing' }"
                active-class="is-active"
              >
                <i v-if="mobile" class="fak fa-crunchy-locker"></i>
                <span>Deep Freezers</span>
              </router-link>

              <router-link
                tag="li"
                class="el-menu-item submenu-item"
                :to="{ name: 'farm-listing' }"
                active-class="is-active"
              >
                <i v-if="mobile" class="fak fa-crunchy-farm"></i>
                <span>Farms</span>
              </router-link>

              <router-link
                tag="li"
                class="el-menu-item submenu-item"
                :to="{ name: 'fire-pit' }"
                active-class="is-active"
              >
                <i v-if="mobile" class="fas fa-fire-alt"></i>
                <span>Fire Pit</span>
              </router-link>
              <router-link
                tag="li"
                class="el-menu-item submenu-item"
                :to="{ name: 'ifo-list' }"
                active-class="is-active"
              >
                <i v-if="mobile" class="fak fa-regular fa-farm"></i>
                <span>IFO</span>
              </router-link>
              <router-link
                tag="li"
                class="el-menu-item submenu-item"
                to="/wtz"
                active-class="is-active"
              >
                <i v-if="mobile" class="fak fa-crunchy-tez-alt"></i>

                <span>WTZ</span>
              </router-link>

              <!-- <router-link
              tag="li"
              class="el-menu-item"
              :to="{ name: 'deep-freezer-listing' }"
              active-class="is-active"
            >
              <span>Pie Slicer</span>
            </router-link> -->

              <!-- <router-link
                tag="li"
                class="el-menu-item"
                :to="{ name: 'deep-freezer-listing' }"
                active-class="is-active"
              >
                <span>Exchange</span>
              </router-link> -->
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">More</template>
              <el-menu-item class="submenu-item">
                <i v-if="mobile" class="fa-light fa-book"></i>
                <a href="https://docs.crunchy.network/" target="_blank">
                  Docs
                </a>
              </el-menu-item>
              <el-menu-item class="submenu-item">
                <i v-if="mobile" class="fab fa-discord"></i>
                <a href="https://discord.com/invite/99UnxxgB46" target="_blank">
                  Discord
                </a>
              </el-menu-item>
              <el-menu-item class="submenu-item">
                <i v-if="mobile" class="fab fa-telegram"></i>
                <a href=" https://t.me/crunchy_network" target="_blank">
                  Telegram
                </a>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <div class="grid-content" style="text-align: right; padding: 0 20px">
          <slot />
          <nav-wallet />
        </div>
      </el-row>
    </el-header>
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

.el-menu-item.submenu-item {
  &:hover {
    background: #90939925 !important;
  }
  i.fas,
  i.fak {
    margin-right: 8px;
    width: 18px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
    height: unset;
  }
}

a {
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: none;
    color: inherit;
    border: 0px;
    background: none;
  }
  padding: 0px;
}
.nav-menu-wrapper > .el-menu-item {
  color: #909399 !important;
  font-weight: 500;
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
  &:hover {
    background: #9093991e !important;
  }
  &.is-active {
    color: #f15d59 !important;
  }
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

@media (max-width: 568px) {
  .slot-divider {
    transform: rotate(90deg);
    display: none;
  }
}
</style>
