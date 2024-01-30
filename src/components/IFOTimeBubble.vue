<template>
  <div class="countdown">
    <div v-if="harvestEndDate < nowD" class="status completed">
      Completed
    </div>
    <div v-else-if="harvestDate < nowD" class="status harvesting">
      Harvesting
    </div>
    <div v-else-if="endDate < nowD" class="status pending-harvest">
      Pending Harvest
    </div>
    <div v-else-if="date < nowD" class="status in-progress">
      In Progress
    </div>
    <div v-else class="status countdown__bubble">
      <div v-if="days > 0" class="countdown__block">
        <div class="countdown__digit">{{ days | twoDigits }}</div>
        <div class="countdown__text">days</div>
      </div>
      <div v-if="days > 0 || hours > 0" class="countdown__block">
        <div class="countdown__digit">{{ hours | twoDigits }}</div>
        <div class="countdown__text">hrs</div>
      </div>
      <div v-if="days <= 0" class="countdown__block">
        <div class="countdown__digit">{{ minutes | twoDigits }}</div>
        <div class="countdown__text">Min</div>
      </div>
      <div v-if="days <= 0 && hours <= 0" class="countdown__block">
        <div class="countdown__digit">{{ seconds | twoDigits }}</div>
        <div class="countdown__text">sec</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    twoDigits(value) {
      if (value.toString().length <= 1) {
        return "0" + value.toString();
      }
      return value.toString();
    },
  },
  props: {
    date: { type: Date, required: true },
    endDate: { type: Date, required: true },
    harvestDate: { type: Date, required: true },
    harvestEndDate: { type: Date, required: true },
  },
  data() {
    return {
      nowD: new Date(),
      now: Math.trunc(new Date().getTime() / 1000),
      event: this.date,
      finish: false,
    };
  },
  computed: {
    secondCount() {
      return this.calculatedDate - this.now;
    },
    calculatedDate() {
      return Math.trunc(Date.parse(this.event) / 1000);
    },
    seconds() {
      if (this.secondCount < 0) return 0;
      return this.secondCount % 60;
    },
    minutes() {
      if (this.secondCount < 0) return 0;
      return Math.trunc(this.secondCount / 60) % 60;
    },
    hours() {
      if (this.secondCount < 0) return 0;
      return Math.trunc(this.secondCount / 60 / 60) % 24;
    },
    days() {
      if (this.secondCount < 0) return 0;
      return Math.trunc(this.secondCount / 60 / 60 / 24);
    },
  },
  mounted() {
    const _self = this;
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
      if (!this.finish && this.calculatedDate - this.now <= 0) {
        _self.finish = true;
        _self.$emit("onFinish");
      }
    }, 1000);
  },
};
</script>
<style lang="scss">
.countdown {
  display: inline-block;
  &__block {
    display: inline-block;
    margin-right: 5px;
    text-align: center;
    width: 50px;
    &:first-child {
      .countdown__digit {
        &:before {
          display: none;
        }
      }
    }
    &:last-child {
      padding-right: 0;
    }
  }
  &__text {
    text-transform: uppercase;
  }
  &__digit {
    font-weight: bold;
    line-height: 1;
  }
  .status {
    padding: 5px 10px;
    border-radius: 20px;
  }
  .in-progress {
    color: #555CFF;
  }
  .pending-harvest {
    color: #F64947;
  }
  .harvesting {
    color: #1EC37F;
  }
  .countdown__bubble {
    // border: 1px solid #0D63FF;
    // background: rgba(13, 97, 255, 0.2);
  }
  .completed {
    // border: 1px solid #F94E4E;
    // background: rgba(249, 78, 78, 0.2);
  }
}
</style>
