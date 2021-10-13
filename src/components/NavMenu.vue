<template>
  <el-menu :router="true">

    <router-link tag="li" class="el-menu-item" :to="{ name: 'home' }" exact active-class="is-active">
      <i class="fad fa-home-alt"></i>
      <span>Home</span>
      <i class="fa-2x fas fa-square" aria-hidden="true"></i>
    </router-link>

    <router-link tag="li" class="el-menu-item" :to="{ name: 'wtz' }" active-class="is-active">
      <i class="fad fa-coins"></i>
      <span>WTZ</span>
      <i class="fa-2x fas fa-square" aria-hidden="true"></i>
    </router-link>

    <router-link tag="li" class="el-menu-item" :to="{ name: 'deep-freezer-listing' }" active-class="is-active">
      <i class="fad fa-refrigerator"></i>
      <span>Deep Freezers</span>
      <i class="fa-2x fas fa-square" aria-hidden="true"></i>
    </router-link>

    <router-link tag="li" class="el-menu-item" :to="{ name: 'farm-listing' }" active-class="is-active">
      <i class="fad fa-tractor"></i>
      <span>Farms</span>
      <i class="fa-2x fas fa-square" aria-hidden="true"></i>
    </router-link>

    <!-- <router-link tag="li" class="el-menu-item" :to="{ name: 'bakery' }" active-class="is-active">
      <i class="fad fa-hat-chef"></i>
      <span>Bakery</span>
      <i class="fa-2x fas fa-square" aria-hidden="true"></i>
    </router-link> -->

    <router-link tag="li" class="el-menu-item" :to="{ name: 'fire-pit' }" active-class="is-active">
      <i class="fad fa-fire-alt"></i>
      <span>Fire Pit</span>
      <i class="fa-2x fas fa-square" aria-hidden="true"></i>
    </router-link>

    <!-- <el-menu-item index="3">
      <i class="fad fa-steak"></i>
      <span>Meat Lockers</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="fad fa-chart-pie-alt"></i>
      <span>Pie Slicer</span>
    </el-menu-item>
    <el-menu-item index="5">
      <i class="fad fa-blender"></i>
      <span>Token Blender</span>
    </el-menu-item> -->

  </el-menu>
</template>

<script>
export default {
  name: 'NavMenu'
}
</script>

<style lang="scss" scoped>
.el-menu {
    border-right: none !important;
}

.el-menu-item {
    color: #191B1F;
    font-weight: bold;
    height: 50px !important;
    line-height: 50px !important;
    border-radius: 12px !important;
    margin-bottom: 5px;

    i.fad {
        margin-right: 14px;
        width: 24px;
        text-align: center;
        font-size: 18px;
        vertical-align: middle;
    }

    i.fa-square {
        display: none;
        position: absolute;
        top: 12px;
        right: -40px;
        z-index: 999;
    }

    &:hover,
    &.is-active {
        background: #f4f4f4 !important;
    }

    &.is-active {
        color: #F64947;

        i.fa-square {
            display: block;
        }
    }
}

</style>
