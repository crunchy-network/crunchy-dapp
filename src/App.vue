<template>
  <div id="app">
    <!-- Desktop -->
    <!-- <div class="hidden-sm-and-down"> -->

    <el-container style="position: relative; justify-content: space-between">
      <div>
        <router-view></router-view>
      </div>
      <el-footer>
        <div>
          Copyright &copy; 2021 - 2022 Crunchy. Made with
          <i class="fas fa-heart" style="color: #f64947; margin-left: 6px"></i>
          <i
            class="fas fa-grin-beam-sweat"
            style="color: var(--color-primary); margin-left: 6px"
          ></i>
          &amp; <i class="fas fa-grin-tears" style="color: #fece00"></i>
          <div style="margin-top: 24px; font-size: 24px">
            <a
              href="https://github.com/crunchy-network"
              target="_blank"
              style="margin: 0 12px"
              ><i class="fab fa-github"></i
            ></a>
            <a
              href="https://twitter.com/CrunchyTez"
              target="_blank"
              style="margin: 0 12px"
              ><i class="fab fa-twitter"></i
            ></a>
            <a
              href="http://discord.crunchy.network"
              target="_blank"
              style="margin: 0 12px"
              ><i class="fab fa-discord"></i
            ></a>
            <a
              href="http://t.me/crunchy_network"
              target="_blank"
              style="margin: 0 12px"
              ><i class="fab fa-telegram"></i
            ></a>
          </div>
        </div>
      </el-footer>
    </el-container>
    <!-- </div> -->

    <!-- Mobile -->
    <!-- <div class="hidden-md-and-up">
      <el-header style="position: fixed; height: 72px; top: 0; left: 0; right: 0; background: #fff; padding: 10px 20px !important; z-index: 999; border-bottom: 2px solid #f4f4f4; box-shadow: 0px 0px 24px rgba(21, 21, 52, 0.04);">
        <el-row type="flex" align="middle" justify="space-between">
          <el-col :span="12">
            <img src="./assets/logo_transparent_background.png" height="48">
          </el-col>
          <el-col :span="6" style="text-align: right; color: #000;">
            <i class="fal fa-bars"></i>
          </el-col>
        </el-row>
      </el-header>
      <router-view></router-view>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$store.dispatch("checkWalletConnected");
    document.documentElement.setAttribute("data-theme", "light");
  },
};
</script>

<style>
@import url("./theme.variable.css");

html[data-theme="dark"] {
  --color-primary: #555cff;
  --color-secondary: #f15d59;
  --color-bg: #191b1f;
  --color-text: #fff;
  --color-submenu: #8c8d8f;
  --input-bg: transparent;
  --color-nav-item: #8c8d8f;
  --table-dropdown-bg: rgba(241, 93, 89, 0.1);
  --color-divider-bg: rgba(140, 141, 143, 0.3);
  --color-text-secondary: rgba(255, 255, 255, 0.7);
}

html[data-theme="light"] {
  --color-primary: #555cff;
  --color-secondary: #f15d59;
  --color-bg: #fff;
  --color-text: #191b1f;
  --color-submenu: #191b1f;
  --input-bg: #fafafa;
  --color-nav-item: #191b1f;
  --table-dropdown-bg: #f6f6f6;
  --color-text-secondary: #757679;
}

html {
  overflow-x: hidden;
}

html,
body,
.el-container {
  margin: 0;
  min-height: 100vh;
}

* {
  font-family: "Poppins";
}

body {
  background: var(--color-bg);
  width: 100%;
}

.responsive-table::-webkit-scrollbar {
  display: none;
}

