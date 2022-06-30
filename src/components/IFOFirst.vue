<template>
  <el-card class="box-card" shadow="never" style="height: 100%; width: 100%">
    <el-row style="margin: 40px">
      <div class="img-container">
        <img
          class="first-project-image"
          :src="images[project.projectLogo]"
          :alt="project.projectLogo"
        />
      </div>
      <div class="launch-date-container">
        <span style="color: #8c8d8f; margin-right: 15px"
          >{{ getLaunchText(project.startTime) }}
        </span>
        <span>{{ project.startTime | moment("calendar") }}</span>
      </div>
    </el-row>
  </el-card>
</template>

<script>
import { importAll } from "../lib/JsonHelper";

export default {
  name: "IFOFirstCard",
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
  methods: {
    getLaunchText(startDate) {
      const now = new Date();
      if (now.getTime() > new Date(startDate).getTime()) {
        return "Launched:";
      } else {
        return "Launching:";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 14px;
  color: rgb(117, 118, 121);
}
.el-button {
  font-weight: bold;
}
.first-project-image {
  max-width: 100%;
  max-height: 100px;
}
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
}
.launch-date-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
