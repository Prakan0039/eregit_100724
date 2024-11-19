<template>
  <ExceptionHandleDialog />
  <div style="background-color: lightgrey">
    <v-row align="center">
      <v-col cols="6">
        <v-row no-gutters>
          <v-col
            class="d-flex"
            cols="12"
            style="
              height: 100vh;
              background-image: url('/BG2-02.png');
              background-size: cover;
              background-position: center;
            "
          >
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <FormLogin
          class="d-flex justify-center"
          @on-forget-password="handleForgetPassword"
          @on-login-success="handleLoginSuccessfully"
          @on-login-failed="handleLoginFailed"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import FormLogin from "@/components/forms/Login/FormLogin.vue";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
import ExceptionHandleDialog from "@/components/dialogs/ExceptionHandleDialog.vue";

import { useRouter } from "vue-router";
import VerifyService from "@/apis/VerifyService";
const router = useRouter();
import { useRoute } from "vue-router";

const route = useRoute();
const email = route.query.accessible_email;
const code = route.query.code;

const dataInput = ref({
  Email: email,
  Password: "",
});

const handleForgetPassword = () => {
  router.push({
    name: "ForgetPasswordPage",
  });
};

onMounted(async () => {
  if (email && code) {
    dataInput.value.Email = email;
    await handleVertifyUrl();
  }
});

const handleVertifyUrl = async () => {
  try {
    const response = await VerifyService.verifyUrl(email, code);
    if (response.data?.is_success) {
      await checkedUserExits();
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.status;
      if (val == 400) {
        router.push({
          name: "ErrorPage",
          query: { err: "EXP_FORM" },
        });
      }

      if (val == 404) {
        router.push({
          name: "ErrorPage",
          query: { err: "NOT_FOUND" },
        });
      }
    }
  }
};

const checkedUserExits = async () => {
  try {
    await VerifyService.checkExistingUsernam(email);
  } catch (e) {
    const val = e.response.status;
    if (val == 404) {
      router.push({
        name: "SignUpPage",
        query: { email: email, form_number: code, to: "ChaneInfoNon" },
      });
    }
  }
};

const handleLoginSuccessfully = (dataInputLogin) => {
  dataInput.value = dataInputLogin;
  localStorage.setItem("temp_new_register", dataInput.value.Password);
  sessionStorage.setItem("auth_email", dataInput.value.Email);
  router.push({
    name: "ChaneInfoOTP",
    query: { email: dataInput.value.Email, form_number: code },
  });
};

const handleLoginFailed = (message) => {
  handlingErrorsMessage("Error", message);
};
</script>

<style scoped>
.imagebackground {
  background: url("../../../public/login.png") no-repeat center center fixed !important;
  background-size: cover;
}
</style>
