<template>
  <div id="timeline">
    <div v-for="(item, index) in items" v-bind:key="index">
      <div class="item-wrapper">
        <div
          :style="
            item.status === 'active' &&
              'border-bottom-right-radius: 10px; border-bottom-left-radius: 10px;' + item.status !== 'pending' &&
              'background: #555CFF'
          "
          class="indicator-bar"
        >
          <div :style="item.status === 'active' && 'opacity: 1; height: 15px; width: 15px'" class="badge">
            <i v-if="item.status === 'active'" class="fas fa-check"></i>
          </div>
        </div>

        <div class="content-body">
          <div>
            <p :style="item.status === 'active' && 'opacity: 1'" class="text">
              {{ item.date }}
            </p>
            <p v-if="item.status === 'active'" class="text days-left">
              {{ item.daysLeft }}
            </p>
          </div>

          <div :class="'multiple ' + item.status">{{ item.multiple }}x</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Timeline",
  props: {
    items: Array.of({ date: Date }, { daysLeft: Number }, { multiple: Number }, { status: "active" | "completed" | "pending" }),
  },
  methods: {
    dateFormater(_date) {
      const date = new Date(_date);

      if (date) {
        return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";

.item-wrapper {
  position: relative;
  padding-left: 44px;
  min-height: 180px;
  box-sizing: border-box;
  .indicator-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    display: flex;
    align-items: center;
    padding: 6px;
    background: rgba(25, 27, 31, 0.05);
    :first-child {
      border-radius: 10px 10px 0 0;
    }
    :last-child {
      border-radius: 0 0 10px 10px;
    }
    .badge {
      background: #ffffff;
      opacity: 0.4;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      padding: 4px;
      color: #555cff;
    }
  }
  .content-body {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    .text {
      font-weight: 800;
      font-size: 16px;
      line-height: 19px;
      letter-spacing: 0.02em;
      color: rgba(25, 27, 31, 0.4);
    }

    .days-left {
      color: #ff7a7a;
      font-size: 14px;
      margin-top: 8px;
    }

    .multiple {
      font-weight: 800;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.02em;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border: 1px solid rgba(25, 27, 31, 0.1);
      box-sizing: border-box;
      border-radius: 16px;
    }
    .multiple.completed {
      color: rgba(25, 27, 31, 0.5);
      background: rgba(25, 27, 31, 0.1);
    }
    .multiple.active {
      background: #1ec37f;
      color: #fff;
    }

    .multiple.pending {
      border: 1.5px solid rgba(30, 195, 127, 0.4);
      color: #1ec37f;
      background: #fff;
    }
  }
}
</style>
