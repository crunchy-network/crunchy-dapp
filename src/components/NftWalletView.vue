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
            {{ getCollectionName(activeCollection) }}
          </span>
        </template>
      </el-row>
      <div>
        <el-select collapse-tags value="collections" placeholder="Collections">
          <el-option class="select" label="Collections" value="collections">
          </el-option>
        </el-select>
      </div>
    </el-row>
    <el-row
      type="flex"
      align="stretch"
      style="flex-wrap: wrap; row-gap: 20px"
      :gutter="20"
    >
      <el-col v-for="(nft, index) in tabledata" :key="index" :lg="4" :md="6">
        <nft-asset-card
          :art="nft.art"
          :thumbnail="nft.thumbnailUri"
          :count="nft.count"
          :icon="nft.icon"
          :links="nft.links"
          :name="nft.name"
          :value="nft.value"
          :on-collection-select="
            () => {
              return setCollectionView(nft.address);
            }
          "
          :type="viewPage"
        ></nft-asset-card>
      </el-col>
    </el-row>
    <div style="margin-top: auto">
      <div id="pagination">
        <el-button
          :disabled="currentPage === 0"
          style="margin-right: 12px"
          @click="handleStart"
        >
          <i class="fal fa-angle-left"></i>
          <i class="fal fa-angle-left"></i>
        </el-button>
        <el-button :disabled="currentPage === 0" @click="handlePrevPage">
          <i class="fal fa-angle-left"></i>
        </el-button>

        <h2
          style="
            font-weight: 800;
            font-size: 14px;
            color: #191b1f;
            opacity: 0.5;
            margin: 0 19px;
          "
        >
          {{
            vueNumberFormat(nextPage > pages ? pages : nextPage, {
              prefix: "",
              decimal: ".",
              thousand: ",",
              precision: 0,
            })
          }}
          out of
          {{
            vueNumberFormat(pages, {
              prefix: "",
              decimal: ".",
              thousand: ",",
              precision: 0,
            })
          }}
        </h2>
        <el-button :disabled="nextPage + 1 > pages" @click="handleNextPage">
          <i class="fal fa-angle-right"></i>
        </el-button>

        <el-button
          :disabled="nextPage + 1 > pages"
          style="margin-left: 12px"
          @click="handleEnd"
        >
          <i class="fal fa-angle-right"></i>
          <i class="fal fa-angle-right"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NftAssetCard from "./NftAssetCard.vue";
