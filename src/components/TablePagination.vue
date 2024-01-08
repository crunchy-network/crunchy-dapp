<template>
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
        color: var(--primary-text);
        opacity: 0.9;
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
</template>

<script>
export default {
  name: "TablePagination",
  props: [
    "nextPage",
    "pages",
    "handleNextPage",
    "handleEnd",
    "handleStart",
    "currentPage",
    "handlePrevPage",
  ],
};
</script>

<style lang="scss">
#pagination {
  margin-top: 32px;
  padding: 20px 0 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid var(--border-color);

  .el-button {
    width: 42px;
    height: 42px;
    color: var(--primary-text);
    padding: 13px;
    background: var(--pagination-background);
    border: 1px solid var(--pagination-color);
    box-sizing: border-box;
    border-radius: 8px;
  }

  .el-button.is-disabled {
    /* border: 1px solid var(--pagination-color-disabled);
    background: var(--pagination-background-disabled);
    color: var(--pagination-color-disabled); */
    opacity: 0.4;
    &::before {
      background: transparent !important;
    }
  }
  @media (max-width: 450px) {
    width: 1500px;
    position: relative;
    margin-left: 40px;
    left: -600px;
    z-index: 1;
    .el-button:nth-child(1) {
      position: sticky;
      left: 50px;
      z-index: 1;
    }
    .el-button:nth-child(2) {
      position: sticky;
      left: 105px;
      z-index: 1;
    }
    .el-button:nth-child(4) {
      position: sticky;
      left: 250px;
      z-index: 1;
    }
    .el-button:nth-child(5) {
      position: sticky;
      left: 305px;
      z-index: 1;
    }
    h2 {
      position: sticky;
      left: 170px;
      z-index: 1;
    }
  }
}
</style>
