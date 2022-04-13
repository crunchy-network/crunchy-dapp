<template>
  <div id="#ifo" style="max-width: 1450px; margin: auto">
    <NavMenu />
    <el-main>
      <el-row
        :gutter="40"
        type="flex"
        style="margin-bottom: 50px; flex-wrap: wrap"
      >
        <el-col style="margin-bottom: 5px" :md="12">
          <div
            class="grid-content"
            style="min-height: 100%; display: flex; align-items: stretch"
          >
            <IFOCard />
          </div>
        </el-col>
        <el-col style="margin-bottom: 5px" :md="12">
          <div class="grid-content">
            <IFOFirst :project="projects[0]" />
          </div>
        </el-col>
      </el-row>
      <div class="responsive-table">
        <div>
          <el-row type="flex" class="ifo-list" style="margin-top: 25px">
            <el-col :span="24">
              <div class="grid-content">
                <el-card class="box-card">
                  <el-row
                    type="flex"
                    align="middle"
                    style="
                      color: #757679;
                      font-size: 14px;
                      font-weight: 600;
                      border-bottom: 2px solid #f4f4f4;
                      padding-bottom: 14px;
                      margin-bottom: 14px;
                    "
                  >
                    <el-col>
                      <el-row
                        :gutter="20"
                        type="flex"
                        align="middle"
                        style="padding: 0 20px"
                      >
                        <el-col :span="7">Pool</el-col>
                        <el-col :span="7" style="text-align: right"
                          >Type</el-col
                        >
                        <el-col style="text-align: right" :span="5"
                          >Pool Size</el-col
                        >
                        <el-col style="text-align: right" :span="5"
                          >Status</el-col
                        >
                      </el-row>
                    </el-col>
                  </el-row>
                  <IFOListRow
                    v-for="project in projects"
                    :key="project.name"
                    :project="project"
                  />
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import IFOListRow from "./IFOListRow.vue";
import IFOFirst from "./IFOFirst.vue";
import { gatherAllProjectJsonFiles } from "../lib/JsonHelper";
import IFOCard from "./IFOCard.vue";
import NavMenu from "./NavMenu.vue";
export default {
  components: { IFOListRow, IFOCard, IFOFirst, NavMenu },
  data: () => ({
    projects: gatherAllProjectJsonFiles().sort(
      (a, b) => new Date(b.startTime) - new Date(a.startTime)
    ),
  }),
};
</script>

<style>
.el-row {
  color: #303133;
  font-size: 14px;
}
</style>
