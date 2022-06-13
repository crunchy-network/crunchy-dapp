<template>
  <div class="grid-content" style="height: 100%">
    <el-card
      class="box-card"
      style="box-shadow: 0px 0px 24px rgba(21, 21, 52, 0.04); height: 100%"
      body-style="padding: 5px 14px 20px; height: 100%;"
    >
      <div class="inner">
        <el-row type="flex" style="align-items: center">
          <el-avatar
            :src="icon"
            fit="cover"
            shape="circle"
            :size="40"
            style="
              position: relative;
              border: 4px solid #fff;
              vertical-align: middle;
              margin-right: 7px;
            "
          ></el-avatar>
          <div>
            <h2
              style="
                font-weight: 600 !important;
                font-size: 12px;
                color: #757679;
                margin: 0;
              "
            >
              {{ type }}
            </h2>
            <h2
              style="
                font-weight: 600 !important;
                font-size: 12px;
                color: #191b1f;
                margin: 0;
              "
            >
              {{ name }}
            </h2>
          </div>
        </el-row>
        <div
          style="margin-top: 5px; display: flex; align-items: center; flex: 1"
        >
          <div style="position: relative; width: 100%; border-radius: 8px">
            <img :src="art" alt="" />
            <div class="count-wrapper">
              {{ count }} <i style="margin-left: 5px" class="fas fa-image"></i>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "NftAssetCard",
  props: ["icon", "count", "name", "type", "art"],
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
img {
  width: 100%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 8px;
}
.count-wrapper {
  background: #191b1f;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 8px;
  padding: 3px 7px;
  font-size: 14px;
  color: #fcfcfd;
  position: absolute;
  top: 5px;
  right: 10px;
}
.inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>