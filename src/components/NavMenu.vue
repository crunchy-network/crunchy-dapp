<template>
  <el-menu :router="true">

    <router-link tag="li" class="el-menu-item" :to="{ name: 'home' }" exact active-class="is-active">
      <i class="fak fa-crunchy-home"></i>
      <span>Home</span>
    </router-link>

    <router-link tag="li" class="el-menu-item" :to="{ name: 'wtz' }" active-class="is-active">
      <i class="fak fa-crunchy-tez-alt"></i>
      <span>WTZ</span>
    </router-link>

    <router-link tag="li" class="el-menu-item" :to="{ name: 'deep-freezer-listing' }" active-class="is-active">
      <i class="fak fa-crunchy-locker"></i>
      <span>Deep Freezers</span>
    </router-link>

    
    <router-link tag="li" class="el-menu-item" :to="{ name: 'ifo' }" active-class="is-active">
      <!-- <i class="fak fa-crunchy-farm"></i> -->
      <i class="fak fa-regular fa-farm"></i>
      <span>IFO</span>
    </router-link>

    <router-link tag="li" class="el-menu-item" :to="{ name: 'farm-listing' }" active-class="is-active">
      <i class="fak fa-crunchy-farm"></i>
      <span>Farms</span>
    </router-link>

    <!-- <router-link tag="li" class="el-menu-item" :to="{ name: 'bakery' }" active-class="is-active">
      <i class="fad fa-hat-chef"></i>
      <span>Bakery</span>
    </router-link> -->

    <router-link tag="li" class="el-menu-item" :to="{ name: 'fire-pit' }" active-class="is-active">
      <i class="fas fa-fire-alt"></i>
      <span>Fire Pit</span>
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
    margin: 0 -20px;
}

.el-menu-item {
    color: #191B1F;
    font-weight: 500;
    font-size: 14px;
    height: 50px !important;
    line-height: 50px !important;
    margin-bottom: 5px;

    i.fas, i.fak {
        margin-right: 14px;
        width: 24px;
        text-align: center;
        font-size: 24px;
        vertical-align: middle;
    }

    &:hover,
    &.is-active {
        background: #f4f4f4 !important;
    }

    &.is-active {
        color: #F64947;
        border-right: 6px solid #FF7A7A;
    }
}
</style>
