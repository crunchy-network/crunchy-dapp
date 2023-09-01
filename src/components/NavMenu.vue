<template>
  <div
    id="nav-menu"
    :style="
      showNotice
        ? (!showMenu || !mobile) && 'margin-bottom: 150px'
        : 'margin-bottom: 100px'
    "
  >
    <el-header
      id="nav-menu"
      style="
        height: unset;
        position: fixed;
        top: 0;
        padding: 0 !important;
        right: 0;
        left: 0;
        z-index: 999;
        /*display: flex;*/
        align-items: center;
        border-bottom: var(--line-border);
      "
    >
      <Notice v-if="showNotice && (!showMenu || !mobile)" />
      <el-row class="el-menu-row" type="flex" justify="space-between">
        <div
          v-if="!showMenu || !mobile"
          class="show-mobile"
          style="text-align: center; margin: 0 20px"
        >
          <logo width="170" />
        </div>
        <button
          v-if="!showMenu || !mobile"
          class="show-mobile clear-btn"
          style="
            color: #555cff;
            margin: 0 20px;
            width: 33px !important;
            height: 33px !important;
          "
          @click="toggleMenu"
        >
          <i style="font-size: 28px" class="fa-solid fa-bars-staggered"></i>
        </button>
        <div :class="[mobile && 'mobile-menu', showMenu && 'active']">
          <div v-if="mobile && showMenu">
            <Notice v-if="showNotice" />
            <el-row class="el-menu-row" type="flex" justify="space-between">
              <div
                class="show-mobile"
                style="text-align: center; margin: 0 20px"
              >
                <Logo width="170" />
              </div>
              <button
                :class="'show-mobile close-btn'"
                style="
                  color: #555cff;
                  margin: 0 20px;
                  width: 33px !important;
                  height: 33px !important;
                "
                @click="toggleMenu"
              >
                <i
                  style="font-size: 20px !important; width: unset !important"
                  class="fa-solid fa-xmark"
                ></i>
              </button>
            </el-row>
          </div>
          <div>
            <el-menu
              ref="menu"
              class="nav-menu-wrapper"
              style="background: transparent; border: none; width: 100%"
              :router="true"
              :mode="mobile ? 'vertical' : 'horizontal'"
              @click="toggleMenu"
            >
              <el-menu-item v-if="!mobile">
                <div style="text-align: center">
                  <Logo width="170" />
                </div>
              </el-menu-item>
              <el-menu-item v-if="!mobile">
                <el-divider direction="vertical"></el-divider>
              </el-menu-item>
              <router-link
                tag="li"
                class="el-menu-item"
                :to="{ name: 'home' }"
                exact
                active-class="is-active"
              >
                <i v-if="mobile" class="fak fa-crunchy-home-alt"></i>
                <span>Tokens</span>
              </router-link>

              <router-link
                tag="li"
                class="el-menu-item"
                :to="{ name: 'home-view-portfolio' }"
                exact
                active-class="is-active"
              >
                <i v-if="mobile" class="fak fa-light fa-coins"></i>
                <span>Portfolio</span>
              </router-link>

              <router-link
                tag="li"
                class="el-menu-item"
                to="/swap"
                active-class="is-active"
              >
                <i v-if="mobile" class="fak fa-crunchy-swap-alt"></i>

                <span>Swap</span>
              </router-link>
              <el-submenu
                id="defi-menu"
                :popper-append-to-body="false"
                index="1"
                :class="defiActive ? 'sub-is-active' : ''"
              >
                <template slot="title">
                  <svg
                    v-if="mobile"
                    width="25"
                    viewBox="0 0 30 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style="margin-right: 8px"
                  >
                    <path
                      d="M16.7142 8.99999C16.7142 10.5257 16.2618 12.0172 15.4141 13.2858C14.5665 14.5544 13.3617 15.5432 11.9521 16.1271C10.5425 16.7109 8.99137 16.8637 7.49495 16.566C5.99853 16.2684 4.62397 15.5337 3.54511 14.4548C2.46625 13.3759 1.73153 12.0014 1.43388 10.505C1.13622 9.00855 1.28899 7.45746 1.87286 6.04786C2.45674 4.63826 3.4455 3.43345 4.71411 2.5858C5.98271 1.73814 7.47419 1.28571 8.99993 1.28571C10.0528 1.28727 11.0943 1.50435 12.0601 1.92359C13.026 2.34283 13.8957 2.95534 14.6159 3.72342C15.8291 4.99298 16.5698 6.64048 16.7142 8.39056C16.7142 8.58342 16.7142 8.77627 16.7142 8.99999Z"
                      :stroke="
                        defiActive
                          ? 'var(--color-menu-active)'
                          : 'var(--nav-item)'
                      "
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.66211 6.10754H11.0621L9.00204 9.0745H10.3154C10.4856 9.08088 10.6531 9.12751 10.8082 9.21173C10.9634 9.29595 11.1033 9.41611 11.2198 9.56534C11.3363 9.71456 11.4273 9.88993 11.4874 10.0814C11.5475 10.2729 11.5756 10.4768 11.5701 10.6813V11.6978C11.5812 12.1116 11.4554 12.5138 11.2202 12.8163C10.985 13.1188 10.6596 13.297 10.3154 13.3117H8.95513V12.6069M6.81925 4.82645V10.0814C6.81925 10.6875 7.20036 11.1456 7.60492 11.0258"
                      :stroke="
                        defiActive
                          ? 'var(--color-menu-active)'
                          : 'var(--nav-item)'
                      "
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M28.7142 12C28.7142 13.5257 28.2618 15.0172 27.4141 16.2858C26.5665 17.5544 25.3617 18.5432 23.9521 19.1271C22.5425 19.7109 20.9914 19.8637 19.495 19.566C17.9985 19.2684 16.624 18.5337 15.5451 17.4548C14.4662 16.3759 13.7315 15.0014 13.4339 13.505C13.1362 12.0085 13.289 10.4575 13.8729 9.04786C14.4567 7.63826 15.4455 6.43345 16.7141 5.5858C17.9827 4.73814 19.4742 4.28571 20.9999 4.28571C22.0528 4.28727 23.0943 4.50435 24.0601 4.92359C25.026 5.34283 25.8957 5.95534 26.6159 6.72342C27.8291 7.99298 28.5698 9.64048 28.7142 11.3906C28.7142 11.5834 28.7142 11.7763 28.7142 12Z"
                      fill="white"
                      :stroke="
                        defiActive
                          ? 'var(--color-menu-active)'
                          : 'var(--nav-item)'
                      "
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.6621 9.10754H23.0621L21.002 12.0745H22.3154C22.4856 12.0809 22.6531 12.1275 22.8082 12.2117C22.9634 12.2959 23.1033 12.4161 23.2198 12.5653C23.3363 12.7146 23.4273 12.8899 23.4874 13.0814C23.5475 13.2729 23.5756 13.4768 23.5701 13.6813V14.6978C23.5812 15.1116 23.4554 15.5138 23.2202 15.8163C22.985 16.1188 22.6596 16.297 22.3154 16.3117H20.9551V15.6069M18.8193 7.82645V13.0814C18.8193 13.6875 19.2004 14.1456 19.6049 14.0258"
                      :stroke="
                        defiActive
                          ? 'var(--color-menu-active)'
                          : 'var(--nav-item)'
                      "
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  DeFi</template
                >
                <router-link
                  tag="li"
                  class="el-menu-item submenu-item"
                  :to="{ name: 'create-token' }"
                  active-class="is-active"
                >
                  <img
                    src="./../assets/svg-icons/coin.svg"
                    style="color: #8c8d8f; margin-right: 14px"
                  />
                  <span>Create Token</span>
                </router-link>
                <router-link
                  tag="li"
                  class="el-menu-item submenu-item"
                  :to="{ name: 'farm-listing' }"
                  active-class="is-active"
                >
                  <i class="fak fa-crunchy-farm-alt"></i>
                  <span>Farms</span>
                </router-link>
                <router-link
                  tag="li"
                  class="el-menu-item submenu-item"
                  :to="{ name: 'ifo-list' }"
                  active-class="is-active"
                >
                  <i class="fak fa-light fa-farm"></i>
                  <span>IFO</span>
                </router-link>
                <router-link
                  tag="li"
                  class="el-menu-item submenu-item"
                  :to="{ name: 'deep-freezer-listing' }"
                  active-class="is-active"
                >
                  <i class="fak fa-crunchy-locker"></i>
                  <span>Deep Freezers</span>
                </router-link>
                <router-link
                  tag="li"
                  class="el-menu-item submenu-item"
                  to="/wtz"
                  active-class="is-active"
                >
                  <i class="fak fa-crunchy-tez-alt"></i>

                  <span>WTZ</span>
                </router-link>
                <router-link
                  tag="li"
                  class="el-menu-item submenu-item"
                  :to="{ name: 'fire-pit' }"
                  active-class="is-active"
                >
                  <i class="fak fal fa-fire"></i>
                  <span>Fire Pit</span>
                </router-link>
              </el-submenu>

              <el-submenu
                class="more_submenu"
                :popper-append-to-body="false"
                index="2"
              >
                <template slot="title">
                  <svg
                    v-if="mobile"
                    width="25"
                    height="25"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style="margin-right: 8px"
                  >
                    <circle cx="14" cy="14" r="14" fill="var(--nav-item)" />
                    <circle cx="22" cy="14" r="3" fill="white" />
                    <circle cx="22" cy="14" r="3" fill="white" />
                    <circle cx="6" cy="14" r="3" fill="white" />
                    <circle cx="6" cy="14" r="3" fill="white" />
                    <circle cx="14" cy="14" r="3" fill="white" />
                    <circle cx="14" cy="14" r="3" fill="white" />
                  </svg>
                  More</template
                >
                <el-menu-item class="submenu-item">
                  <i
                    style="color: var(--nav-item) !important"
                    class="fa-light fa-book"
                  ></i>
                  <a href="https://docs.crunchy.network/" target="_blank">
                    Docs
                  </a>
                </el-menu-item>
                <el-menu-item class="submenu-item">
                  <i
                    style="color: var(--nav-item) !important"
                    class="fab fa-discord"
                  ></i>
                  <a
                    href="https://discord.com/invite/99UnxxgB46"
                    target="_blank"
                  >
                    Discord
                  </a>
                </el-menu-item>
                <el-menu-item class="submenu-item">
                  <i
                    style="color: var(--nav-item) !important"
                    class="fab fa-telegram"
                  ></i>
                  <a href=" https://t.me/crunchy_network" target="_blank">
                    Telegram
                  </a>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>

          <div
            v-if="mobile"
            :class="
              showMenu ? 'grid-content mobile active' : 'grid-content mobile'
            "
          >
            <NavUtils />
            <nav-wallet />
            <div style="margin-left: 16px">
              <toggle-theme />
            </div>
            <slot />
          </div>
        </div>
        <div
          v-if="!mobile"
          class="grid-content"
          style="
            text-align: right;
            padding: 0 20px;
            display: flex;
            align-items: center;
            height: 100%;
          "
        >
          <div>
            <NavUtils />
          </div>
          <slot />
          <nav-wallet />
          <div style="margin-left: 16px">
            <toggle-theme />
          </div>
        </div>
      </el-row>
    </el-header>
  </div>