.responsive-table {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.responsive-table > div {
  min-width: max-content;
}
/* FONT WEIGHTS */
h1,
h2,
h3 {
  font-weight: 600 !important;
  color: var(--color-text);
}
.grid-content h2 + span {
  font-weight: 300 !important;
}
.el-form--label-top .el-form-item__label {
  font-weight: 500 !important;
}

.el-footer {
  text-align: center;
  margin-top: 100px;
  font-size: 16px;
  color: #999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  height: 80px !important;
}
.el-footer i.fad {
  margin-right: 0 !important;
}
.el-footer a {
  color: #999;
}
.el-footer a:hover {
  color: var(--color-primary);
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.icon-white {
  font-size: 24px;
  fill: #fff;
  stroke: #fff;
}

body {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text);
  height: 100%;
}

.page_width {
  position: relative;
  max-width: 1450px;
  margin: 0 auto;
  overflow-x: hidden;
}

i.fad {
  margin-right: 6px;
}
i.fad-no-mr {
  margin-right: 0 !important;
}
i.fa-icon-right {
  margin-left: 6px;
  margin-right: 0;
}

.el-main {
  padding-left: 40px !important;
  padding-right: 40px !important;
  margin-top: 36px;
}
.el-header {
  padding: 20px !important;
}

.el-header .el-input__prefix {
  color: var(--color-text);
}
.el-input--prefix .el-input__inner {
  padding-left: 40px !important;
}
.el-header .el-input input {
  border-radius: 24px;
  color: var(--color-text);
  background: var(--input-bg);
}
.el-header .el-input input:focus {
  border-color: var(--color-primary) !important;
}

.el-menu > .el-submenu .el-submenu__title {
  color: var(--color-submenu) !important;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  border: 0 !important;
  padding: 20px 15px;
  background: transparent !important;
  max-height: 80px;
}

.el-menu > .el-submenu i {
  color: var(--color-submenu) !important;
  fill: var(--color-submenu) !important;
}

.el-menu > .el-submenu.sub-is-active .el-submenu__title {
  color: var(--color-secondary) !important;
}

.el-submenu .el-menu-item {
  height: unset !important;
  padding: 5px 15px !important;
  padding-left: 10px !important;
  display: flex;
  align-items: center;
}

.el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
  margin-right: 0 !important;
}
.nav-menu-wrapper > .el-menu-item,
.nav-menu-wrapper > .el-submenu {
  float: left !important;
}
.show-mobile {
  display: none;
}

@media (min-width: 992px) {
  .el-submenu .el-menu--horizontal {
    top: 65px !important;
    position: fixed;
  }

  .hide-desktop {
    display: none;
  }
}
/* Mobile Menu Setting */
@media (max-width: 991px) {
  .el-menu > .el-submenu .el-submenu__title {
    padding: 10px 15px !important;
  }

  .el-submenu .el-menu-item {
    padding-left: 30px !important;
  }

  .el-submenu__icon-arrow {
    right: 0px !important;
  }

  .nav-menu-wrapper > .el-menu-item,
  .nav-menu-wrapper > .el-submenu {
    float: unset !important;
  }
  .show-mobile {
    display: block;
  }
}

header .grid-content button.el-button {
  margin: 2px !important;
}
/* Mobile Menu Setting */
.el-menu > .el-submenu .el-submenu__title i {
  margin-right: 14px;
  text-align: center;
  vertical-align: middle;
  margin-top: unset;
}
.el-popover.nav-wallet {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 6px !important;
}
.el-popover.nav-wallet .el-popover__title {
  color: rgb(29, 29, 29);
}
.el-menu--popup,
.el-menu--inline {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 6px !important;
}
.el-menu--inline {
  border: none;
}
.el-menu--popup .el-menu-item,
.el-menu--inline .el-menu-item {
  font-size: 14px;
  line-height: 20px;
}
.el-menu > .el-submenu .el-submenu__title:hover {
  background: #9093991e !important;
}
.el-menu > .el-submenu .el-submenu__title.is-active {
  color: #f15d59 !important;
}

#farm-listing .el-input__inner {
  border-radius: 24px !important;
  color: #191b1f !important;
  background: #fafafa !important;
}

.search-input .el-input__prefix {
  color: #191b1f;
}

#token-tracker .search-input .el-input__prefix {
  color: #dcdfe6;
}

.search-input .el-input__inner,
#farm-listing .search-input .el-input__inner {
  border-radius: 24px !important;
  color: #191b1f !important;
  background: #fff !important;
}
.search-input .el-input input:focus {
  border-color: var(--color-primary) !important;
}

.el-card {
  border-radius: 18px !important;
}
.el-card .el-alert {
  border-radius: 14px !important;
  align-items: flex-start !important;
  padding: 16px !important;
}
.el-alert__description {
  font-size: 14px !important;
}
.el-alert__title {
  font-size: 16px !important;
}
.el-card h2 {
  color: --color-text;
  font-size: 20px;
  margin-top: 0;
}
.el-divider--vertical {
  width: 2px !important;
  height: 1.5em !important;
  margin: 0 14px !important;
}
.el-card.is-always-shadow {
  box-shadow: 0 0px 12px 0 rgb(21 21 52 / 5%) !important;
}

