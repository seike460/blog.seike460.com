<template>
  <div class="layout">
    <header class="header">
      <g-link :to="{ name: 'home' }"><g-image alt="seike460" src="~/img/seike460.png" width="50" /></g-link>

      <g-link :to="{ name: 'home' }"><span class="square_btn">blog.seike460.com</span></g-link>
      <nav class="nav">
        <g-link class="nav__link" :to="{ name: 'home' }"><span class="square_btn">Home</span></g-link>
        <g-link class="nav__link" :to="{ name: 'about' }"><span class="square_btn">About</span></g-link>
      </nav>
    </header>
    <slot/>
  </div>
</template>

<style>
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  margin:0;
  padding:0;
  line-height: 1.5;
  font-size: 17px;
  background: teal;
}

img {
  border: solid 1px #848484;
  box-shadow: 0px 0px 5px #848484;
  max-width: 100%;
  height:auto;
}

h1 {
  color: #6594e0;
  border-bottom: dashed 2px #6594e0;
}

h2 {
  color: #6594e0;
  border-bottom: dashed 2px #6594e0;
}

h3 {
color: #364e96;
border: solid 3px #364e96;
padding: 0.5em;
border-radius: 0.5em;
}



.layout {
  max-width: 1024px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  background: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 80px;
}

.header > a {
  text-decoration: none;
}


.square_btn{
    display: inline-block;
    padding: 0.5em 1em;
    text-decoration: none;
    background: #668ad8;
    color: #FFF;
    border-bottom: solid 4px #627295;
    border-radius: 3px;
}
.square_btn:active {
    -ms-transform: translateY(4px);
    -webkit-transform: translateY(4px);
    transform: translateY(4px);
    border-bottom: none;
}

.nav__link {
  margin-left: 20px;
}
</style>

<script>
</script>