</template>

<script>
import Logo from "./Logo.vue";
import NavUtils from "./NavUtils.vue";
import NavWallet from "./NavWallet.vue";
import Notice from "./Notice.vue";
import ToggleTheme from "./ToggleTheme.vue";
export default {
  name: "NavMenu",
  components: { NavWallet, NavUtils, Notice, ToggleTheme, Logo },
  data() {
    return {
      showNotice: false,
      mobile: false,
      showMenu: false,
      windowWidth: window.innerWidth,
      defiActive: false,
    };
  },
  watch: {
    mobile() {
      if (!this.mobile) {
        this.$refs.menu.close(1);
        this.$refs.menu.close(2);
      }
    },
    "$route.name": function (val) {
      if (
        [
          "create-token",
          "wtz",
          "deep-freezer-listing",
          "deep-freezer-item",
          "ifo-pixel-priv",
          "ifo-list",
          "ifo",
          "farm-listing",
          "farm-create",
          "fire-pit",
        ].includes(this.$route.name)
      )
        this.defiActive = true;
    },
    windowWidth() {
      this.screenCheck();
    },
  },
  created() {
    window.addEventListener("resize", (e) => {
      this.windowWidth = window.innerWidth;
      this.screenCheck();
    });
  },
  mounted() {
    console.log("--------");
    console.log(
      "--------",
      [
        "create-token",
        "wtz",
        "deep-freezer-listing",
        "deep-freezer-item",
        "ifo-pixel-priv",
        "ifo-list",
        "ifo",
        "farm-listing",
        "farm-create",
        "fire-pit",
      ].includes(this.$route.name)
    );
    console.log("--------");
    this.openSubmenu();
    this.screenCheck();
    console.log(this.defiActive);
  },
  methods: {
    screenCheck() {
      if (window.innerWidth < 992 && !this.mobile) {
        this.mobile = true;
      }
      if (window.innerWidth >= 992 && this.mobile) {
        this.mobile = false;
      }
    },
    toggleMenu() {
      if (window.innerWidth < 992) {
        this.showMenu = !this.showMenu;
      }
    },
    handleDefiActive() {
      this.defiActive = [
        "create-token",
        "wtz",
        "deep-freezer-listing",
        "deep-freezer-item",
        "ifo-pixel-priv",
        "ifo-list",
        "ifo",
        "farm-listing",
        "farm-create",
        "fire-pit",
      ].includes(this.$route.name);
    },
    openSubmenu(index) {
      this.handleDefiActive();
      if (
        this.$route.name !== "home-view-wallet" &&
        this.$route.name !== "home" &&
        this.$route.name !== "home-view-portfolio" &&
        this.$route.name === "token-tracker-item"
      ) {
        if (window.innerWidth < 992) {
          return this.$refs.menu.open(1);
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "~element-ui/packages/theme-chalk/src/common/var";
#nav-menu {
  .el-menu-row {
    border-right: none !important;
    border-bottom: none;
    margin: 0;
    align-items: center;
    min-width: 100%;
    min-height: 70px;
    background: var(--background-color);
    box-shadow: 0px 10px 16px rgba(21, 21, 52, 0.05);
  }

  .more_submenu .el-menu-item.submenu-item {
    &.is-active {
      color: var(--color-subheading-text) !important;
    }
  }
  .el-menu-item.submenu-item {
    color: var(--nav-item);
    font-weight: 500;
    font-size: 16px;
    background: var(--background-card);
    i {
      margin-right: 14px;
      width: 24px;
      text-align: center;
      font-size: 24px;
      vertical-align: middle;
    }
    a {
      color: var(--nav-item);
      font-weight: 500;
      text-decoration: none;
      padding: 0px;
    }
    &:hover {
      background: #9093991e !important;
    }
    &.is-active {
      color: var(--color-menu-active) !important;
      i {
        color: var(--color-menu-active) !important;
      }
    }
  }

  .nav-menu-wrapper > .el-menu-item {
    color: var(--nav-item) !important;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    border: 0 !important;
    padding: 20px 15px;
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
      color: var(--color-menu-active) !important;
    }
  }
  .el-divider--vertical {
    height: 55px !important;
  }

  @media (max-width: 991px) {
    .mobile-menu {
      position: fixed;
      top: 0px;
      bottom: 0;
      z-index: 200000;
      left: -200%;
      width: 100%;
      padding-right: 30px;
      padding-top: 10px;
      padding-bottom: 40px;
      transition: 0.45s ease all;
      background: var(--background-color);
      border-right: var(--line-border) !important;
      overflow-y: auto;

      > div:first-child {
        margin-bottom: 50px;
      }

      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      .el-menu-item {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      &.active {
        left: 0;
      }
    }

    .grid-content.mobile {
      position: fixed;
      bottom: -200%;
      text-align: center;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      left: 0;
      right: 0;
      border-top: var(--line-border);
      background: var(--background-color);
      height: 80px;
      transition: 0.45s ease all;
      &.active {
        bottom: 0;
      }
    }

    .clear-btn {
      background: transparent;
      border: 0;
      cursor: pointer;
    }

    .close-btn {
      border: 0 !important;
      background: #555cff !important;
      color: #fff !important;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-menu--popup,
    .el-menu--inline {
      border: 0 !important;
    }
  }
}
</style>
