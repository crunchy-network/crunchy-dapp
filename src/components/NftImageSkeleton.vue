<template>
  <div class="wrapper"></div>
</template>

<script>
export default {
  name: "NftImageSkeleton",
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 165px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 8px;
  transition: 0.35s ease-in-out;
  animation: glowing 2s infinite;
}
@keyframes glowing {
  0% {
    background-color: #ddd;
  }
  50% {
    background-color: #f1f1f1;
  }
  100% {
    background-color: #ddd;
  }
}
</style>
