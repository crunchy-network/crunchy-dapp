<template>
  <div
    id="nft-wallet-view"
    style="min-height: 50vh; display: flex; flex-direction: column"
  >
    <el-card>
      <div>
        <div>
          <el-row
            type="flex"
            align="middle"
            style="
              color: #fff;
              font-size: 14px;
              font-weight: 600;
              border-bottom: 1px solid rgba(255, 255, 255, 0.3);
              padding-bottom: 14px;
              margin-bottom: 14px;
            "
          >
            <el-col :span="24">
              <el-row
                :gutter="20"
                type="flex"
                align="middle"
                style="padding: 0 20px; color: #fff"
              >
                <el-col :span="6">Protocol</el-col>
                <el-col style="text-align: right" :span="4"
                  >Staked Value</el-col
                >
                <el-col style="text-align: right" :span="4">Claimable</el-col>
                <el-col style="text-align: right" :span="4">Total Value</el-col>
                <el-col style="text-align: right" :span="6"></el-col>
              </el-row>
            </el-col>
          </el-row>

          <StakedWalletRow
            v-for="(farm, index) in tabledata"
            :key="index"
            :show-usd="showUsd"
            :farm="farm"
          />

          <row-pagination
            :currentPage="currentPage"
            :handleEnd="handleEnd"
            :handleNextPage="handleNextPage"
            :handlePrevPage="handlePrevPage"
            :handleStart="handleStart"
            :nextPage="nextPage"
            :pages="pages"
          ></row-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import RowPagination from "./RowPagination.vue";
import StakedWalletRow from "./StakedWalletRow.vue";
export default {
  components: { StakedWalletRow, RowPagination },
  name: "StakedWalletView",
  props: ["showUsd"],
  data() {
    return {
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      tabledata: [],
      displayCount: 12,

      farms: [
        {
          id: 0,
          icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1645283474/tvmz49wrjosa2vrpw2dw.svg",
          protocol: "Crunchy",
          stakedValue: 569.538837,
          stakedValueUsd: 2100,
          claimable: 60.552927,
          claimableUsd: 220.21,
          totalValue: 628.12815,
          totalValueUsd: 2320.21,
          stakes: [
            {
              stakedToken: "ASH/XTZ LP",
              stakedValueUsd: 1500,
              stakedValue: 408.724143,
              claimableUsd: 200,
              claimable: 55.056822,
              totalValueUsd: 1700,
              totalValue: 462.496623,
            },
            {
              stakedToken: "CRUNCH",
              stakedValue: 137.316273,
              stakedValueUsd: 500,
              claimable: 5.51353,
              claimableUsd: 20,
              totalValue: 142.786394,
              totalValueUsd: 520,
            },
            {
              stakedToken: "CRUNCH/XTZ LP",
              stakedValue: 408.724143,
              stakedValueUsd: 1500,
              claimable: 55.056822,
              claimableUsd: 200,
              totalValue: 462.496623,
              totalValueUsd: 1700,
            },
          ],
        },

        {
          id: 0,
          icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1645292809/c1rutxlzllilmtuibcdo.png",
          protocol: "Quipuswap",
          stakedValue: 137.316273,
          stakedValueUsd: 500,
          claimable: 0.275718,
          claimableUsd: 1,
          totalValue: 137.58982,
          totalValueUsd: 501,
          stakes: [
            {
              stakedToken: "ASH/XTZ LP",
              stakedValueUsd: 1500,
              stakedValue: 408.724143,
              claimableUsd: 200,
              claimable: 55.056822,
              totalValueUsd: 1700,
              totalValue: 462.496623,
            },
            {
              stakedToken: "CRUNCH",
              stakedValue: 137.316273,
              stakedValueUsd: 500,
              claimable: 5.51353,
              claimableUsd: 20,
              totalValue: 142.786394,
              totalValueUsd: 520,
            },
            {
              stakedToken: "CRUNCH/XTZ LP",
              stakedValue: 408.724143,
              stakedValueUsd: 1500,
              claimable: 55.056822,
              claimableUsd: 200,
              totalValue: 462.496623,
              totalValueUsd: 1700,
            },
          ],
        },

        {
          id: 0,
          icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1645292809/nstgjnest4jrhcsgwymf.png",
          protocol: "Plenty",
          stakedValue: 109.939757,
          stakedValueUsd: 400,
          claimable: 0.011028,
          claimableUsd: 0.04,
          totalValue: 109.950716,
          totalValueUsd: 400.04,
          stakes: [
            {
              stakedToken: "ASH/XTZ LP",
              stakedValueUsd: 1500,
              stakedValue: 408.724143,
              claimableUsd: 200,
              claimable: 55.056822,
              totalValueUsd: 1700,
              totalValue: 462.496623,
            },
            {
              stakedToken: "CRUNCH",
              stakedValue: 137.316273,
              stakedValueUsd: 500,
              claimable: 5.51353,
              claimableUsd: 20,
              totalValue: 142.786394,
              totalValueUsd: 520,
            },
            {
              stakedToken: "CRUNCH/XTZ LP",
              stakedValue: 408.724143,
              stakedValueUsd: 1500,
              claimable: 55.056822,
              claimableUsd: 200,
              totalValue: 462.496623,
              totalValueUsd: 1700,
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.paginationHandler();
  },
  methods: {
    paginationHandler() {
      this.pages = Math.ceil(this.farms.length / this.displayCount);
      this.handleVisibleData();
    },

    handleVisibleData() {
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tabledata = this.farms.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > this.farms.length
          ? this.farms.length
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>
