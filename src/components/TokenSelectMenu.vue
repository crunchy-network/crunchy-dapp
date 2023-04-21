<template>
  <div :id="`${id}-asset-selection-container`" class="form-container">
    <div
      v-if="selectedToken"
      :id="`${id}-select-asset-dropdown`"
      class="selected-asset-container"
      @click="openMenu"
    >
      <div class="img-container">
        <img
          shape="circle"
          :src="selectedToken.icon"
          :size="30"
          class="img-style"
          @error="hideBrokenImage"
          @load="showLoadedImage"
        />
      </div>
      <span class="selected-asset-input">{{ selectedToken.asset }} </span>
      <img src="../assets/svg-icons/caret-down.svg" />
    </div>
    <el-dialog
      :id="`${id}-asset-menu-dropdown-select`"
      :visible="open"
      :title="'Select a Token'"
      class="asset-menu-dialog"
      @close="closeMenu"
    >
      <div class="asset-menu-contents">
        <el-input
          v-model="searchFilter"
          placeholder="search..."
          class="asset-search-filter"
        />
        <div class="scrollable-list">
          <div
            v-for="(asset, index) in filteredAssets()"
            :key="`${asset.contract}_${index}`"
            class="asset-item"
            @click="selectAsset(asset)"
          >
            <el-avatar
              shape="circle"
              :src="asset.icon"
              :size="30"
              style="
                background: transparent;
                font-size: 24px;
                margin-right: 16px;
                margin-left: 15px;
              "
            ></el-avatar>
            <span class="selected-asset-input">{{ asset.asset }} </span>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-input
      v-if="!inputDisabled"
      :id="`${id}-swap-amount`"
      :value="amount"
      :class="`asset-swap-amount ${getInputFontSize}`"
      type="number"
      @input="onAmountChange"
    />
    <div
      v-if="inputDisabled"
      :class="`asset-swap-amount-placeholder ${getInputFontSize}`"
    >
      {{ amount }}
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  // props: ["list", "onChange", "amount", "id", "inputDisabled", "selectedToken"],
  props: {
    list: { type: Array, required: true },
    onChange: { type: Function, required: true },
    amount: { type: [String, Number], default: 0 },
    id: { type: String, required: true },
    inputDisabled: { type: Boolean, default: false },
    selectedToken: { type: Object, required: true },
  },
  data: function () {
    return {
      open: false,
      searchFilter: "",
      defaultAssets: [
        "crnchy",
        "xtz",
        "tzbtc",
        "kusd",
        "usdt",
        "uusd",
        "usdtz",
        "gif",
        "quipu",
        "plenty",
      ],
    };
  },
  computed: {
    ...mapGetters(["isWalletConnected"]),
    getInputFontSize() {
      if (!this.$props.amount) return "";
      const amountString = this.$props.amount.toString();
      if (amountString.length > 15) {
        return "really-mini-font";
      }
      if (amountString.length > 11) {
        return "mini-font";
      }

      return "";
    },
  },
  methods: {
    onAmountChange(e) {
      this.$props.onChange({ amount: e });
    },
    closeMenu() {
      this.open = false;
    },
    openMenu() {
      this.open = true;
    },
    hideBrokenImage(e) {
      e.target.style.opacity = 0;
    },
    showLoadedImage(e) {
      e.target.style.opacity = 1;
    },

    handleFocusInput(event) {
      const el = document.getElementById(
        `${this.$props.id}-asset-selection-container`
      );
      if (!el) {
        return;
      }
      if (el !== event.target && !el.contains(event.target)) {
        el.classList.remove("active");
      } else {
        el.classList.add("active");
      }
    },
    selectAsset(asset) {
      this.$props.onChange({
        asset,
      });
      this.open = false;
      this.searchFilter = "";
      const el = document.getElementById(`${this.$props.id}-swap-amount`);
      if (el) {
        el.focus();
      }
    },

    applyFilter(token) {
      const search = this.searchFilter.toLowerCase();
      if (token.asset) {
        if (token.asset.toLowerCase().includes(search)) {
          return true;
        }
      }
      if (token.assetSlug) {
        if (token.assetSlug.toLowerCase().includes(search)) {
          return true;
        }
      }
      if (token.name) {
        if (token.name.toLowerCase().includes(search)) {
          return true;
        }
      }
      return false;
    },

    getDefaultList() {
      if (!this.$props.inputDisabled) {
        if (this.isWalletConnected) {
          // return list of user's tokens for input list if their wallet is connected;
          return this.$props.list.slice(0, 10);
        }
      }
      const defaults = this.defaultAssets;
      const defaultList = this.$props.list.filter((token) => {
        return defaults.includes(token.asset?.toLowerCase());
      });
      // sorts default list in order of priority of our favorite tokens.
      // priority is managed by it's position in the defaultAsstes array.
      defaultList.sort((a, b) => {
        return (
          defaults.indexOf(a.asset.toLowerCase()) -
          defaults.indexOf(b.asset.toLowerCase())
        );
      });
      return defaultList;
    },
    filteredAssets() {
      if (this.searchFilter === "") {
        return this.getDefaultList();
      }
      const toRet = this.$props.list.filter(this.applyFilter);
      if (toRet.length > 10) {
        return toRet.slice(0, 10);
      } else {
        return toRet;
      }
    },
  },
};
</script>