.farm-row {
  padding: 10px 20px;
  background: var(--color-bg);
  border-radius: 14px;
}
.farm-row:hover,
.farm-row.expanded {
  background: var(--table-dropdown-bg);
}
.farm-row .el-avatar img {
  position: absolute;
  top: -2px;
  left: -2px;
  height: 36px !important;
  width: 36px !important;
}
.farm-list .el-loading-mask {
  border-radius: 14px !important;
}

.popover {
  text-align: center !important;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 12px !important;
  padding: 12px !important;
}

.el-tooltip__popper.is-light {
  border: 1px solid #ebeef5 !important;
  font-weight: bold;
  color: #757679 !important;
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-size: 14px !important;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%) !important;
}

.el-tooltip__popper.is-light .popper__arrow {
  border-width: 0;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
}

.farm-verified {
  text-align: center !important;
  text-transform: uppercase;
  font-weight: bold;
  color: #1ec37f !important;
  border-radius: 12px !important;
  padding: 12px !important;
}
.farm-info {
  text-align: center !important;
  text-transform: uppercase;
  font-weight: bold;
  color: var(--color-primary) !important;
  border-radius: 12px !important;
  padding: 12px !important;
}

.el-dialog {
  border-radius: 18px !important;
}
.el-dialog__header {
  padding-left: 30px !important;
  padding-right: 30px !important;
  font-weight: bold;
}
.el-dialog__body {
  padding: 30px !important;
  padding-top: 0px !important;
}
.lock-dialog input,
.stake-dialog input {
  border-radius: 12px;
  border-width: 2px;
  padding: 20px !important;
}
.stake-dialog .el-input__suffix,
.lock-dialog .el-input__suffix {
  line-height: 44px;
  padding-right: 12px;
}
.stake-dialog .el-input__inner {
  padding-right: 135px !important;
}
.stake-dialog .el-form-item__error {
  right: 14px;
  left: auto;
}
.lock-dialog .el-date-editor.el-input,
.lock-dialog .el-date-editor.el-input__inner {
  width: 100% !important;
}
.lock-dialog .el-alert {
  border-radius: 12px;
  font-size: 12px;
}
.lock-dialog .el-alert__title {
  font-size: 12px !important;
}
.el-dialog__headerbtn {
  border: 1px solid #ebeef5 !important;
  border-radius: 50% !important;
  height: 42px !important;
  width: 42px !important;
}

.el-form--label-top .el-form-item__label {
  font-weight: bold;
  text-transform: uppercase;
  line-height: 22px;
}

.el-table th {
  padding-bottom: 20px !important;
}
.el-table th.is-leaf {
  border-bottom: 2px solid #f4f4f4 !important;
}
.el-table td {
  border-bottom: 1px solid #f4f4f4 !important;
}
.el-table tr:last-child td {
  border-bottom: 0 !important;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  display: none !important;
}
.el-tag--medium {
  border-radius: 16px !important;
}

#farm-listing .el-input__inner,
#nft-wallet-view .el-input__inner {
  border-radius: 24px !important;
  color: #191b1f !important;
  background: #fafafa !important;
}

.el-select__tags {
  left: 8px;
}
.el-select__tags .el-tag.el-tag--info {
  background-color: white !important;
  border-color: #bbbeff;
  color: var(--color-primary);
  border-radius: 16px;
}
.el-input__suffix {
  right: 14px !important;
}
.lp-locker-progress .el-progress__text {
  font-size: 10px !important;
}

/*
* Text styles
*/
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.el-select-dropdown__item.selected {
  color: #ff4d4b !important;
}

/* REPSONSIVE STYLE */

/* divider */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
}
.divider .el-divider.el-divider--vertical {
  height: 100% !important;
  margin: 0 !important;
}

.divider .el-divider.el-divider--horizontal {
  width: 100% !important;
}

@media (min-width: 991px) {
  .divider .el-divider.el-divider--horizontal {
    display: none;
  }
}
@media (max-width: 991px) {
  .divider .el-divider.el-divider--vertical {
    display: none;
  }
}
</style>
