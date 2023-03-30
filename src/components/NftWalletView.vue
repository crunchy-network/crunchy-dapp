<template>
  <div
    id="nft-wallet-view"
    style="min-height: 50vh; display: flex; flex-direction: column"
  >
    <el-row
      type="flex"
      style="justify-content: space-between; margin-bottom: 0px"
    >
      <el-row type="flex" align="middle">
        <el-button
          :disabled="viewPage === 'collections'"
          type="text"
          style="font-weight: 600; font-size: 16px; line-height: 24px"
          @click="setCollectionView()"
        >
          Collections
        </el-button>
        <template v-if="viewPage === 'collection'">
          <i
            style="font-size: 18px; color: #c0c4cc; margin: 0 5px"
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
            {{ activeCollectionName }}
          </span>
        </template>
      </el-row>
    </el-row>
    <nft-collections-view
      v-if="viewPage === 'collections'"
      :set-collection-name="getCollectionName"
      :set-collection-view="setCollectionView"
    >
    </nft-collections-view>
    <nft-collection v-else :collection="activeCollection"></nft-collection>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import NftCollectionsView from "./NftCollectionsView.vue";
import NftCollection from "./NftCollection.vue";
export default {
  name: "NftWalletView",
  components: { NftCollectionsView, NftCollection },
  data() {
    return {
      currentPage: 0,
      pages: 0,
      viewPage: "collections",
      activeCollection: "",
      activeCollectionName: "",
      nextPage: 1,
      prevPage: 0,
      tabledata: [],
      displayCount: 24,
    };
  },

  watch: {
    loading(val) {
      console.log(val);
    },
    activeCollection(newVal) {
      this.fetchNftCollection(newVal);
    },
  },

  created() {
    this.fetchNFTs(this.$route.params.walletAddress);
  },

  mounted() {
    setInterval(() => {
      this.refresh();
    }, 1000 * 60 * 5);
  },

  methods: {
    ...mapActions([
      "loadWalletAsssets",
      "fetchNFTs",
      "softFetchNFTs",
      "fetchNftCollection",
    ]),
    refresh() {
      this.softFetchNFTs(this.$route.params.walletAddress);
    },

    setCollectionView(collection) {
      if (collection) {
        this.viewPage = "collection";
        this.activeCollection = collection;
      } else {
        this.viewPage = "collections";
        this.activeCollection = "";
      }
    },
    getCollectionName(contract) {
      this.activeCollectionName = contract;
    },
  },
};
</script>

<style lang="scss">
#nft-wallet-view {
  .el-select .el-input__inner {
    border-radius: 24px;
  }
}
</style>
