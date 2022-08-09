<template>
  <div
    style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
    type="flex"
    align="top"
  >
    <el-row
      :gutter="20"
      class="farm-row"
      style="margin-left: 0; margin-right: 0"
      type="flex"
      align="middle"
    >
      <el-col style="padding: 0px !important" :span="24">
        <div class="item-row">
          <el-row :gutter="20" type="flex" align="middle">
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
              {{ admin.txSigned === 0 ? "NA" : admin.lastSigned }}
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "MultisigAdminsRow",
  props: {
    admin: Object,
  },
};
</script>

<style></style>
