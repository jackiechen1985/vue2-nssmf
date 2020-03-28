<template>
  <div id="app" style="height: 100%;">
    <router-view />
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: 'Nokia Pure';
  src: url('./assets/fonts/NokiaPureHWeb_Lt.eot');
  src: url('./assets/fonts/NokiaPureHWeb_Lt.eot?#iefix') format('embedded-opentype'),
       url('./assets/fonts/NokiaPureHWeb_Lt.woff') format('woff'),
       url('./assets/fonts/NokiaPureHWeb_Lt.svg#NokiaPureHWebLight') format('svg');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Nokia Pure';
  src: url('./assets/fonts/NokiaPureHWeb_Rg.eot');
  src: url('./assets/fonts/NokiaPureHWeb_Rg.eot?#iefix') format('embedded-opentype'),
       url('./assets/fonts/NokiaPureHWeb_Rg.woff') format('woff'),
       url('./assets/fonts/NokiaPureHWeb_Rg.svg#NokiaPureHWebRegular') format('svg');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Nokia Pure';
  src: url('./assets/fonts/NokiaPureHWeb_Bd.eot');
  src: url('./assets/fonts/NokiaPureHWeb_Bd.eot?#iefix') format('embedded-opentype'),
       url('./assets/fonts/NokiaPureHWeb_Bd.woff') format('woff'),
       url('./assets/fonts/NokiaPureHWeb_Bd.svg#NokiaPureHWebBold') format('svg');
  font-weight: bold;
  font-style: normal;
}

/* Reset */
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td{margin:0;padding:0;}fieldset,img{border:0;}address,caption,cite,code,dfn,em,strong,th,var{font-style:normal;font-weight:normal;}li{list-style:none;}caption,th{text-align:left;}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal;}q:before,q:after{content:'';}abbr,acronym {border:0;font-variant:normal;}sup {vertical-align:text-bottom;}sub {vertical-align:text-bottom;}input,textarea,select{font-family:inherit;font-size:inherit;font-weight:inherit;}input,textarea,select{*font-size:100%;}legend{color:#000;}

html, body {
  font-family: "Nokia Pure", sans-serif;
  // font-size: 14px;
  line-height: 32px;
  width: 100%;
  height: 100%;
}

*, ::after, ::before {
  box-sizing: border-box;
}
</style>
