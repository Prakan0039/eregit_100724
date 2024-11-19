<template>
  <div id="app">
    <router-view />
    <!-- เนื้อหาของแอป -->
    <div class="version">Version 2.0.3</div>
    </div>
  <!-- <Login /> -->
  <!-- <NewPassword /> -->
  <!-- <LoginOtpPage /> -->
  <!-- <EmployeeLogin /> -->

</template>
<style lang="scss">
@import "../src/styles/main.scss";


</style>
<script setup>
// import Login from "@/views/Login/LoginPage.vue";
// import NewPassword from "@/views/Login/NewPassword.vue";
// import LoginOtpPage from "@/views/Login/LoginOtpPage.vue";
// import EmployeeLogin from "@/views/Login/EmployeeLogin.vue";
</script>
<style>
#app {
  position: relative;
  min-height: 100vh;
}

.version {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
}
</style>
