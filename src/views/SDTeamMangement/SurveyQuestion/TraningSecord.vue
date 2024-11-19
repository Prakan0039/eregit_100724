<template>
  <v-container style="padding: auto; fluid">
    <v-card-text>
      <ToolbarSurvey
        :step="stepper.index"
        :is-done="stepper.prevCompleted"
        @prev="stepperPrev"
      />
    </v-card-text>
    <div v-if="viewNumber == 0">
      <v-row>
        <v-col>
          <v-tabs v-model="menus_index" color="secondary">
            <v-tab
              v-for="(tabs, index) in menus"
              :key="index"
              class="text-capitalize"
            >
              <h3>{{ tabs.title }}</h3>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-spacer />
        <v-col align-self="center">
          <div class="d-flex justify-end align-center">
            <v-btn
              color="red"
              prepend-icon="mdi mdi-share"
              variant="outlined"
              rounded
              @click="handleSend"
            >
              ส่งต่อ
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-progress-linear
        v-if="isLoading"
        class="mt-5"
        color="red"
        indeterminate
      ></v-progress-linear>
      <div>
        <TranningComplateTable
          v-for="(item, index) in itemsTrannig"
          :item="item"
          :key="index"
          @handle-item-click="handleItemClicked"
        />
        <PaginationControl
          v-if="itemsTrannig.length > options.limit && menus_index === 0"
          class="mt-5"
          :value="options.page"
          :length="options.pageSize"
          @value="handlePaginationOption"
        />
      </div>
      <div
        class="center-container"
        v-if="itemsTrannig.length === 0 && menus_index === 0"
      >
        <v-icon size="100">mdi mdi-account-group-outline</v-icon>
        <h3>เรียนรู้ครบแล้ว</h3>
        <h3 class="mt-n2">ติดตามเรียนรู้ใหม่ได้เร็วๆนี้</h3>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import TranningComplateTable from "@/components/tables/trannigs/TranningComplateTable.vue";
import PaginationControl from "@/components/controls/PaginationControl.vue";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import ToolbarSurvey from "@/components/items/ToolbarSurvey.vue";
import RspService from "@/apis/RspService";
import { useRoute, useRouter } from "vue-router";
import { useShareActivityDialog } from "@/components/dialogs/ShareActivityDialogService";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { showShareActivityDialog } = useShareActivityDialog();
const { handlingErrorsMessage } = useErrorHandlingDialog();
import paginationUtils from "@/utils/paginationUtils";

const state = ref(null);
const viewNumber = ref(0);
const menus_index = ref(0);
const bp_number = ref(null);
const isLoading = ref(false);

const options = ref({
  offset: 0,
  limit: 10,
  page: 1,
  pageSize: 1,
});

const menus = ref([
  { title: "การเรียนรู้ที่ยังไม่ได้เรียน", id: 0 },
  { title: "การเรียนรู้ที่เรียนรุ้แล้ว", id: 1 },
]);
const itemsTrannig = ref([]);

const route = useRoute();
const router = useRouter();

const stepper = ref({
  index: 4,
  prevCompleted: true,
});

watch(
  () => menus_index.value,
  async () => {
    isLoading.value = true;
    itemsTrannig.value = [];
    if (menus_index.value === 0) {
      await onLLoadInComplated();
    } else {
      await onLoadComplated();
    }
  },
  { deep: true }
);

const onLoadComplated = async () => {
  try {
    const response = await RspService.getCompletedRspTrainingResults(
      bp_number.value,
      options.value.limit,
      options.value.offset
    );
    if (response.data?.is_success) {
      // itemsTrannig.value = response.data.data.completed_rsp_training_result;

      const headers = response.headers;
      const itemsOffset = Number(headers["items-offset"]);
      const itemsLimit = Number(headers["items-limit"]);
      const itemsTotal = Number(headers["items-total"]);

      options.value.offset = itemsOffset;
      options.value.limit = itemsLimit;
      options.value.pageSize = paginationUtils.pageSize(itemsLimit, itemsTotal);
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    isLoading.value = false;
  }
};

const onLLoadInComplated = async () => {
  try {
    const response = await RspService.getIncompletedRspTrainingResults(
      bp_number.value,
      options.value.limit,
      options.value.offset
    );
    if (response.data?.is_success) {
      itemsTrannig.value = response.data.data.incompleted_rsp_training_result;

      const headers = response.headers;
      const itemsOffset = Number(headers["items-offset"]);
      const itemsLimit = Number(headers["items-limit"]);
      const itemsTotal = Number(headers["items-total"]);

      options.value.offset = itemsOffset;
      options.value.limit = itemsLimit;
      options.value.pageSize = paginationUtils.pageSize(itemsLimit, itemsTotal);
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    isLoading.value = false;
  }
};

onBeforeMount(() => {
  state.value = route.query.state;
  bp_number.value = route.query.bp_number;
});

onMounted(async () => {
  await onLLoadInComplated();
});

const handlePaginationOption = async (page) => {
  options.value.page = page;
  options.value.offset = paginationUtils.pageOffset(page, options.value.limit);
  if (menus_index.value === 0) {
    await onLLoadInComplated();
  } else {
    await onLoadComplated();
  }
};

const handleItemClicked = (item) => {
  const authEmail = sessionStorage.getItem("auth_email");
  if (authEmail) {
    const width = 1200; // Popup width
    const height = 600 + 100; // Popup height
    const left = (window.innerWidth - width) / 2; // Center horizontally
    const top = (window.innerHeight - height) / 2; // Center vertically

    window.open(
      `${item.training_url}?username=${authEmail}`,
      "TrainingPopup",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  } else {
    alert("User email not found in session storage!");
  }
};

const handleSend = async () => {
  const result = await showShareActivityDialog(bp_number.value);
  if (result && result.email) {
    //TO DO THIS
    console.log("Email : ", result.email);
  }
};

const stepperPrev = () => {
  router.push(
    `/SDTeamMangement/Survey/Questionnaire/1?prev_completed=completed&state=created&bp_number=${bp_number.value}`
  );
};
</script>

<style>
.center-container {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  justify-content: center;
  align-items: center; /* Center align all content */
  height: 50vh; /* Full viewport height */
  text-align: center;
  color: lightgray; /* Optional: Text color */
}

.center-container h3 {
  margin: 5px 0; /* Add spacing between headings */
}
</style>
