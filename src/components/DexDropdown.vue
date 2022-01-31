<template>
  <div style=" position: relative; width: max-content; overflow: visible">
    <el-row type="flex" style="align-items: center">
      <el-avatar style="margin-right:9.4px" shape="circle" :size="28" :src="value.icon"></el-avatar>
      <h2 style=" margin: 0">
        {{ value.name }}
      </h2>

      <el-button @click="toggleDrop" style="border: 0; color: #555CFF; background: transparent; font-size: 18px;" icon="fas fa-caret-down" circle></el-button>
    </el-row>

    <div v-if="dropdown" style="position: absolute; top: 70%; left: 60%; z-index: 60000000;">
      <div style="max-height: 280px; overflow-y: auto; background: #fff; border-radius: 8px; border: 1px solid rgba(25, 27, 31, 0.1);">
        <div v-for="(item, index) in items" :key="index">
          <div @click="handleItemClick(item)">
            <el-row class=" item-row" type="flex">
              <el-avatar shape="circle" :size="20" :src="item.icon"></el-avatar>
              <h2 style=" margin: 0 0 0 10.5px; font-size: 16px">
                {{ item.name }}
              </h2>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div v-if="dropdown">
      <div class="drop-backdrop" @click="toggleDrop"></div>
    </div>
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
.el-card__body {
  padding: 0 !important;
}
.item-row {
  padding: 6px 16px;
  cursor: pointer;
  &:hover {
    background: rgba(117, 118, 121, 0.05);
  }
}

.drop-backdrop {
  position: fixed;
  z-index: 600;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.el-button.is-circle{
  padding: 8px;
}
</style>
