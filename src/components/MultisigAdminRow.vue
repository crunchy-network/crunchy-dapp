<template>
  <el-card style="margin-top: 24px">
    <div class="responsive-table">
      <div>
        <el-row type="flex" style="gap: 15px" class="_table-header">
          <el-col style="padding-left: 10px" :span="5"> Action </el-col>
          <el-col :span="9"> Details </el-col>
          <el-col class="text-right" :span="5"> Transaction ID </el-col>
          <el-col class="text-right" :span="5"> Status </el-col>
        </el-row>
        <MultisigAdminRow
          v-for="(history, index) in histories"
          :key="index"
          :items="history.items"
          :date="history.date"
        />
      </div>
    </div>
  </el-card>
</template>

<script>
import MultisigAdminRow from "./MultisigAdminRow.vue";
export default {
  name: "MultisigAdminsTab",
  components: { MultisigAdminRow },
};
</script>

<style></style>
