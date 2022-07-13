<template>
  <div class="wrapper">
    <el-row type="flex">
      <el-avatar
        style="margin-right: 32px"
        shape="circle"
        :size="40"
        :src="value.icon"
      ></el-avatar>
      <div>
        <div>
          <p class="opaque" style="font-size: 18px; display: inline">
            {{
              vueNumberFormat(value.balance, {
                prefix: "",
                decimal: ".",
                thousand: ",",
                precision: 0,
              })
            }}
          </p>
          <p class="opaque" style="display: inline">
            {{ value.name }}
          </p>
        </div>
        <p class="small-text light-text">~$51,660</p>
      </div>
    </el-row>
    <el-dropdown>
      <el-button class="_clear-btn">
        <i
          style="color: #333628; font-size: 20px"
          class="fa-solid fa-angle-down"
        ></i>
      </el-button>
      <el-dropdown-menu class="_dropdown-wrapper" slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in items"
          :key="index"
          @click.native="() => handleItemClick(item)"
        >
          <el-row type="flex" align="middle">
            <el-avatar
              style="margin-right: 16px"
              shape="circle"
              :size="24"
              :src="item.icon"
            ></el-avatar>
            <p class="opaque" style="display: inline">
              {{ item.name }}
            </p>
          </el-row>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "DexDropdown",
  props: ["items", "onChange", "value"],
  data() {
    return {
      dropdown: false,
    };
  },
  methods: {
    toggleDrop() {
      this.dropdown = !this.dropdown;
    },
    handleItemClick(item) {
      this.onChange(item);
      this.toggleDrop();
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  border: 2px solid rgba(25, 27, 31, 0.1);
  border-radius: 12px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

._clear-btn {
  padding: 5px;
  border: 0;
  background: transparent;
}

._dropdown-wrapper {
  padding: 0;
  min-width: 180px;
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