<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <div class="text-center mt-5">
      <h2>Follow up ESG Activities</h2>
    </div>
    <div class="text-left  extra-margin">
      <h4>กรุณาติดตามให้คู่ค้าทำ SD Activities ให้ครบทุกกิจกรรม</h4>
    </div>
    <v-card class="mx-auto mt-3 elevation-1">
      <!-- <v-card-item class="pa-8" v-if="isVendors">
        <div class="font-weight-bold">
          ต้องการส่ง Email ติดตามให้คู้ค้าทำ SD Activities แบบใด
        </div>

        <v-radio-group v-model="selected">
          <v-radio
            class="font-weight-medium"
            label="ส่ง Email ให้ Contact Owner ติดตาม"
            value="1"
          ></v-radio>
          <v-radio
            class="font-weight-medium"
            label="ส่ง Email ติดตามให้ Vendor โดยตรง"
            value="0"
          ></v-radio>
        </v-radio-group>
      </v-card-item> -->
      <v-card-item class="pa-8">
        <div class="font-weight-bold mb-3">
          Email คู่ค้า
        </div>

        <v-radio-group v-model="selected">

          <!-- <v-radio
            class="font-weight-medium"
            label="ส่ง Email ติดตามให้ Vendor โดยตรง"
            value="0"
          ></v-radio> -->
          <v-combobox
            ref="combobox"
            v-model="selectedEmail"
            :items="emails"
            variant="outlined"
            class="pl-"
            placeholder="ส่ง Email ติดตามให้ Vendor โดยตรง"
            density="compact"
            hide-selected
          >
            <template v-slot:append-item v-if="emails.length < 2">
              <v-list-item @click="addNewItem">
                <v-list-item-title style="color: red">
                  + เพิ่ม Admin vendor email
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>
        </v-radio-group>
      </v-card-item>
    </v-card>
    <!-- <v-card class="mx-auto mt-3 elevation-1">
      <v-card-item class="pa-8">
        <div class="font-weight-bold">ข้อความเพิ่มเติม</div>
        <v-textarea v-model="additional_message" variant="solo-filled"></v-textarea>
      </v-card-item>
    </v-card> -->
    <div class="text-center mt-10">
      <v-btn
        rounded
        class="ma-2"
        :disabled="laoding_sent"
        color="black"
        to="/AdminDashboard/AdminDashboardPage"
        style="width: 100px"
      >
        <strong>ยกเลิก</strong>
      </v-btn>
      <v-btn
        rounded
        class="ma-2"
        :loading="laoding_sent"
        @click="handleSend"
        color="secondary"
        style="width: 100px"
      >
        <strong>ส่ง</strong>
      </v-btn>
    </div>
  </v-container>
</template>
<script setup>
import { ref, onBeforeMount, nextTick } from "vue";
import RspService from "@/apis/RspService";
import { useRouter } from "vue-router";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import PartnerServive from "@/apis/PartnerServive";
import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
import { useFaildDialogDialog } from "@/components/dialogs/FailedDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
const router = useRouter();

const { showDialog } = useConfirmationDialog();
const { showAlert } = useAlertDialogDialog();
const { showFaildAlert } = useFaildDialogDialog();

const isVendors = ref(true);
const selected = ref("0");
const bp_number = ref(null);
const email_owner = ref(null);
const additional_message = ref(null);
const laoding_sent = ref(false);

const combobox = ref(null);
const selectedEmail = ref(null);
const emails = ref([null]);

const addNewItem = () => {
  nextTick(() => {
    if (combobox.value) {
      combobox.value.blur(); // Close the combobox dropdown
    }
  });
  if (selectedEmail.value && !emails.value.includes(selectedEmail.value)) {
    if (!emails.value[emails.value.length - 1]) emails.value = [];
    emails.value.push(selectedEmail.value);
    selectedEmail.value = null;
  } else {
    nextTick(() => {
      if (combobox.value) {
        combobox.value.focus();
        selectedEmail.value = null;
      }
    });
  }
};

onBeforeMount(async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const _bp_number = urlParams.get("bp_number");
  const _email = urlParams.get("email");
  bp_number.value = _bp_number;
  email_owner.value = _email;
  isVendors.value = _bp_number === null && _email === null;
  if (bp_number.value) await getBusinessPartnerDetail(bp_number.value);
});

const getBusinessPartnerDetail = async (bp_number) => {
  try {
    const response = await PartnerServive.getBusinessPartnerDetail(bp_number);

    if (
      response.data?.is_success &&
      response.data?.data?.admin_vendors &&
      response.data?.data?.admin_vendors.length > 0
    ) {
      emails.value = [];
      emails.value = response.data?.data?.admin_vendors.map((el) => el.email);
      console.warn(emails.value);
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

const handleSend = async () => {
  try {
    laoding_sent.value = true;
    if (isVendors.value) {
      let message = "";
      if (selected.value == 1) {
        message =
          "ระบบจะทำการส่ง Email ให้ Contact owner\nติดตามสถานะการทำกิจกรรมของ Vendor";
      } else {
        message =
          "ระบบจะทำการส่ง Email ให้ทุก Email ของ Vendor\nในแต่ละบริษัท ที่ทำการสมัครมาในระบบ";
      }
      if (await showDialog("ยืนยันการส่ง Email", message)) {
        const sessionData = sessionStorage.getItem("bp_numbers");
        const bpNumber_array = JSON.parse(sessionData);
        const response = await RspService.sendFollowUpVendors(
          bpNumber_array,
          selected.value,
          additional_message.value
        );
        const { is_success } = response.data;
        if (is_success) {
          if (
            await showAlert(
              "ทำการส่ง Email แล้ว",
              "ระบบทำการส่ง Email ติดตามเรียบร้อยแล้ว"
            )
          )
            router.push("/AdminDashboard/AdminDashboardPage");
        }
      }
    } else {
      let message = "";
      if (selected.value == 1) {
        message =
          "ระบบจะทำการส่ง Email ให้ Contact owner\nติดตามสถานะการทำกิจกรรมของ Vendor";
      } else {
        message = "ระบบจะทำการส่ง Email ให้ Vendor โดยตรง";
      }
      if (await showDialog("ยืนยันการส่ง Email", message)) {
        const email =
          selected.value === "1" ? email_owner.value : selectedEmail.value;
        const response = await RspService.sendFollowUpVendor(
          bp_number.value,
          selected.value,
          email,
          additional_message.value
        );
        const { is_success } = response.data;
        if (is_success) {
          if (
            await showAlert(
              "ทำการส่ง Email แล้ว",
              "ระบบทำการส่ง Email ติดตามเรียบร้อยแล้ว"
            )
          )
            router.push("/AdminDashboard/AdminDashboardPage");
        }
      }
    }
  } catch (e) {
    if (!isVendors.value && selected.value == 1) {
      if (
        await showFaildAlert(
          `ไม่มี Email ${email_owner.value} นี้ในระบบ`,
          "กรุณาตรวจสอบอีกครั้ง\nหรือติดต่อทาง super admin ให้ เพิ่มบัญชีในระบบ"
        )
      ) {
        return;
      }
    }
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    laoding_sent.value = false;
  }
};
</script>
<style>

.text-left {
  text-align: left; /* ชิดซ้าย */
}

.extra-margin {
  margin-top: 80px; /* เพิ่มระยะห่างด้านบน */
}</style>