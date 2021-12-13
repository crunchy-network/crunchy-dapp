<template>
  <div style="position: relative" id="timeline">
    <div class="indicator-side-bar"></div>
    <div v-for="(item, index) in items" v-bind:key="index">
      <div class="item-wrapper">
        <div :style="index === 0 && '    border-top-left-radius: 10px; border-top-right-radius: 10px;'" :class="'indicator-bar ' + item.status">
          <div :class="'badge ' + item.status">
            <i v-if="item.status === 'active'" class="fas fa-check"></i>
          </div>
        </div>

        <div class="content-body">
          <div>
            <h2 :style="item.status === 'active' && 'opacity: 1'" class="text">
              {{ dateFormater(item.date) }}
            </h2>
            <h2 v-if="item.status === 'active'" class="text days-left">{{ item.daysLeft }} day{{ item.daysLeft > 1 && "s" }} left</h2>
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
      const m = date.toLocaleDateString(undefined, { month: "long" });
      const month = m.length > 4 ? m.substring(0, 3) : m;
      if (date) {
        return date.toLocaleDateString(undefined, { day: "2-digit" }) + " " + month + " " + date.getFullYear();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.indicator-side-bar {
  background: rgba(25, 27, 31, 0.05);
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}

.item-wrapper {
  position: relative;
  padding-left: 44px;
  height: 90px;
  box-sizing: border-box;

  .indicator-bar.last {
    border-radius: 0 0 10px 10px;
  }
  .indicator-bar {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    display: flex;
    justify-content: center;
    padding: 12px 2px;
    .badge {
      background: #ffffff;
      opacity: 0.4;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      padding: 4px;
      font-size: 10px;
      color: #555cff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .badge.active {
      opacity: 1;
      height: 15px;
      width: 15px;
    }
  }

  .indicator-bar.active {
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .indicator-bar.active,
  .indicator-bar.completed {
    background: #555cff;
  }
  .content-body {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    line-height: 19px;

    /* padding-top: 16px; */
    .text {
      font-weight: 800;
      font-size: 16px;
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
      min-width: 58px;
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
