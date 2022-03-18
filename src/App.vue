<template>
  <div id="app">
    <!-- Desktop -->
    <!-- <div class="hidden-sm-and-down"> -->
    <div>
      <NavMenu />
    </div>

    <el-container style="position: relative">
      <router-view></router-view>
    </el-container>
    <!-- </div> -->
  </div>
</template>

<script>
import NavMenu from "./components/NavMenu.vue";
// import JoinDiscord from "./components/JoinDiscord.vue";

export default {
  name: "App",
  components: {
    NavMenu,
    // JoinDiscord,
  },
  created() {
    this.$store.dispatch("checkWalletConnected");
  },
};
</script>

<style>
html,
body,
.el-container {
  margin: 0;
  height: 100%;
}

body {
  background-color: #1f2128;
  background-image: url("./assets/cover-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top right;
}

/* FONT WEIGHTS */
h1,
h2,
h3 {
  font-weight: 600 !important;
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

.wallet-btn {
  background: rgba(85, 92, 255, 0.04) !important;
  border: 1.5px solid #ffffff !important;
  border-radius: 24px !important;
  color: #fff !important;
}

body {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  height: 100%;
}

body:after {
  content: "beta";
  position: fixed;
  z-index: 999;
  width: 80px;
  height: 25px;
  background: #f6f6f6;
  top: 5px;
  left: -22px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: bold;
  color: #999;
  line-height: 27px;
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  box-shadow: 0 0px 12px 0 rgb(21 21 52 / 10%);
  border: 1px solid #ebeef5;
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
  color: #191b1f;
}
.el-input--prefix .el-input__inner {
  padding-left: 40px !important;
}
.el-header .el-input input {
  border-radius: 24px;
  color: #191b1f;
  background: #fafafa;
}
.el-header .el-input input:focus {
  border-color: #555cff !important;
}
.el-menu > .el-submenu .el-submenu__title {
  color: #ffffff !important;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  border: 0 !important;
  padding: 40px 15px;
  background: transparent !important;
  max-height: 80px;
}

.nav-menu-wrapper > .el-menu-item,
.nav-menu-wrapper > .el-submenu {
  float: left !important;
}

.show-mobile {
  display: none;
}

/* Mobile Menu Setting */
@media (max-width: 992px) {
  .el-menu > .el-submenu .el-submenu__title {
    padding-top: 20px !important;
    padding-bottom: 20px !important;
  }
  .nav-menu-wrapper > .el-menu-item,
  .nav-menu-wrapper > .el-submenu {
    float: unset !important;
  }

  .show-mobile {
    display: block;
  }
}

/* Mobile Menu Setting */

.el-menu > .el-submenu .el-submenu__title i {
  margin-right: 14px;
  text-align: center;
  vertical-align: middle;
  color: #fff;
}

.el-popover.nav-wallet {
  color: rgb(255, 255, 255);
  background: rgba(31, 33, 40, 1) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 6px !important;
}

.el-popover.nav-wallet .el-popover__title {
  color: rgb(196, 196, 196);
}

.el-menu--popup,
.el-menu--inline {
  background: rgba(31, 33, 40, 0.8) !important;
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

.el-menu > .el-submenu .el-submenu__title:hover,
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
.search-input .el-input__inner,
#farm-listing .search-input .el-input__inner {
  border-radius: 24px !important;
  color: #191b1f !important;
  background: #fff !important;
}
.search-input .el-input input:focus {
  border-color: #555cff !important;
}

div.el-card__body {
  box-sizing: border-box;
  border-radius: 18px;
  background: #1f2128;
}

.el-card {
  border-radius: 18px !important;
  background: #1f2128 !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  background-color: rgba(21, 21, 52, 0.04) !important;
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
  color: #fff;
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
  background: transparent;
  border-radius: 14px;
}
.farm-row * {
  color: #fff;
}
.farm-row:hover,
.farm-row.expanded {
  background: rgba(241, 93, 89, 0.1);
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
</style>
