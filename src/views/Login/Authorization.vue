<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- <div style="background-color: lightgrey"></div> -->
  <v-container style="height: 100vh">
    <v-row align-content="center" class="fill-height" justify="center">
      <v-col class="text-center" cols="12">
        <h2>Authorization</h2>
      </v-col>
      <v-col cols="3">
        <v-progress-linear color="secondary" height="10" indeterminate rounded></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
import { ref, onMounted, watch } from "vue";
import VerifyService from "@/apis/VerifyService";
import { useRoute, useRouter  } from "vue-router";
import Navigation from "@/router/navigation";
import AuthService from "@/apis/OAuthService";

import { useSessionInfoStore } from "@/stores/sessionInfoStore";

const router = useRouter();
const route = useRoute();
const store = useSessionInfoStore();
const email_ad = ref("");

const oAuth2Token = ref(route.query.token);

// onMounted(() => {
//   console.log("oAuth2Token", oAuth2Token)
//   // if (oAuth2Token.value) {
//     //if not null -> call decode api -> save email to sessionStorage.setItem("auth_email", email);
//   // }
//   if(oAuth2Token.value){
//     getAuthenticationDecodeToken(1, oAuth2Token.value);
//   }

//   let auth_email = sessionStorage.getItem("auth_email");
//   console.log(auth_email);
//   handleAuthorization(auth_email);
// });

onMounted(async () => {
  console.log("oAuth2Token", oAuth2Token);
  // let accessToken = sessionStorage.getItem("accessToken");


  // If there's an oAuth2Token, decode it first
  if (oAuth2Token.value) {
    await getAuthenticationDecodeToken(); // Ensure decoding completes before proceeding
  }

  // Now retrieve the email from sessionStorage and call handleAuthorization
  const auth_email = sessionStorage.getItem("auth_email");
  console.log("auth_email after decode:", auth_email);
  
  if (auth_email) {
    await handleAuthorization(auth_email); // Call handleAuthorization after decoding and setting auth_email
  } else {
    console.error("No auth_email found in sessionStorage");
  }
});

const handleAuthorization = async email => {
  try {
    const response = await VerifyService.getAuthenInfo(email);
    if (response.data?.is_success) {
      // result
      console.log("authen", response.data.data[0]);
      const authInfo = response.data.data[0];
      // console.log("authenisactive", authInfo.is_active);
      if (!authInfo.is_active) {
        router.push("/Error?err=EXP_FORM");
        return;
      }
      sessionStorage.setItem("userId", authInfo.id);
      sessionStorage.setItem("popo", authInfo.bp_number);
      sessionStorage.setItem("member_type", authInfo.member_type.id);
      sessionStorage.setItem("role_id", authInfo.role.id);

      const modulesId = Array.from(authInfo.modules, x => x.id);
      store.sessionInfo = authInfo;

      const modulesJson = JSON.stringify(modulesId);
      sessionStorage.setItem("auth_modules", modulesJson);

      const current = sessionStorage.getItem("auth_reload");
      if (current) {
        router.push(current);
        return;
      }
      // console.log("modulesIdfff", modulesId[0])
      handlePushDefualt(modulesId[0]);
    }
  } catch (e) {
    router.push("/Error?err=NOT_MODULES");
  }
};

// eslint-disable-next-line no-unused-vars
const handlePushDefualt = id => {
  const root = Navigation.find(_ => _.id === id);
  console.log(root);
  if (!root) {
    router.push("/Error?err=NOT_MODULES");
    return;
  }
  router.push(root.path);
};


// const getAuthenticationDecodeToken = async () => {
//   try {
//     console.log("oAuth2Token.value", oAuth2Token.value);
    
//     const response = await AuthService.decodeToken(1, oAuth2Token.value);
    
//     if (response.data?.success) {

//       console.log("Decoded Token Username:", response.data.data.Username);
//       email_ad.value = response.data.data.Username;
      

//       console.log("Setting auth_email in sessionStorage:", email_ad.value);
//       sessionStorage.setItem("auth_email", email_ad.value);

//     } else {
//       console.log("Token decode failed: success flag is false or undefined.");

//     }
//   } catch (e) {
//     console.error("Error during token decoding:", e.response ? e.response.data : e.message);
//   }
// };

const getAuthenticationDecodeToken = async () => {
  try {
    console.log("oAuth2Token.value", oAuth2Token.value);
    
    // เรียก decodeToken ด้วย oAuth2Token.value เดิม
    let response = await AuthService.decodeToken(sessionStorage.getItem("accessToken"), oAuth2Token.value);
    
    if (response.data?.success) {
      // console.log("Decoded Token Username:", response.data.data.Username);
      email_ad.value = response.data.data.Username;

      // console.log("Setting auth_email in sessionStorage:", email_ad.value);
      sessionStorage.setItem("auth_email", email_ad.value);
    } else {
      // console.log("Token decode failed. Fetching new token...");
      const authResponse = await AuthService.getAuthToken();
      
      if (authResponse.data?.success && authResponse.data?.data.access_token) {
        const newAccessToken = authResponse.data.data.access_token;
        
        // console.log("New token fetched:", newAccessToken);

        response = await AuthService.decodeToken(newAccessToken, oAuth2Token.value);

        if (response.data?.success) {
          console.log("Decoded Token Username after retry:", response.data.data.Username);
          email_ad.value = response.data.data.Username;

          // console.log("Setting auth_email in sessionStorage after retry:", email_ad.value);
          sessionStorage.setItem("auth_email", email_ad.value);
        } else {
          console.log("Token decode failed after retry.");
        }
      }
    }
  } catch (e) {
    console.error("Error during token decoding:", e.response ? e.response.data : e.message);
    const authResponse = await AuthService.getAuthToken();
      
      if (authResponse.data?.success && authResponse.data?.data.access_token) {
        const newAccessToken = authResponse.data.data.access_token;
        
        // console.log("New token fetched:", newAccessToken);

        response = await AuthService.decodeToken(newAccessToken, oAuth2Token.value);

        if (response.data?.success) {
          console.log("Decoded Token Username after retry:", response.data.data.Username);
          email_ad.value = response.data.data.Username;

          // console.log("Setting auth_email in sessionStorage after retry:", email_ad.value);
          sessionStorage.setItem("auth_email", email_ad.value);
        } else {
          console.log("Token decode failed after retry.");
        }
      }
  }
};


</script>
