<template>
  <div
    class="grid-content"
    style="cursor: pointer; height: 100%"
    @click="
      () => {
        if (type === 'collections') {
          onCollectionSelect();
        }
      }
    "
  >
    <el-card
      class="box-card"
      style="box-shadow: 0px 0px 24px rgba(21, 21, 52, 0.04); height: 100%"
      body-style="padding: 5px 14px 20px;"
    >
      <div class="inner">
        <template>
          <el-row
            v-if="type === 'collections'"
            type="flex"
            style="align-items: center; overflow: hidden"
          >
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
                Collection
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
          <el-row
            v-else
            style="width: 100%"
            type="flex"
            justify="end"
            align="middle"
          >
            <el-dropdown trigger="click" @command="goToSite">
              <el-button
                style="transform: rotate(90deg); padding: 10px"
                icon="el-icon-more"
                circle
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <h2 style="font-size: 12px; color: #757679; margin: 0">
                    External Links
                  </h2>
                </el-dropdown-item>
                <div v-for="(link, index) in links" :key="index">
                  <el-dropdown-item :command="link.url">
                    <el-avatar
                      :src="link.icon"
                      fit="cover"
                      shape="circle"
                      :size="18"
                      style="
                        position: relative;
                        vertical-align: middle;
                        margin-right: 3px;
                      "
                    ></el-avatar>
                    <span
                      style="
                        font-weight: 600;
                        font-size: 12px;
                        line-height: 18px;

                        letter-spacing: -0.02em;
                        color: #555cff;
                      "
                    >
                      {{ link.name }}
                    </span>
                  </el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
        </template>
        <div style="margin: 5px 0">
          <div style="position: relative; width: 100%; border-radius: 8px">
            <template>
              <img
                v-if="type === 'collections'"
                class="art"
                :src="thumbnail"
                alt=""
              />
              <img v-else class="art" :src="art" alt="" />
            </template>
            <div v-if="type === 'collections'" class="count-wrapper">
              {{ count }} <i style="margin-left: 5px" class="fas fa-image"></i>
            </div>
          </div>
        </div>
        <div v-if="type === 'collection'" style="margin-top: auto">
          <h2
            style="
              font-weight: 600 !important;
              font-size: 12px;
              color: #555cff;
              word-break: break-all;
              margin-right: 3px;
              margin: 0;
            "
          >
            {{ name }}
          </h2>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "NftAssetCard",
  props: {
    icon: {
      type: String,
      default: "",
    },
    count: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    art: {
      type: String,
      default: "",
    },
    value: {
      type: String || Number,
      default: "NA",
    },
    links: {
      type: Array,
    },
    onCollectionSelect: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    goToSite(url) {
      window.open(url, "_blank").focus();
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
img.art {
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
  /* justify-content: space-between; */
  height: 100%;
}
</style>
