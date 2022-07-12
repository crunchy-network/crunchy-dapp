<template>
  <el-card style="margin-top: 24px">
    <div class="responsive-table">
      <div>
        <el-row type="flex" style="gap: 15px" class="_table-header">
          <el-col :span="9"> Address </el-col>
          <el-col class="text-right" :span="6"> TX Signed </el-col>
          <el-col class="text-right" :span="9"> Last Signed </el-col>
        </el-row>
        <MultisigAdminRow
          v-for="(admin, index) in admins"
          :key="index"
          :admin="admin"
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
  data() {
    return {
      admins: [
        {
          address: "tz1Q9Bgggw2VDNfcNtwUtK5ykmXEgXiDWQSs",
          txSigned: 0,
        },
        {
          address: "tz1NkFRjmkqqcGkAhqe78fdgemDNKXvL7Bod",
          txSigned: 1,
          lastSigned: "23 May 2021 1400:23 UTC",
        },
        {
          address: "tz1Mq8j7AwoynKU8vXTe7ovh2ZALzxVHnRUM",
          txSigned: 3,
          lastSigned: "3 June 2021 1321:32 UTC",
        },
        {
          address: "tz1Q9Bgggw2VDNfcNtwUtK5ykmXEgXiDWQSs",
          txSigned: 3,
          lastSigned: "3 June 2021 1321:32 UTC",
        },
        {
          address: "tz1Q9Bgggw2VDNfcNtwUtK5ykmXEgXiDWQSs",
          lastSigned: "3 June 2021 1321:32 UTC",
          txSigned: 3,
        },
      ],
    };
  },
};
</script>

<style></style>
