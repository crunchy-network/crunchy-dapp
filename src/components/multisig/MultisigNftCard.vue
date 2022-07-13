<template>
  <div>
    <label v-if="selectable">
      <el-card body-style="padding: 0; box-sizing: border-box;">
        <div style="position: relative">
          <img
            :src="nft.thumbnailUrl"
            alt=""
            class="_w-100"
            style="border-radius: 18px 18px 0px 0px"
          />
          <input
            v-model="nft.select"
            type="checkbox"
            hidden
            @change="handleChange"
          />
          <div :class="nft.select ? 'check selected' : 'check'">
            <i class="fa-solid fa-check"></i>
          </div>
        </div>

        <div style="padding: 5px 13px 10px">
          <p class="xs-text">{{ nft.name }}</p>
          <p class="xs-text">#{{ nft.tokenId }}</p>
        </div>
      </el-card>
    </label>
    <el-card v-else body-style="padding: 0; box-sizing: border-box;">
      <div style="position: relative">
        <img
          :src="nft.thumbnailUrl"
          alt=""
          class="_w-100"
          style="border-radius: 18px 18px 0px 0px"
        />
      </div>

      <div style="padding: 5px 13px 10px">
        <p class="xs-text">{{ nft.name }}</p>
        <p class="xs-text">#{{ nft.tokenId }}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "MultisigNftCard",
  props: {
    nft: {
      type: Object,
      required: true,
    },
    selectable: Boolean,
    onChange: Function,
  },
  data() {
    return {
      select: false,
    };
  },

  methods: {
    handleChange() {
      this.onChange(this.nft);
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  cursor: pointer;
  .check {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(25, 27, 31, 0.2);
    background: #fff;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 10px;
    bottom: 10px;
    transition: 0.2s ease-in-out all;
    i {
      color: rgba(25, 27, 31, 0.2);
      font-size: 18px;
    }

    &.selected {
      border: 2px solid #0b13ff;
      background: #555cff;
      i {
        color: #fff;
      }
    }
  }
}
</style>
