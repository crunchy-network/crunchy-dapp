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
        color: var(--color-text);
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

<style scoped>
#pagination {
  margin-top: 32px;
  padding: 20px 0 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid rgba(255, 250, 250, 0.05);
}
#pagination .el-button {
  width: 42px;
  height: 42px;
  color: rgba(255, 250, 250, 0.8);
  padding: 13px;
  background: rgba(255, 250, 250, 0.04);
  border: 1px solid rgba(255, 250, 250, 0.2);
  box-sizing: border-box;
  border-radius: 8px;
}
</style>