import knownWalletContracts from "../knownContracts.json";
export default {
  name: "NftWalletView",
  components: { NftAssetCard },
  data() {
    return {
      currentPage: 0,
      pages: 0,
      viewPage: "collections",
      activeCollection: "",
      nextPage: 1,
      prevPage: 0,
      tabledata: [],
      displayCount: 12,
      collection: [],
    };
  },
  computed: {
    ...mapGetters(["getNFTs"]),
  },
  watch: {
    activeCollection() {
      this.paginationHandler();
    },
    getNFTs() {
      this.collection = this.convertNftDataToTableView(this.getNFTs);
    },
  },
  created() {
    this.collection = this.convertNftDataToTableView(this.getNFTs);
  },
  mounted() {
    this.paginationHandler();
  },
  methods: {
    ...mapActions(["loadWalletAsssets"]),
    refresh() {
      this.loadWalletAsssets(this.$route.params.walletAddress);
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

    paginationHandler() {
      const data =
        this.viewPage === "collections"
          ? this.collection
          : this.collection.find((c) => c.address === this.activeCollection)
              .items || [];

      this.pages = Math.ceil(data.length / this.displayCount);
      this.handleVisibleData();
    },
    handleVisibleData() {
      const data =
        this.viewPage === "collections"
          ? this.collection
          : this.collection.find((c) => c.address === this.activeCollection)
              .items || [];
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tabledata = data.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > data.length
          ? data.length
          : next * this.displayCount
      );
    },
    handleNextPage() {
      if (this.nextPage + 1 <= this.pages) {
        this.currentPage = this.nextPage;
        this.prevPage = this.nextPage - 1;
        this.nextPage = this.nextPage + 1;
        this.handleVisibleData();
      }
    },
    handlePrevPage() {
      if (this.currentPage > 0) {
        this.currentPage = this.prevPage;
        this.nextPage = this.prevPage + 1;
        this.prevPage = this.prevPage - 1;
        this.handleVisibleData();
      }
    },
    handleEnd() {
      if (this.currentPage !== this.pages) {
        this.currentPage = this.pages;
        this.nextPage = this.pages;
        this.prevPage = this.pages - 1;
        this.handleVisibleData();
      }
    },
    handleStart() {
      if (this.currentPage !== 0) {
        this.currentPage = 0;
        this.nextPage = 1;
        this.prevPage = 0;
        this.handleVisibleData();
      }
    },
    resetPagination() {
      this.currentPage = 0;
      this.pages = 0;
      this.nextPage = 1;
      this.prevPage = 0;
    },
    convertNftDataToTableView(nfts) {
      const toRet = [];
      Object.keys(nfts).forEach((k) => {
        const firstToken = nfts[k][0];
        const found = knownWalletContracts.find((c) => c.address.includes(k));
        if (found) {
          console.log(found);
        }
        toRet.push({
          address: k,
          count: nfts[k].length,
          name:
            firstToken.token.contract.alias ||
            `${firstToken.token.contract.address.slice(0, 8)}...`,
          icon: this.getBestIcon(found),
          thumbnailUri: this.getBestThumbnail(found, firstToken),
          collection: true,
          items: this.convertNftsToCollectionItems(nfts[k]),
        });
      });
      return toRet;
    },
    getBestThumbnail(knownContract, firstToken) {
      if (knownContract) {
        if (knownContract.discoverUrl) {
          return require(`../${knownContract.discoverUrl}`);
        }
        return require(`../${knownContract.thumbnailUrl}`);
      }
      if (firstToken.token.metadata) {
        return this.getImgUri(firstToken.token.metadata.thumbnailUri);
      }
      return "";
    },
    getBestIcon(knownContract) {
      if (knownContract) {
        return require(`../${knownContract.thumbnailUrl}`);
      }
      return require("../assets/nfts/icon1.png");
    },
    convertNftsToCollectionItems(nfts) {
      const toRet = [];
      return nfts.forEach((nft) => {
        const metadata = nft.token.metadata;
        if (metadata) {
          toRet.push({
            name: metadata.name,
            art: this.getImgUri(metadata.thumbnailUri),
            value: "3.2",
            links: [
              {
                name: "OBJKT",
                icon: "https://tezos.art/objkt.png",
                url: this.getObjktLink(nft.token),
              },
            ],
          });
        } else {
          console.log(nft.token);
        }
      });
    },
    getObjktLink(token) {
      return `https://objkt.com/asset/${token.contract.address}/${token.tokenId}`;
    },
    getCollectionName(address) {
      const collection = this.collection.find((c) => c.address === address);
      return collection.name;
    },
    getImgUri(uri) {
      if (uri.startsWith("ipfs")) {
        return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
      } else {
        return uri;
      }
    },
  },
};
</script>

<style lang="scss">
#nft-wallet-view {
  .el-select .el-input__inner {
    border-radius: 24px;
  }
  #pagination {
    margin-top: 32px;
    padding: 20px 0 8px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 2px solid rgba(25, 27, 31, 0.05);
    .el-button {
      width: 42px;
      height: 42px;
      color: rgba(25, 27, 31, 0.5);
      padding: 13px;
      background: rgba(25, 27, 31, 0.04);
      border: 1px solid rgba(25, 27, 31, 0.2);
      box-sizing: border-box;
      border-radius: 8px;
    }
  }
}
</style>
