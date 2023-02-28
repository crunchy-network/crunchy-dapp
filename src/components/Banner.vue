<template>
  <div id="banner">
    <div id="outline">
      <div id="wrapper">
        <div id="icon-wrapper">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.01 21.7398C10.38 21.7398 9.76 21.5298 9.27 21.1098L7.68999 19.7598C7.52999 19.6198 7.13 19.4798 6.92 19.4798H5.17C3.69 19.4798 2.49 18.2798 2.49 16.7998V15.0898C2.49 14.8798 2.35 14.4798 2.22 14.3298L0.859995 12.7298C0.0399951 11.7598 0.0399951 10.2398 0.859995 9.25982L2.22 7.65982C2.35 7.50982 2.49 7.10982 2.49 6.89982V5.19982C2.49 3.71982 3.69 2.51982 5.17 2.51982H6.9C7.11 2.51982 7.5 2.36982 7.67 2.22982L9.25 0.879824C10.23 0.0498242 11.76 0.0498242 12.74 0.879824L14.32 2.22982C14.48 2.36982 14.89 2.50982 15.1 2.50982H16.8C18.28 2.50982 19.48 3.70982 19.48 5.18982V6.88982C19.48 7.09982 19.63 7.48982 19.77 7.65982L21.12 9.23982C21.96 10.2298 21.95 11.7598 21.12 12.7298L19.77 14.3098C19.63 14.4798 19.49 14.8698 19.49 15.0798V16.7798C19.49 18.2598 18.29 19.4598 16.81 19.4598H15.11C14.9 19.4598 14.51 19.6098 14.33 19.7498L12.75 21.0998C12.26 21.5298 11.63 21.7398 11.01 21.7398ZM5.17 4.01982C4.52 4.01982 3.98999 4.54982 3.98999 5.19982V6.89982C3.98999 7.46982 3.73 8.18982 3.36 8.62982L2 10.2298C1.66 10.6398 1.66 11.3598 2 11.7598L3.34999 13.3498C3.70999 13.7598 3.98 14.5098 3.98 15.0798V16.7898C3.98 17.4398 4.51 17.9698 5.16 17.9698H6.9C7.46 17.9698 8.2 18.2398 8.64 18.6098L10.23 19.9698C10.64 20.3198 11.36 20.3198 11.77 19.9698L13.35 18.6198C13.8 18.2398 14.53 17.9798 15.09 17.9798H16.79C17.44 17.9798 17.97 17.4498 17.97 16.7998V15.0998C17.97 14.5398 18.24 13.8098 18.61 13.3598L19.97 11.7698C20.32 11.3598 20.32 10.6398 19.97 10.2298L18.62 8.64982C18.24 8.19982 17.98 7.46982 17.98 6.90982V5.19982C17.98 4.54982 17.45 4.01982 16.8 4.01982H15.1C14.53 4.01982 13.79 3.74982 13.35 3.37982L11.76 2.01982C11.35 1.66982 10.64 1.66982 10.22 2.01982L8.64999 3.37982C8.19999 3.74982 7.47 4.01982 6.9 4.01982H5.17Z"
              fill="#292D32"
            />
          </svg>
        </div>
        <div id="exclaimation-mark"></div>
        <div id="dot"></div>
      </div>
      <div id="announcement">
        {{ banner.announcement }}
        <a
          :href="banner.link"
          target="_blank"
          style="text-decoration: none; color: #555CFF"
        >
          here
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    banner: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#banner {
  /* Auto layout */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 24px;
  gap: 10px;
  height: 40px;
  
}
#outline {
  width: 1032px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* Balance Background */
  background: #ffeecc;
  border-radius: 18px;
}
#wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  left: 0px;
  top: 0px;
}
#exclaimation-mark {
  position: absolute;
  left: 41.88%;
  right: 50.88%;
  top: 30.75%;
  bottom: 42.83%;

  background: #292d32;
}
#dot {
  width: 2px;
  height: 2px;
  position: absolute;
  left: 43.83%;
  right: 45.83%;
  top: 61.96%;
  bottom: 29.71%;

  background: #292d32;
}
#announcement {
  margin-left: 11.25px;
  width: 704px;
  height: 21px;
  left: 181px;
  top: 9.5px;

  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  /* identical to box height, or 21px */

  letter-spacing: 0.02em;

  color: #000000;
}
@media (max-width: 993px) {
  #outline {
    width: 800px;
    height: 70px;
  }
}

@media (max-width: 600px) {
  #outline {
    width: 350px;
  }
  #announcement {
    font-size: 12px;
    height: 45px;
  }
  #wrapper {
    left: 8px;
  }
  #exclaimation-mark {
    left: 44.88%;
    right: 47.88%;
  }
  #dot {
    left: 43.83%;
    right: 45.83%;
  }
}
</style>
