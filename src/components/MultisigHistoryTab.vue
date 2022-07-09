<template>
  <el-card>
    <template name="table">
      <el-card style="margin-top: 24px">
        <div class="responsive-table">
          <div>
            <el-row type="flex" style="gap: 15px" class="_table-header">
              <el-col style="padding-left: 10px" :span="5"> Action </el-col>
              <el-col class="text-right" :span="9"> Details </el-col>
              <el-col class="text-right" :span="5"> Transaction ID </el-col>
              <el-col class="text-right" :span="5"> Status </el-col>
            </el-row>
            <multisig-history-row
              v-for="history in historys"
              :key="history.alias"
              :history="history"
            />
          </div>
        </div>
      </el-card>
    </template>
  </el-card>
</template>

<script>
import MultisigHistoryRow from "./MultisigHistoryRow.vue";
export default {
  name: "MultisigHistoryTab",
  components: { MultisigHistoryRow },
  prop: {
    multisig: String,
    histories: Object,
  },
};
</script>
 
 <style>
</style>