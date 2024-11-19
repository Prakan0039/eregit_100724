<template>
  <v-container style="padding: auto" fluid>
    <v-card-text>
      <ToolbarSurvey
        :step="stepper.index"
        :is-done="stepper.prevCompleted"
        @prev="stepperPrev"
      />
    </v-card-text>
    <v-card>
      <v-card-item class="ml-15">
        <v-row dense class="mt-5">
          <v-col cols="6">
            <h2>Training</h2>
            <h3>เรียนรู้นโยบายทางด้านความยั่งยืนและกฎระเบียบความปลอดภัย</h3>
            <br />
            <h5>บริษัท เฟรเซอร์ส พร็อพเพอร์ตี้ มุ่งมั่นที่จะสร้างประสบการณ์</h5>
            <h5>
              ผ่านการดำเนินธุรกิจอย่างก้าวหน้า
              เน้นเรื่องการผลิตและบริโภคอย่างมีความรับผิดชอบ
            </h5>
            <br />
            <h5>
              ในฐานะผู้พัฒนาอสังหาริมทรัพย์ บริษัทฯ
              เล็งเห็นโอกาสที่ดีในการผลักดัน
            </h5>
            <h5>
              การดำเนินงานอย่างมีความรับผิดชอบ
              โดยการเพิ่มความรู้ความเข้าใจร่วมกับ
            </h5>
            <h5>
              ผู้รับเหมาฯ คู่ค้าทางธุรกิจ
              และซัพพลายเออร์ซึ่งเป็นส่วนสำคัญในความสำเร็จ
            </h5>
            <h5>ตามเป้าหมายความยั่งยืนของบริษัทฯ</h5>
            <br />
            <h5>
              บริษัท ฯ จึงขอความร่วมมือจากท่านในการเข้าร่วมเรียนรู้นโยบายทางด้าน
            </h5>
            <h5>
              ความยั่งยืนและกฎระเบียบความปลอดภัย อาชีวอนามัยและสภาพแวดล้อม
            </h5>
            <h5>ในการทำงาน</h5>
            <br />
            <!-- <h5 style="color: red">
              กรุณาติดตามการเรียนรู้ใหม่ๆได้ เร็วๆนี้
            </h5> -->
            <!-- <v-col>
              <v-icon color="red">mdi-star</v-icon>
              <span style="font-weight: bold; color: red"
                >กรุณาติดตามการเรียนรู้ใหม่ๆได้ เร็วๆนี้</span
              >
            </v-col> -->
            <v-col v-if="!bp_number">
              <v-icon color="red">mdi-star</v-icon>
              <span style="font-weight: bold; color: red"
                >ไม่พบข้อมูล BP_Number</span
              >
            </v-col>
            <br />
            <br />
          </v-col>
          <v-col cols="6" class="d-flex align-center jusityfy-start">
            <img
              src="../../../assets/trianing_image_survay.jpg"
              aspect-ratio="4/3"
              cover
              width="600"
              height="450"
            />
          </v-col>
        </v-row>
        <v-row dense class="mt-5" v-if="bp_number">
          <v-col cols="auto" class="d-flex justify-center">
            <v-btn
              color="secondary"
              width="140"
              class="text-capitalize"
              variant="outlined"
              rounded
              @click="handleSend"
            >
              ส่งต่อ
            </v-btn>
          </v-col>
          <v-col cols="auto" class="d-flex justify-center">
            <v-btn
              color="secondary"
              width="140"
              class="text-capitalize"
              rounded
              @click="now"
            >
              ทำเลย
            </v-btn>
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              width="140"
              class="text-capitalize"
              rounded
              variant="text"
              @click="later"
            >
              ทำภายหลัง >>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-container>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import ToolbarSurvey from "@/components/items/ToolbarSurvey.vue";
import { useRoute, useRouter } from "vue-router";
import { useShareActivityDialog } from "@/components/dialogs/ShareActivityDialogService";
const { showShareActivityDialog } = useShareActivityDialog();
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
import RspService from "@/apis/RspService";

const state = ref(null);
const bp_number = ref(null);

const route = useRoute();
const router = useRouter();

const stepper = ref({
  index: 4,
  prevCompleted: true,
});

onBeforeMount(() => {
  state.value = route.query.state;
  bp_number.value = route.params.bp_number;
});

const handleSend = async () => {
  const result = await showShareActivityDialog(bp_number.value);
  if (result && result.email) {
    console.log(result);
  }
};

const now = async () => {
  try {
    await RspService.createRspActivityLog(bp_number.value, 3, true);
    router.push(`/SDTeamMangement/TraningSecord?bp_number=${bp_number.value}`);
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

const later = async () => {
  try {
    await RspService.createRspActivityLog(bp_number.value, 3, false);
    router.push("/VendorDashBoard");
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data?.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

const stepperPrev = () => {
  router.push(
    `/SDTeamMangement/Survey/Questionnaire/1?prev_completed=completed&state=created&bp_number=${bp_number.value}`
  );
};
</script>
