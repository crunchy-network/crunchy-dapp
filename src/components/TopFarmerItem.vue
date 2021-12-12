<template>
  <div :style="(last || first) && 'border-bottom: 0px'" class="wrapper">
    <el-row type="flex" align="center" style="align-items: center">
      <div style="margin-right: 20px" :class="'avatar-wrapper p-' + position">
        <div v-html="avatarGenerator().avatar" :style="'background: ' + avatarGenerator().backdrop" class="backdrop"></div>
      </div>

      <div class="text-content">
        <p class="top">
          <span :style="position === '1st' && 'color: #555cff;'">{{ position }}</span> • <span style="color: #191B1F">{{ name }}</span>
        </p>
        <p style="font-size: 14px; opacity: 0.6; font-weight: 300 ;color: #191B1F;">Own {{ own }} % of Total Farm</p>
      </div>
    </el-row>

    <div v-if="first" class="first-bar"></div>
  </div>
</template>

<script>
export default {
  name: "TopFarmerItem",
  props: ["name", "own", "position", "first", "last"],
  methods: {
    avatarGenerator() {
      const avatar = [
        `<svg width="29" height="38" viewBox="0 0 29 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.4561 35.3105L16.5251 23.9426H6.45642L8.05842 36.3238C8.08542 36.5331 8.13994 36.735 8.2188 36.9256C9.43608 37.1704 10.6955 37.2988 11.9848 37.2988C15.0288 37.2988 17.9056 36.583 20.4561 35.3105Z"
            fill="#FEA5A3"
          />
          <path
            d="M4.77153 13.1704C4.77153 13.1704 2.10107 24.4365 3.81902 28.2567C5.5369 32.0767 11.9755 30.0882 16.8148 25.356L17.9979 13.6356L4.77153 13.1704Z"
            fill="url(#paint0_linear_2811_7797)"
          />
          <path
            d="M15.1967 20.174C14.9389 20.1316 14.7796 19.8712 14.863 19.6235C15.1158 18.8704 15.5623 17.3517 15.5137 16.137C15.5137 16.137 16.3004 15.285 12.7416 15.3586C9.1826 15.4323 3.86248 15.4931 2.0677 12.9166C0.317874 10.4045 1.18031 2.71114 6.92682 7.15988C7.14546 7.32892 7.46655 7.25015 7.57391 6.99562C8.03821 5.89582 9.39082 3.51252 12.2594 3.99386C14.9436 4.44389 15.6745 6.13364 15.8733 7.02993C15.9319 7.29341 16.2185 7.43533 16.4621 7.31935C17.6164 6.77008 20.4794 5.80934 22.6215 8.44445C24.3857 10.6147 24.0218 12.1993 23.5365 13.0545C23.3795 13.3317 23.5688 13.6708 23.887 13.6841C24.749 13.7197 25.9571 14.1273 26.3425 16.0247C26.8756 18.6479 23.9251 19.1755 23.0709 19.2729C22.9311 19.2886 22.8074 19.3708 22.7423 19.4954C22.2408 20.461 19.9274 24.6082 16.5904 25.9075C16.3013 26.0199 15.9935 25.7859 16.017 25.4767L16.375 20.7578C16.3918 20.5387 16.2379 20.3434 16.0209 20.3079L15.1967 20.174Z"
            fill="#191B1F"
          />
          <defs>
            <linearGradient id="paint0_linear_2811_7797" x1="-255.797" y1="169.407" x2="-232.735" y2="156.455" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FF928E" />
              <stop offset="1" stop-color="#FEB3B1" />
            </linearGradient>
          </defs>
        </svg>`,
        `<svg width="29" height="38" viewBox="0 0 29 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.4561 35.3115L16.5251 23.9436H6.45642L8.05842 36.3248C8.08542 36.5341 8.13994 36.736 8.2188 36.9266C9.43608 37.1714 10.6955 37.2998 11.9848 37.2998C15.0288 37.2998 17.9056 36.584 20.4561 35.3115Z"
            fill="#FEA5A3"
          />
          <path
            d="M4.77153 13.1714C4.77153 13.1714 2.10107 24.4374 3.81902 28.2577C5.5369 32.0777 11.9755 30.0892 16.8148 25.357L17.9979 13.6366L4.77153 13.1714Z"
            fill="url(#paint0_linear_2811_7819)"
          />
          <path
            d="M15.1967 20.175C14.9389 20.1326 14.7796 19.8721 14.863 19.6245C15.1158 18.8714 15.5623 17.3527 15.5137 16.138C15.5137 16.138 16.3004 15.286 12.7416 15.3596C9.1826 15.4333 3.86248 15.494 2.0677 12.9175C0.317874 10.4055 1.18031 2.71212 6.92682 7.16085C7.14546 7.32989 7.46655 7.25113 7.57391 6.9966C8.03821 5.89679 9.39082 3.51349 12.2594 3.99484C14.9436 4.44486 15.6745 6.13462 15.8733 7.0309C15.9319 7.29438 16.2185 7.43631 16.4621 7.32033C17.6164 6.77106 20.4794 5.81032 22.6215 8.44542C24.3857 10.6157 24.0218 12.2002 23.5365 13.0555C23.3795 13.3327 23.5688 13.6717 23.887 13.685C24.749 13.7207 25.9571 14.1283 26.3425 16.0257C26.8756 18.6488 23.9251 19.1765 23.0709 19.2739C22.9311 19.2896 22.8074 19.3718 22.7423 19.4964C22.2408 20.462 19.9274 24.6092 16.5904 25.9084C16.3013 26.0208 15.9935 25.7868 16.017 25.4777L16.375 20.7588C16.3918 20.5397 16.2379 20.3443 16.0209 20.3088L15.1967 20.175Z"
            fill="#193670"
          />
          <defs>
            <linearGradient id="paint0_linear_2811_7819" x1="-255.797" y1="169.408" x2="-232.735" y2="156.456" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FF928E" />
              <stop offset="1" stop-color="#FEB3B1" />
            </linearGradient>
          </defs>
        </svg>`,
      ];
      const backdrop = ["#FFBCD0", "#7CE1B7", "#92D2ED", "#FF7A7A"];

      return {
        avatar: avatar[Math.round(Math.random() * 1)],
        backdrop: backdrop[Math.round(Math.random() * 3)],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.wrapper {
  position: relative;
  padding-top: 21px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(25, 27, 31, 0.1);
  .el-row {
    .avatar-wrapper {
      border: 2.5px solid rgba(25, 27, 31, 0.06);
      border-top-color: rgba(47, 52, 63, 0.2);
      border-right-color: rgba(25, 27, 31, 0.2);
      width: 52px;
      height: 52px;
      border-radius: 50%;
      padding: 2px;
      .backdrop {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        transition: 0.45s ease background;
        svg {
          width: 85%;
        }
      }
    }
    .avatar-wrapper.p-1st {
      border-top-color: #555cff;
      border-right-color: #555cff;
    }
    .text-content {
      .top {
        font-weight: 800;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.02em;
        color: rgba(25, 27, 31, 0.4);
        margin-bottom: 10px;
      }
    }
  }

  .first-bar {
    position: absolute;
    left: -40px;
    right: -40px;
    bottom: 0;
    border-bottom: 1px solid rgba(25, 27, 31, 0.1);
  }
}
</style>
