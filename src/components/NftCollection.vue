<template>
  <el-card
    style="background-color: transparent; border: 0"
    body-style="padding: 0"
    shadow="never"
  >
    <el-row
      type="flex"
      align="stretch"
      style="flex-wrap: wrap; row-gap: 20px"
      :gutter="20"
    >
      <el-col v-for="(nft, index) in tabledata" :key="index" :lg="4" :md="6">
        <nft-asset-card
          :key="index"
          :art="getImage(nft.art)"
          :thumbnail="getImage(nft.art)"
          :icon="getImage(nft.thumbnailUri)"
          :links="nft.links"
          :link="nft.objkLink"
          :name="nft.name"
          :value="nft.value"
          :type="'collection'"
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
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import NftAssetCard from "./NftAssetCard.vue";
export default {
  name: "NftCollectionView",
  components: { NftAssetCard },
  props: {
    collection: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      tabledata: [],
      displayCount: 24,
    };
  },
  computed: {
    ...mapGetters(["getNFTCollection"]),
  },
  watch: {
    getNFTCollection() {
      this.paginationHandler();
    },
  },
  methods: {
    paginationHandler() {
      const data = this.getNFTCollection.items;
      this.pages = Math.ceil(data.length / this.displayCount);
      this.handleVisibleData();
    },
    handleVisibleData() {
      const data = this.getNFTCollection.items;
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
    getImage(image) {
      if (!image) {
        return "";
      }
      if (image.startsWith("assets")) {
        return require(`../${image}`);
      }
      return image;
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
