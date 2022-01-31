<template>
  <div @click="handleClick" style="position: relative" v-bind:style="!best && 'margin-top: 10px'">
    <div v-if="best && active" class="best">BEST</div>
    <el-card
      style="border: 1px solid rgba(25, 27, 31, 0.1);"
      v-bind:style="active && 'border-color: #F64947;'"
      body-style="padding: 12px 10px; border-radius: 18px"
    >
      <el-row type="flex" justify="space-between" align="center">
        <div>
          <h2 style="margin: 0; font-size: 16px; color: #191B1F; font-weight: 500 !important; ">
            {{ name }}
          </h2>
          <h2 style="margin: 0; font-size: 12px; color: #757679; font-weight: 500 !important; ">Tx Cost {{ txCost }} ~ ${{ txCostUSD }}</h2>
        </div>

        <div style="text-align: right">
          <h2 style="margin: 0; font-size: 16px; color: #191B1F; font-weight: 500 !important; ">
            {{ value }}
          </h2>
          <h2 style="margin: 0; font-size: 12px; color: #757679; font-weight: 500 !important; ">~${{ valueUSD }}</h2>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DexResultCard",
  props: {
    name: String,
    value: Number,
    txCost: Number,
    txCostUSD: Number,
    valueUSD: Number,
    best: Boolean,
    active: Boolean,
    handleClick: Function,
  },
};
</script>

<style scoped>
* {
  transition: 0.45s ease all;
}
.best {
  background: #f64947;
  border-radius: 20px;
  width: max-content;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  /* line-height: 18px; */
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  color: #ffffff;
  padding: 0px 12px;
  justify-content: center;
  position: absolute;
  height: 16px;
  width: 25px;
  top: -8px;
  left: 15px;
}
</style>
