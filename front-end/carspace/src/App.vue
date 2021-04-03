<template>
  <div id="app">
    <div class="wrapper">
      <div class="logo">
        <img src="./assets/logo.png">
      </div>
      <div id="nav">
        <router-link class="navButton" to="/">MY CARS</router-link>
        <router-link class="navButton" to="/parts">PARTS</router-link>
        <!--Insert your last navButton for login here-->
      </div>
      <router-view/>
      <footer>
        Find the code for this website on <a href="https://github.com/chasemax0108/carspace">Github</a>
      </footer>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-image: url("./assets/bg.svg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100%;
  font-family: 'Varela Round', sans-serif;
}

#app {
  display: flex;
  justify-content: center;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 650px;
}

.logo {
  width: 100%;
}

.logo img {
  width: 100%;
  height: 100%;
}

#nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.navButton {
  display: block;
  color: #151B25;
  text-decoration: none;
  background-color: #DBE8E1;
  text-align: center;
  width: 49%;
  padding: 5px 5px;
  margin-top: 10px;
  font-size: 20px;
}

.navButton:hover {
  background-color: #E10032;
  color: #DBE8E1;
}

footer {
  background-color: #DBE8E1;
  width: 100%;
  text-align: center;
  padding: 10px;
  margin-top: 20px;
}

@media only screen and (max-width: 650px) {
  .wrapper {
    width: 90%;
    margin-top: 20px;
  }

  body {
    background-size: auto;
  }
  
}
</style>
