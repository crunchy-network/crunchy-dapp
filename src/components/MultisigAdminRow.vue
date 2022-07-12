<template>
  <div
    style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
    type="flex"
    align="top"
  >
    <el-col :span="24">
      <div class="item-row">
        <el-row
          style="margin-left: 0; margin-right: 0"
          :gutter="20"
          class="farm-row lg"
          type="flex"
          align="middle"
        >
          <el-col :span="9">
            <a
              class="_anchor-primary"
              type="primary"
              :href="`https://tzkt.io/${admin.address}`"
              target="_blank"
              >{{ admin.address }}</a
            >
          </el-col>
          <el-col class="text-right" :span="6"> {{ admin.txSigned }} </el-col>
          <el-col class="text-right" :span="9">
            {{ admin.txSigned < 1 ? "NA" : admin.lastSigned }}
          </el-col>
        </el-row>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "MultisigAdminsRow",
  props: {
    admin: Object,
    required: true,
  },
};
</script>

<style></style>
