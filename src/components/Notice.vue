<template>
  <div
    id="notice"
    class="el-row"
    style="
      background: #f8535b;
      padding: 8px 0px;
      width: 100%;
      display: block;
      color: #fff;
      text-align: center;
      font-size: 14px;
    "
  >
    Important Announcement: $CRUNCH and $crDAO tokens are merging.
    <a
      href="https://crunchytez.medium.com/introducing-crnchy-b99879b4974e"
      target="_blank"
      >Please read the medium article for full details.</a
    >
  </div>
</template>

<script>
export default {
  name: "NoticeBanner",
};
</script>

<style lang="scss" scoped>
#notice {
  a {
    color: #fff;
  }
}
</style>
