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
            style="color: #555cff; margin-left: 6px"
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
  },
};
</script>

<style>
@import url("./theme.variables.css");
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
  transition: 0.1s ease all;
}

body {
  background: var(--background-color);
  color: var(--primary-text) !important;
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
  color: var(--primary-text);
}

p {
  margin: 0;
}

h4,
h5,
h6,
p {
  color: var(--primary-text);
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
  color: #555cff;
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
  color: var(--primary-text);
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
  color: var(--primary-text);
}
.el-input--prefix .el-input__inner {
  padding-left: 40px !important;
}
.el-header .el-input input {
  border-radius: 24px;
  color: var(--primary-text);
  background: transparent;
  border: var(--line-border);
}
.el-header .el-input input:focus {
  border-color: #555cff !important;
}

.el-menu > .el-submenu .el-submenu__title {
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
}

.el-menu > .el-submenu i {
  color: var(--nav-item) !important;
  fill: var(--nav-item) !important;
}

.el-menu > .el-submenu.sub-is-active .el-submenu__title {
  color: var(--color-menu-active) !important;
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
  border: var(--line-color) !important;
  border-radius: 6px !important;
}
.el-dropdown-menu,
.el-popover {
  background-color: var(--background-card) !important;
  border: var(--line-border) !important;
  color: var(--primary-text) !important;
}
.el-popover__title {
  color: var(--color-subheading-text) !important;
}

.el-popover.nav-wallet .el-popover__title {
  color: var(--primary-text);
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
  color: var(--primary-text) !important;
  background: transparent !important;
}

.search-input .el-input__prefix {
  color: var(--primary-text);
}

#token-tracker .search-input .el-input__prefix {
  color: #dcdfe6;
}

.search-input .el-input__inner,
#farm-listing .search-input .el-input__inner {
  border-radius: 24px !important;
  color: var(--primary-text) !important;
  background: transparent !important;
  border: var(--line-border);
}
.search-input .el-input input:focus {
  border-color: #555cff !important;
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
  color: var(--primary-text);
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
  background: var(--background-card);
  border-radius: 14px;
}
.farm-row:hover,
.farm-row.expanded {
  background: var(--table-row-hover);
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
  border: var(--line-border) !important;
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
  color: #555cff !important;
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
  border: var(--line-border) !important;
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
  color: var(--primary-text) !important;
  background: transparent !important;
  border: var(--line-border);
}

.el-select__tags {
  left: 8px;
}
.el-select__tags .el-tag.el-tag--info {
  background-color: white !important;
  border-color: #bbbeff;
  color: #555cff;
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
  color: var(--color-menu-active) !important;
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

/* THEME SPECIFIC */
.el-card {
  background: var(--background-card) !important;
  border: var(--line-border) !important;
}

.el-divider {
  background: var(--border-color) !important;
}

.el-menu.el-menu--popup,
.el-select-dropdown,
.el-dialog {
  background-color: var(--background-card) !important;
  border: var(--line-border) !important;
}

.el-dialog__title {
  color: var(--primary-text) !important;
}

body .el-row {
  color: var(--primary-text);
}

body .el-table,
.el-table * {
  background-color: var(--background-card) !important;
}

.el-card,
.el-table__body-wrapper {
  color: var(--primary-text) !important;
}

body .el-table__body td {
  border: 0 !important;
}

body .el-table__header th,
.el-table th.is-leaf {
  border-bottom: var(--line-border) !important;
  color: var(--color-subheading-text) !important;
}

body .el-table .el-link {
  color: var(--color-subheading-text) !important;
}

body .el-table .el-link:hover {
  color: var(--link-btn-color) !important;
  text-decoration: none !important;
}

.el-progress__text {
  color: var(--color-subheading-text) !important;
}

.el-tabs__nav-wrap::after {
  background: var(--border-color) !important;
  height: 1px !important;
}

html[data-theme="dark"] .el-loading-mask {
  background: rgba(25, 27, 31, 0.9);
}

html[data-theme="dark"] .el-avatar {
  border-color: transparent !important;
  border-width: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  box-sizing: border-box;
}

html[data-theme="dark"] .el-avatar img {
  top: unset;
  left: unset;
}

html[data-theme="dark"] .el-card.is-always-shadow {
  box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.25) !important;
}

html[data-theme="dark"] .el-tooltip__popper.is-light {
  background: var(--background-card) !important;
  color: var(--primary-text) !important;
}

html[data-theme="dark"] ._info-card {
  background: #303135 !important;
  color: #ffffff;
}

html[data-theme="dark"] ._info-card ._info-card__title {
  color: #97989a;
}

html[data-theme="dark"] ._action-btn {
  background: #2a2c33;
  color: #d4d5d6;
}

.el-select-dropdown__item,
.el-dropdown-menu__item {
  color: var(--nav-item) !important;
  background: var(--background-card) !important;
}
.el-select-dropdown__item:hover,
.el-dropdown-menu__item:hover {
  background: #9093991e !important;
}

.el-select-dropdown__item.selected,
.el-dropdown-menu__item.selected {
  color: var(--primary-text) !important;
}

html[data-theme="dark"] .el-button.is-disabled {
  position: relative;
  overflow: hidden;
  opacity: 0.4;
  /* background-color: unset; */
}

/* html[data-theme="dark"] .el-button.is-disabled::before { */
/* position: absolute;
  top: 0;
  bottom: 0;
  left: -1px;
  right: -1px;
  content: "";
  background: #0000001e; */
/* } */

.el-picker-panel,
.el-picker-panel__footer {
  background: var(--background-card) !important;
  border: var(--line-border) !important;
  color: var(--primary-text) !important;
}

.el-date-table td.available {
  color: var(--primary-text) !important;
}

.el-date-table td.in-range div {
  background-color: #9093991e !important;
}

.el-picker-panel__icon-btn,
.el-date-picker__header-label,
.el-date-range-picker .el-picker-panel__content,
.el-date-table td.next-month,
.el-date-table td.prev-month {
  color: var(--color-subheading-text) !important;
}

input {
  background: var(--background-card) !important;
  color: var(--primary-text) !important;
}

/* customs */

._with-bg-image .el-card__body {
  background: url("./assets/taco-card-bg.png");
  background-repeat: no-repeat;
  background-size: 25%;
  background-position: 96% 95%;
}
</style>
