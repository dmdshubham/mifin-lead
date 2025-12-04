import { css, Global } from "@emotion/react";
import Poppins from "@mifin/assets/fonts/Poppins/Poppins-Regular.ttf";
import PoppinsEot from "@mifin/assets/fonts/Poppins/Poppins-Regular.eot";
import PoppinsWoff from "@mifin/assets/fonts/Poppins/Poppins-Regular.woff";
import PoppinsWoff2 from "@mifin/assets/fonts/Poppins/Poppins-Regular.woff2";

const globalStyles = (
  <Global
    styles={() => css`
      @font-face {
        font-family: "Poppins";
        font-style: normal;
        font-weight: regular;
        src: url(${Poppins}) format("truetype");
        src: url(${PoppinsEot}),
             url(${PoppinsWoff}) format("woff"), 
             url(${PoppinsWoff2}) format("woff2);
      }
      html,
      body {
        margin: 0;
        padding: 0;
        min-height: 100%;
        font-family: "Poppins";
        scroll-behavior: smooth;
        background: #fff;
      }
      body {
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        padding-top: 0px;
        margin: 0px;
        font-family: "Poppins";
      }
      * {
        box-sizing: border-box;
        &:before,
        &:after {
          box-sizing: border-box;
        }
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      ul,
      li,
      h6,
      p,
      img,
      figure {
        margin: 0px;
        padding: 0px;
      }
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    box-shadow: 0 0 0 30px white inset !important;
    
}


    `}
  />
);

export { globalStyles };