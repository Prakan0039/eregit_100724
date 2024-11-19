<template>
  <v-container>
    <v-card
    class="px-5 py-5"
    border="outlined"
    style="width: 100%; max-width: 600px; border-radius: 20px"
    >
      <v-form v-model="validateForm">
        <v-card-item dense>
          <v-row>
            <v-col class="d-flex justify-center">
              <!-- <v-img
              aspect-ratio="16/9"
              cover
              prepend-icon="mdi mdi-information-outline"
                width="100"
                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              ></v-img> -->
              <v-img
                style="max-width: 200px"
                class="mt-5"
                src="/frasers.png"
              ></v-img>
            </v-col>
          </v-row>

          <div class="text-center mt-5 pa-5 ma-5">
            <h1>Supplier Qualification System</h1>
            <h1>สร้างรหัสผ่านใหม่</h1>
          </div>
          <v-row no-gutters>
            <v-col><h2>อีเมล</h2></v-col>

            <v-col cols="12">
              <v-text-field
                variant="solo-filled"
                readonly
                v-model="email"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <h2>สร้างรหัสผ่านใหม่</h2>
            <v-col cols="12">
              <v-text-field
                :disabled="loading"
                variant="solo-filled"
                :type="show ? 'text' : 'password'"
                v-model="newPassword"
                placeholder="รหัสผ่านใหม่"
                :rules="rulesValid.newPassword"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                :disabled="loading"
                variant="solo-filled"
                :type="show ? 'text' : 'password'"
                v-model="conPassword"
                placeholder="ยืนยันรหัสผ่านใหม่"
                :rules="rulesValid.conPassword"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <v-checkbox
                :disabled="loading"
                label="แสดงรหัสผ่าน"
                v-model="show"
              ></v-checkbox>
              <!-- <h4>แสดงรหัสผ่าน</h4> -->
            </v-col>
          </v-row>

          <v-row
            class="text-center pa-5 ma-0"
            dense
            justify="center"
            align="center"
          >
            <v-col cols="12">
              <!-- Set cols to 12 to take up the full width of the row -->
              <v-btn
                size="x-large"
                block
                :disabled="loading"
                :loading="loading"
                class="text-capitalize rounded-pill"
                color="red"
                @click="handleResetPassword"
              >
                <!-- <v-icon>mdi-plus</v-icon> -->
                สร้างรหัสผ่านใหม่
              </v-btn>
            </v-col>
          </v-row>
        </v-card-item>
      </v-form>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import verifyService from "@/apis/VerifyService";

import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();

import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
const { showAlert } = useAlertDialogDialog();

const router = useRouter();

const email = ref(null);
const newPassword = ref(null);
const conPassword = ref(null);
const code = ref(null);
const show = ref(false);
const loading = ref(false);
const validateForm = ref(null);
const rulesValid = ref({
  newPassword: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  conPassword: [
    (v) => !!v || "กรุณากรอกข้อมูลให้ครบ",
    (v) => v === newPassword.value || "รหัสผ่านไม่ตรงกัน",
    (v) => !!v || "กรุณากรอกรหัสผ่าน",
    (v) => v.length >= 8 || "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
    (v) =>
      /[A-Z]/.test(v) || "รหัสผ่านต้องมีอักษรตัวพิมพ์ใหญ่อย่างน้อยหนึ่งตัว",
    (v) =>
      /[a-z]/.test(v) || "รหัสผ่านต้องมีอักษรตัวพิมพ์เล็กอย่างน้อยหนึ่งตัว",
    (v) => /[0-9]/.test(v) || "รหัสผ่านต้องมีอย่างน้อยหนึ่งตัวเลข",
    (v) => /[\W_]/.test(v) || "รหัสผ่านต้องมีอย่างน้อยหนึ่งสัญลักษณ์",
  ],
});

onBeforeMount(() => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  email.value = urlParams.get("accessible_email");
  code.value = urlParams.get("code");
  // console.log(code.value);
  // console.log(email.value);

  handleVerifyUrl(email.value, code.value);
});

const handleVerifyUrl = async (email, code) => {
  try {
    loading.value = true;
    const response = await verifyService.verifyUrl(email, code);
    // console.log(response);
    if (response?.data?.code !== "200") {
      router.push("/Error?err=EXP_FORM");
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      router.push("/Error?err=EXP_FORM");
      return;
    }
    handlingErrorsMessage("unknown", e.message);
    router.push("/Error?err=EXP_FORM");
  } finally {
    loading.value = false;
  }
};
const handleResetPassword = async () => {
  if (validateForm.value) {
    try {
      loading.value = true;
      const response = await verifyService.resetPassword(
        email.value,
        conPassword.value,
        code.value
      );
      if (response.data?.is_success) {
        const confirmed = await showAlert(
          "สร้างรหัสผ่านใหม่สำเร็จแล้ว",
          "คุณสามารถใช้รหัสผ่านใหม่เข้าใช้งานได้เลย"
        );
        if (confirmed) {
          router.push("/SignIn");
        }
      }
    } catch (e) {
      if (e.response) {
        const val = e.response?.data;
        handlingErrorsMessage(val.message, val.data?.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    } finally {
      loading.value = false;
    }
  }
};
</script>
