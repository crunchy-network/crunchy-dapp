<template>
  <div style="overflow-x: auto">
    <div :style="getGridColumn()" class="column-grid" id="columns">
      <div v-for="(column, index) in columns" :key="index" class="column-title">
        <h2 :style="handleColumnTextStyles(column.align)">{{ column.name }}</h2>
      </div>
    </div>

    <div v-for="(item, index) in data" :key="index" id="data-accessor">
      <div :style="getGridColumn()" class="column-grid column-data ">
        <div v-for="(column, index) in columns" :key="index">
          <h2 class="data-item " :style="handleColumnTextStyles(column.align, column.color)">
            {{ column.operation ? column.operation(item[column.accessor]) : item[column.accessor] || "-" }}
          </h2>
        </div>
      </div>
    </div>

    <div id="pagination">
      <el-button style="margin-right: 12px">
        <i class="fal fa-angle-left"></i>
        <i class="fal fa-angle-left"></i>
      </el-button>
      <el-button>
        <i class="fal fa-angle-left"></i>
      </el-button>

      <h2 style="font-weight: 800; color: #191B1F; opacity: 0.5; margin: 0 19px;">
        1 out of 12,300
      </h2>
      <el-button>
        <i class="fal fa-angle-right"></i>
      </el-button>

      <el-button style="margin-left: 12px">
        <i class="fal fa-angle-right"></i>
        <i class="fal fa-angle-right"></i>
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "FarmHistoryTable",
  props: {
    columns: Array.of({
      name: String,
      accessor: String,
      color: { type: String, default: "#191B1F" },
      operation: Function,
      align: { type: String, default: "right" },
    }),
    data: Array,
  },
  methods: {
    getGridColumn() {
      return "grid-template-columns: repeat(" + this.columns.length + ", 1fr);";
    },
    handleColumnTextStyles(alignment, color) {
      let styles = "";
      styles = `text-align: ${alignment || "right"};`;
      if (color) {
        styles += "color: " + color;
      }

      return styles;
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#columns {
  padding-top: 10px;
  padding-bottom: 28px;
  border-bottom: 2px solid rgba(25, 27, 31, 0.05);
}

.column-title {
  font-weight: 800;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.02em;
  color: #191b1f;
  opacity: 0.6;
}

.column-grid {
  display: grid;
  gap: 40px;
  > div,
  > h2 {
    max-width: 200px;
    word-wrap: break-word;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.data-item {
  font-weight: 800;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  letter-spacing: 0.02em;
  color: #191b1f;
}

.column-data {
  margin-top: 42px;
}

#pagination {
  margin-top: 32px;
  padding: 20px 0 8px 0;
  display: flex;
  justify-content: flex-end;
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