<style lang="scss">
.el-input__inner {
  background: transparent;
  color: var(--primary-text) !important;
  border-color: var(--border-color);

  &::placeholder {
    color: var(--color-subheading-text);
  }
}
.selected-asset-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.img-container {
  height: 30px;
  width: 30px;
  display: flex;
  border-radius: 50%;
  background-color: transparent;
}
.selected-asset-input {
  margin-left: 10px;
  margin-right: 10px;
  font-size: 22px;
  font-weight: 600;
  color: var(--primary-text);
}
.asset-selection {
  display: flex;
  position: relative;
  border-radius: 18px;
  border: 1px solid rgba(25, 27, 31, 0.1);
  padding: 16px 24px;
  &:hover {
    border-color: #c0c4ccb2;
  }
  &:focus-within {
    border-color: #555cff;
  }
  &.active {
    border-color: #555cff !important;
  }
}
.asset-menu {
  position: absolute;
  top: -10px;
  left: -10px;
  padding: 10px;
  width: 150px;
  z-index: 1;
}
.asset-menu-contents {
  background: var(--background-card);
  max-height: 400px;
  overflow-y: hidden;
  .asset-item {
    padding: 4px 2px;
    border-radius: 24px;
    display: flex;
    justify-content: start;
    cursor: pointer;
    &:hover {
      background: var(--table-row-hover);
    }
  }
}
.scrollable-list {
  max-height: 340px;
  margin-bottom: 10px;
  overflow-y: scroll;
}
.asset-menu-dialog {
  .el-dialog {
    width: 95%;
    max-width: 420px;
    background: var(--background-card);
    span {
      color: var(--primary-text);
    }
  }
  .el-dialog__headerbtn {
    display: none;
  }
}
.el-card {
  overflow: visible;
}
.asset-swap-amount {
  border: none;
  input {
    text-align: right;
    color: black;
    font-size: 24px;
    font-weight: 600;
    border: none;
  }
  & .mini-font {
    input {
      font-size: 18px;
    }
  }
  & .really-mini-font {
    input {
      font-size: 12px;
    }
  }
}

.asset-swap-amount-placeholder {
  text-align: right;
  color: var(--primary-text);
  font-size: 24px;
  font-weight: 600;
  border: none;
  width: 100%;
  padding-right: 15px;
  display: flex;
  align-items: center;
  justify-content: right;
  &.mini-font {
    font-size: 18px;
  }
  &.really-mini-font {
    font-size: 16px;
  }
}

.asset-search-filter {
  margin-bottom: 24px;
  .el-input__inner {
    border-radius: 24px;
  }
}
.img-style {
  height: 30px;
  width: 30px;
  line-height: 30px;
  background: transparent;
  font-size: 24px;
  border-radius: 50%;
}
.form-container {
  width: 100%;
  display: flex;
  position: relative;
}
.value-estimate {
  width: 100%;
  text-align: right;
}
</style>
