<template>
  <el-row
    style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
    type="flex"
    align="top"
  >
    <el-col :span="24">
      <router-link :to="`/ifo/${project.tokenName}`">
        <div style="border-radius: 14px; color: #8c8d8f; font-size: 16px">
          <el-row
            :gutter="20"
            class="farm-row"
            style="margin-left: 0; margin-right: 0"
            type="flex"
            align="middle"
          >
            <el-col
              :span="7"
              style="font-weight: bold; display: flex; align-items: center"
            >
              <div class="logo-container">
                <el-avatar
                  :src="images[project.tokenLogo]"
                  fit="cover"
                  shape="circle"
                  :size="40"
                  style="
                    position: relative;
                    border: 4px solid #fff;
                    vertical-align: middle;
                  "
                >
                </el-avatar>
              </div>
              <span style="margin-left: 15px"> {{ project.tokenName }} </span>
            </el-col>
            <el-col :span="7" style="font-weight: bold; text-align: right">
              <div>
                {{
                  project.isIFO
                    ? "Initial Farm Offering"
                    : "Initial Dex Offering"
                }}
              </div>
            </el-col>
            <el-col :span="5" style="font-weight: bold; text-align: right">
              {{
                isMobile
                  ? formatNumShorthand(project.offeringSupply, 2).value +
                    formatNumShorthand(project.offeringSupply, 2).suffix
                  : vueNumberFormat(project.offeringSupply)
              }}
              {{ project.tokenSymbol }}
            </el-col>
            <el-col
              :span="5"
              style="font-weight: bold; text-align: right; padding-right: 0px"
            >
              <IFOTimeBubble
                :date="new Date(project.startTime)"
                :end-date="new Date(project.endTime)"
              />
            </el-col>
          </el-row>
        </div>
      </router-link>
    </el-col>
  </el-row>
</template>

<script>
import IFOTimeBubble from "./IFOTimeBubble.vue";
import { importAll } from "../lib/JsonHelper";

export default {
  name: "IFOListRow",
  components: { IFOTimeBubble },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    images: importAll(
      require.context("../assets/project_images", false, /\.(png|jpe?g|svg)$/)
    ),
  }),
  computed: {
    isMobile() {
      return window.innerWidth <= 450;
    },
  },
  methods: {
    formatNumShorthand(value, precision) {
      const number = precision
        ? parseFloat(value).toFixed(precision)
        : Number(value);
      if (isNaN(number)) return { value: 0, suffix: "" };
      if (number < 1000) {
        return { value: number, suffix: "" };
      } else if (number < 1000000) {
        const value = number / 1000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "K" };
      } else if (number < 1000000000) {
        const value = (number / 1000000).toFixed(precision);
        return { value, suffix: "M" };
      } else if (number < 1000000000000) {
        const value = number / 1000000000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "B" };
      } else {
        const value = number / 1000000000000;
        const precisedValue = parseFloat(value).toFixed(precision);
        return { value: precisedValue, suffix: "T" };
      }
    },
  },
};
</script>
<style scoped>
.accessType {
  display: inline-block;
  margin-right: 15px;
}
.logo-container {
  width: 50px;
  display: flex;
  justify-content: start;
  align-items: center;
}
@media (max-width: 450px) {
  .farm-row .el-col:nth-child(1) {
    position: sticky;
    left: -1px;
    z-index: 1;
    background-color: inherit;
  }
}
</style>
