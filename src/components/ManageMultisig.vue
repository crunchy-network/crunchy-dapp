<template>
  <div>
    <nav-menu></nav-menu>
    <el-main class="page_width">
      <el-row type="flex" align="middle">
        <router-link
          tag="a"
          class="link-text"
          :to="{ name: 'home' }"
          type="text"
          style="
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            color: #555cff;
            text-decoration: none;
          "
        >
          Home
        </router-link>

        <i
          style="font-size: 12px; color: #c0c4cc; margin: 0 5px"
          class="fa-solid fa-angle-right"
        ></i>

        <router-link
          tag="a"
          class="link-text"
          :to="{ name: 'multisig' }"
          type="text"
          style="
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            color: #555cff;
            text-decoration: none;
          "
        >
          Multisig
        </router-link>
        <i
          style="font-size: 12px; color: #c0c4cc; margin: 0 5px"
          class="fa-solid fa-angle-right"
        ></i>
        <span
          disabled
          type="text"
          style="
            font-weight: 600;
            font-size: 16px;
            color: #c0c4cc;
            line-height: 24px;
          "
        >
          {{ multisig.alias }}({{ $route.params.multisigAddress }})
        </span>
      </el-row>

      <div style="margin: 40px 0 32px 0">
        <h2 class="lg">
          {{ multisig.alias }}
        </h2>
        <el-row type="flex" align="middle">
          <p class="light-text">{{ $route.params.multisigAddress }}</p>
          <button class="_clear-btn" @click="copyAddress">
            <i class="fa-solid fa-copy light-text"></i>
          </button>
          <el-popover
            v-model="copied"
            placement="bottom"
            width="90"
            trigger="manual"
            content="address copied"
          >
          </el-popover>
        </el-row>
      </div>

      <el-row
        style="
          margin-bottom: 24px;
          border-bottom: 1.5px solid rgba(117, 118, 121, 0.1);
          align-items: center;
          flex-wrap: wrap-reverse;
          gap: 10px;
        "
        :gutter="20"
        type="flex"
        justify="space-between"
        align="bottom"
      >
        <div class="tab-wrapper">
          <button
            class="tab-text"
            :style="isActiveTab('history')"
            @click="setActiveTab('history')"
          >
            History
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('tokens')"
            @click="setActiveTab('tokens')"
          >
            Tokens
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('nfts')"
            @click="setActiveTab('nfts')"
          >
            NFTs
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('admins')"
            @click="setActiveTab('admins')"
          >
            Admins
          </button>
        </div>
      </el-row>

      <multisig-history-tab
        v-if="activeTab === 'history'"
      ></multisig-history-tab>

      <MultisigTokensTab v-if="activeTab === 'tokens'" />
    </el-main>
  </div>
</template>

<script>
import MultisigHistoryTab from "./MultisigHistoryTab.vue";
import NavMenu from "./NavMenu.vue";
import MultisigTokensTab from "./MultisigTokensTab.vue";
export default {
  name: "ManageMultisig",
  components: { NavMenu, MultisigHistoryTab, MultisigTokensTab },
  data() {
    return {
      copied: false,
      activeTab: "history",
      multisigAddress: "",
      multisig: {
        alias: "CrunchyMultisig.tez",
      },
    };
  },
  mounted() {},
  methods: {
    isActiveTab(tab) {
      return (
        this.activeTab === tab &&
        " border-bottom: 6px solid #555CFF; color: #555CFF"
      );
    },

    setActiveTab(tab = "") {
      if (["history", "nfts", "tokens", "admins"].includes(tab)) {
        this.activeTab = tab;
      }
    },
    copyAddress() {
      navigator.clipboard.writeText(this.$route.params.multisigAddress);
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 1500);
    },
  },
};
</script>

<style lang="scss">
.tab-wrapper {
  display: flex;
  align-items: flex-start;
  padding: 0 40px;
  @media (max-width: 768px) {
    padding: 0 0 0 0px;
  }
}

.tab-text {
  min-width: 100px;
  text-align: center;
  padding: 5px 20px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: #191b1f;
  cursor: pointer;
  transition: 0.3s ease all;
  margin: 0;
  border: 0;
  background: transparent;
  border-bottom: 6px solid transparent;
  &:disabled {
    color: #191b1f66;
    cursor: not-allowed;
  }
}

.el-popover {
  min-width: max-content;
  padding: 3px;
}
</style>
