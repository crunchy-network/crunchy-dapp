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

<style lang="scss">
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
  transition: 0.17s ease-in-out color, 0.17s ease-in-out background-color,
    0.17s ease-in-out border-color;
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
  font-weight: 400 !important;
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
  margin-top: 20px;
  @media (max-width: 450px) {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
.el-card__body {
  @media (max-width: 450px) {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
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
    z-index: 2 !important;
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
  background: var(--background-card) !important;
  border: var(--line-border);
  box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.25) !important;
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
  @media (max-width: 450px) {
    padding-left: 0;
    padding-right: 0;
  }
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

.el-loading-mask {
  border-radius: 18px !important;
  z-index: 1 !important;
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
.ruler {
  border: var(--line-border);
}

.el-switch__label:not(.is-active) span {
  color: #8c8d8f;
}
.el-switch__core {
  background: #555cff !important;
  border-color: #555cff !important;
}
.el-tabs__active-bar {
  background-color: var(--color-menu-active) !important;
}
.el-tabs__item:hover {
  color: #8c8d8f !important;
}

.el-tabs__item.is-active {
  color: var(--color-menu-active) !important;
}
.el-tabs__item:not(.is-active) {
  color: #8c8d8f !important;
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
  left: auto;
}
.stake-infor {
  margin-top: 14px;
  margin-bottom: 8px;
  font-weight: 200;
}
.stake-warning {
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #303135 !important;
  color: #ffffff;
  padding: 10px;
  text-align: center;
}
.stake-warning__content {
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: #8c8d8f;
}
.stake-warning__notice {
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
  color: #ffffff;
}
.lock-dialog .el-date-editor.el-input,
.lock-dialog .el-date-editor.el-input__inner {
  width: 100% !important;
}
.lock-dialog .el-alert {
  border-radius: 12px;
  font-size: 12px;
  background-color: #303135 !important;
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

#create-token .el-form--label-top .el-form-item__label {
  text-transform: none !important;
}

#farm-create  {
  .el-form-item__label {
    width: 200px !important;
    text-align: left;
  }
  .el-form-item__content {
    margin-left: 0px !important;
    width: 100%;
    div {
      padding-left: 0 !important;
    }
  }
  .el-form-item {
    display: flex;
    flex-direction: column;
  }
  .el-date-editor.el-input__inner {
    width: 100% !important;
    display: flex;
    justify-content: space-evenly;
  }
  .token {
    display: flex;
    .el-form-item {
      flex: 1;
      overflow: hidden;
    }
    .el-form-item:first-child {
      flex: 0 0 80%;
    }
    .el-form-item:nth-child(2) {
      .el-form-item__content {
        width: 100%;
        div {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      }
    }
  }
  .serviceFee {
    .el-form-item__content {
      div {
        width: 100% !important;
      }
    }
  }
  .rewardAmount {
    display: flex;
    flex: 1;
    .el-form-item:first-child {
      flex: 0 0 100%;
    }
    .el-input {
      width: 100% !important;
    }
  }
  .bonus {
    display: flex;
    flex: 1;
    .el-date-editor.el-input {
      width: 50% !important;
    }
    .el-form-item:first-child {
      flex: 0 0 100%;
    }
    .el-form-item__content div {
      width: 35% !important;
    }
  }
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

.el-upload-list__item-name {
  font-size: medium;
}
el-upload-list__item {
  display: flex !important;
}
.el-upload-list__item:hover {
  background: none !important;
}
.el-upload-list__item-name {
  display: inline-block !important;
  margin-right: 10px !important;
}
.el-upload-list__item .el-icon-close {
  color: red !important;
  font-weight: 600;
  font-size: large;
  display: inline-block !important;
  position: relative !important;
  top: -6px !important;
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
.el-dialog,
.el-autocomplete-suggestion {
  background-color: var(--background-card) !important;
  border: var(--line-border) !important;
}

.el-autocomplete-suggestion ul li {
  color: var(--primary-text) !important;
  &:hover {
    background-color: var(--table-row-hover) !important;
  }
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

.el-button.is-disabled {
  opacity: 0.3 !important;
  /* background-color: unset; */
}

button:disabled {
  opacity: 0.3 !important;
}

button {
  transition: 0.2s ease all;
}

.el-picker-panel,
.el-picker-panel__footer,
.el-time-panel {
  background: var(--background-card) !important;
  border: var(--line-border) !important;
  color: var(--primary-text) !important;
}

.el-time-spinner__item {
  color: var(--color-subheading-text) !important;
}

.el-date-table td.available,
.el-time-spinner__item.active {
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

.btn-alt__ {
  background: var(--btn-alt-bg) !important;
  color: var(--btn-alt-color) !important;
  border: var(--btn-alt-border) !important;
  &:hover {
    background: var(--btn-alt-hover) !important;
    color: var(--btn-alt-hover-color) !important;
  }
}

.btn-alt__1 {
  background: var(--btn-alt-1-bg) !important;
  color: var(--btn-alt-1-color) !important;
  border: var(--btn-alt-1-border) !important;
  &:hover {
    background: var(--btn-alt-1-hover) !important;
    color: var(--btn-alt-1-hover-color) !important;
  }
}

.btn-alt__2 {
  background: var(--btn-alt-2-bg) !important;
  color: var(--btn-alt-2-color) !important;
  border: var(--btn-alt-2-border) !important;
  &:hover {
    background: var(--btn-alt-2-hover) !important;
    color: var(--btn-alt-2-hover-color) !important;
  }
}

.btn-alt__3 {
  background: var(--btn-alt-3-bg) !important;
  color: var(--btn-alt-3-color) !important;
  border: var(--btn-alt-3-border) !important;
  &:hover {
    background: var(--btn-alt-3-hover) !important;
    color: var(--btn-alt-3-hover-color) !important;
  }
}

.btn-alt__4 {
  background: var(--btn-alt-4-bg) !important;
  color: var(--btn-alt-4-color) !important;
  border: var(--btn-alt-4-border) !important;
  &:hover {
    background: var(--btn-alt-4-hover) !important;
    color: var(--btn-alt-4-hover-color) !important;
  }
}

.btn-text__ {
  background: transparent !important;
  color: var(--btn-text-color) !important;
  border: 0 !important;
  &:hover {
    color: var(--btn-text-hover-color) !important;
  }
}

.el-dialog__headerbtn {
  background: var(--btn-alt-1-bg) !important;
  color: var(--btn-alt-1-color) !important;
  border: var(--btn-alt-1-border) !important;
  &:hover {
    background: var(--btn-alt-1-hover) !important;
    color: var(--btn-alt-1-hover-color) !important;
    i {
      color: var(--btn-alt-1-hover-color) !important;
    }
  }
}

.custom-tab__wrapper {
  display: flex;
  align-items: flex-start;
  .tab-text {
    min-width: 100px;
    text-align: center;
    padding: 2px 10px;
    padding-bottom: 4.5px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    text-transform: capitalize;
    color: var(--color-menu-inactive);
    cursor: pointer;
    transition: 0.2s ease all;
    margin: 0;
    border: 0;
    border-bottom: 0.5px solid var(--color-menu-inactive);
    background: transparent;
    &:disabled {
      opacity: 0.4;
      color: var(--color-menu-inactive);
      cursor: not-allowed;
    }
    &.is-active {
      color: var(--color-menu-active);
      padding-bottom: 2px;
      border-bottom: 3px solid var(--color-menu-active);
    }
  }
}

._info-card {
  border-radius: 8px;
  padding: 10px 20px;
  word-break: keep-all;
}

.el-picker-panel__footer .el-button:nth-child(2) {
  background: #555cff !important;
  color: #fff !important;
  border-color: #555cff !important;
}

.el-date-range-picker__time-header,
.el-date-range-picker__content.is-left,
.el-date-picker__time-header {
  border-color: var(--border-color) !important;
}

.el-date-range-picker__header,
.el-date-picker__header {
  * {
    color: var(--primary-text) !important;
  }
}

/*
* Light Theme
*/
html[data-theme="light"] {
  .el-select__tags .el-tag.el-tag--info {
    background: rgba(0, 0, 0, 0.08) !important;
    border: 0 !important;
    color: rgba(0, 0, 0, 0.87);
    i {
      background: #9e9e9e;
      color: #4a4a4a;
    }
  }
  .coin-icon {
    filter: invert(9%) sepia(18%) saturate(377%) hue-rotate(181deg)
      brightness(99%) contrast(96%);
  }
  .lock-display {
    background: #f4f4f5;
  }
  .el-textarea__inner {
    color: var(--primary-text);
    border-color: var(--border-color);
    height: 100px;
    border-radius: 0px;
  }
  .el-textarea__inner::placeholder {
    color: #8c8d8f;
  }
  .el-textarea__inner:focus {
    border-color: #555cff !important;
  }
  .warning-modal {
    color: #23262f;
  }
}

/*
* Dark Theme
*/

html[data-theme="dark"] {
  .el-select__tags .el-tag.el-tag--info {
    background: rgba(255, 255, 255, 0.2) !important;
    border: 0 !important;
    color: #ffffff;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    i {
      background: #9e9e9e;
      color: #4a4a4a;
    }
  }

  .coin-icon {
    filter: invert(64%) sepia(5%) saturate(118%) hue-rotate(182deg)
      brightness(87%) contrast(89%);
  }
  .el-date-table th,
  .el-time-panel__footer,
  .el-time-panel__content::after,
  .el-time-panel__content::before {
    border-color: var(--border-color) !important;
  }

  .el-date-table td.disabled div {
    background-color: transparent !important;
    opacity: 0.4;
  }

  .el-date-table .available .in-range {
    background: #303135;
  }

  ._info-card {
    background: #303135 !important;
    color: #ffffff;
  }

  ._info-card ._info-card__title {
    color: #97989a;
  }

  ._action-btn,
  ._action-btn.is-disabled,
  ._action-btn.is-disabled:hover {
    background: #2a2c33 !important;
    color: #d4d5d6;
  }

  .el-tooltip__popper.is-light {
    background: var(--background-card) !important;
    color: var(--primary-text) !important;
  }
  .el-card.is-always-shadow {
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.25) !important;
  }
  .el-avatar img {
    top: unset;
    left: unset;
  }
  .el-avatar {
    border-color: transparent !important;
    border-width: 0 !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: transparent;
    box-sizing: border-box;
  }

  .el-loading-mask {
    background: rgba(25, 27, 31, 0.9);
  }

  path.el-progress-circle__track {
    stroke: var(--border-color) !important;
  }

  .el-popper[x-placement^="bottom"] .popper__arrow::after {
    border-bottom-color: var(--background-card) !important;
  }
  .el-popper[x-placement^="top"] .popper__arrow::after {
    border-top-color: var(--background-card) !important;
  }
  .el-popper[x-placement^="left"] .popper__arrow::after {
    border-left-color: var(--background-card) !important;
  }
  .el-popper[x-placement^="right"] .popper__arrow::after {
    border-right-color: var(--background-card) !important;
  }

  .el-popper[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: var(--border-color) !important;
  }
  .el-popper[x-placement^="left"] .popper__arrow {
    border-left-color: var(--border-color) !important;
  }
  .el-popper[x-placement^="right"] .popper__arrow {
    border-right-color: var(--border-color) !important;
  }
  .el-popper[x-placement^="top"] .popper__arrow {
    border-top-color: var(--border-color) !important;
  }

  .el-tag,
  .el-time-spinner__item:hover:not(.disabled):not(.active) {
    background: var(--badge-background) !important;
    border-color: var(--border-color) !important;
  }

  .el-date-picker__header--bordered {
    border-color: var(--border-color) !important;
  }

  .el-time-spinner__item.disabled {
    opacity: 0.4;
  }

  .el-time-panel__btn.cancel {
    color: var(--color-subheading-text) !important;
  }

  i.el-tooltip {
    color: var(--color-subheading-text) !important;
  }

  .el-month-table td,
  .el-year-table td {
    .cell {
      color: var(--color-subheading-text);
    }

    &.today .cell {
      color: var(--primary-text);
    }

    &.current .cell {
      color: #555cff !important;
    }

    &.disabled,
    &.disabled:hover {
      .cell {
        color: var(--color-subheading-text);
        opacity: 0.4;
        background: var(--badge-background);
      }
    }

    &:hover {
      .cell {
        color: var(--link-btn-color);
      }
    }
  }

  .el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
    border-top-color: var(--border-color) !important;
  }

  .el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
    border-bottom-color: var(--border-color) !important;
  }

  .el-tooltip__popper[x-placement^="left"] .popper__arrow::after {
    border-left-color: var(--border-color) !important;
  }

  .el-tooltip__popper[x-placement^="right"] .popper__arrow::after {
    border-right-color: var(--border-color) !important;
  }
  .el-textarea__inner {
    background-color: #191b1f !important;
    border-color: var(--border-color);
    height: 100px;
    color: var(--primary-text);
  }
  .el-textarea__inner::placeholder {
    color: #8c8d8f;
  }
  .el-textarea__inner:focus {
    border-color: #555cff !important;
  }
  .el-upload-list__item-name {
    color: var(--primary-text);
  }
  .warning-modal {
    color: var(--primary-text);
  }

  ::-webkit-scrollbar {
    width: 12px;
    right: 0;
    -webkit-transition: all 300ms;
    transition: all 300ms;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #303236;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-track {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 2px solid #303236;
    border-radius: 6px;
    background-color: #1f2128;
  }
}
</style>
