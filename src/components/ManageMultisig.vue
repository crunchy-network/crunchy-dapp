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
          align-items: end;
          gap: 10px;
        "
        :gutter="20"
        type="flex"
        justify="space-between"
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

        <el-dropdown trigger="click">
          <el-button
            type="primary"
            round
            plain
            style="
              background: #fff;
              border: 1.5px solid #555cff;
              font-weight: 600;
              margin-bottom: 5px;
              color: #555cff;
            "
          >
            Action<i
              style="margin-left: 10px; font-size: 18px"
              class="fa-solid fa-angle-down"
            ></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="dropdown-wrapper">
            <el-dropdown-item tabindex="0">
              Create Token Transfer
            </el-dropdown-item>
            <el-dropdown-item tabindex="1"
              >Create NFT Transfer</el-dropdown-item
            >
            <el-dropdown-item tabindex="2">Create Delegation</el-dropdown-item>
            <el-dropdown-item tabindex="3" @click.native="toggleUpdateModal"
              >Update Contract</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>

      <multisig-history-tab
        v-if="activeTab === 'history'"
      ></multisig-history-tab>

      <MultisigTokensTab v-if="activeTab === 'tokens'" />
      <MultisigNFTsTab v-if="activeTab === 'nfts'" />
      <MultisigAdminsTab v-if="activeTab === 'admins'" />
    </el-main>

    <UpdateContract
      :show-modal="showUpdateModal"
      :toggle-modal="toggleUpdateModal"
    >
    </UpdateContract>
    <CreateTokenTransfer
      :show-modal="showTokenModal"
      :toggle-modal="toggleTokenModal"
    />
  </div>
</template>

<script>
import MultisigHistoryTab from "./MultisigHistoryTab.vue";
import NavMenu from "./NavMenu.vue";
import MultisigTokensTab from "./MultisigTokensTab.vue";
import MultisigNFTsTab from "./MultisigNftsTab.vue";
import MultisigAdminsTab from "./MultisigAdminsTab.vue";
import UpdateContract from "./multisig/UpdateContract.vue";
import CreateTokenTransfer from "./multisig/CreateTokenTransfer.vue";
export default {
  name: "ManageMultisig",
  components: {
    NavMenu,
    MultisigHistoryTab,
    MultisigTokensTab,
    MultisigNFTsTab,
    MultisigAdminsTab,
    UpdateContract,
    CreateTokenTransfer,
  },
  data() {
    return {
      copied: false,
      showUpdateModal: false,
      showTokenModal: true,
      activeTab: "nfts",
      multisigAddress: "",
      multisig: {
        alias: "CrunchyMultisig.tez",
      },
    };
  },
  mounted() {},
  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab && " border-bottom: 6px solid #555CFF;";
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

    toggleUpdateModal() {
      this.showUpdateModal = !this.showUpdateModal;
    },
    toggleTokenModal() {
      this.showTokenModal = !this.showTokenModal;
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
  color: #555cff;
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

.dropdown-wrapper {
  padding: 0;
  li {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.02em;
    color: rgba(25, 27, 31, 0.6);
    padding: 14px 16px;
  }
  li:hover {
    background: rgba(85, 92, 255, 0.05) !important;
    color: #191b1f !important;
  }
}
</style>
