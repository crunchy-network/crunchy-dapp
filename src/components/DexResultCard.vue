<template>
  <div style="margin-bottom: 10px; position: relative">
    <div v-if="best" class="best">BEST</div>
    <el-card style="border: 1px solid rgba(25, 27, 31, 0.1)" v-bind:style="best && 'border-color: #555CFF;'" body-style="padding: 12px 10px">
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
  },
};
</script>

<style scoped>
.best {
  background: #555cff;
  border-radius: 20px;
  width: max-content;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  align-items: center;
  letter-spacing: -0.02em;
  color: #ffffff;
  padding: 1px 14px;
  justify-content: center;
  position: absolute;
  height: 20px;
  width: 30px;
  top: -10px;
  left: 15px;
}
</style>
