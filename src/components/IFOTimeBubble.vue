<template>
  <div class="countdown">
      <div v-if="days > 0 || hours > 0 || minutes > 0 || seconds > 0"> 
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
        <div v-if="days <=0 && hours <=0" class="countdown__block">
            <div class="countdown__digit">{{ seconds | twoDigits }}</div>
            <div class="countdown__text">sec</div>
        </div>
      </div>
    <div v-if="days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0"> 
        <div class="placeholderText">
            {{calcPlaceholderText(endDate)}}    
        </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    date: null,
    endDate: null
  },
  data () {
    return {
      now: Math.trunc((new Date()).getTime() / 1000),
      event: this.date,
      finish: false
    }
  },
  mounted () {
    const _self = this
    window.setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000)
      if (!this.finish && this.calculatedDate - this.now <= 0) {
        _self.finish = true
        _self.$emit('onFinish')
      }
    }, 1000)
  },
  computed: {
    secondCount () {
      return this.calculatedDate - this.now
    },
    calculatedDate () {
      return Math.trunc(Date.parse(this.event) / 1000)
    },
    seconds () {
      if (this.secondCount < 0) return 0
      return this.secondCount % 60
    },
    minutes () {
      if (this.secondCount < 0) return 0
      return Math.trunc(this.secondCount / 60) % 60
    },
    hours () {
      if (this.secondCount < 0) return 0
      return Math.trunc(this.secondCount / 60 / 60) % 24
    },
    days () {
      if (this.secondCount < 0) return 0
      return Math.trunc(this.secondCount / 60 / 60 / 24)
    }
  },
  filters: {
    twoDigits (value) {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }
  },
  methods: {
      calcPlaceholderText(endDate){
          let now = new Date();
          if(now < endDate){
              return "In Progress"
          }else{
              return "Completed"
          }
      }
  }
}
</script>
<style lang="scss">
.countdown{
  &__block {
    text-align: center;
    padding: 0px 15px;
    position: relative;
    &:first-child{
      padding-left: 0;
      .countdown__digit{
        &:before{
          display: none;
        }
      }
    }
    &:last-child{
      padding-right: 0;
    }
  }
  &__text {
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  &__digit {
    font-weight: bold;
    line-height: 1;
    margin-bottom: 5px;
    &:before{
      content: ":";
      left: -5px;
    }
  }
}
</style>
