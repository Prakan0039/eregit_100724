<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" class="mt-5 pt-5">
        <AccountTaskTable
          :items="content.items"
          color-card-alert="warming"
          @handle-item-click="onHandleItemClick"
          @handle-reject-clicked="onHandleRejectClicked"
          @handle-sort-by="onHAndleSortBy"
        />
        <v-progress-linear
          color="red"
          v-if="isLoading"
          indeterminate
        ></v-progress-linear>
      </v-col>
      <v-col cols="12">
        <PaginationControl
          class="mt-3"
          :value="filter.page"
          :length="filter.pageSize"
          @value="handlePaginationEvent"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from "vue";
import AccountTaskTable from "@/components/tables/accounts/AccountTaskTable.vue";
import PaginationControl from "@/components/controls/PaginationControl.vue";
import AccountService from "@/apis/AccountServive";
import paginationUtils from "@/utils/paginationUtils";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import PartnerServive from "@/apis/PartnerServive";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import { useRouter } from "vue-router";

const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();

const router = useRouter();
const content = ref({
  items: [],
});

const filter = ref({
  offset: 0,
  page: 1,
  limit: 20,
  pageSize: 1,
});

const isLoading = ref(true);

const setLoading = () => {
  isLoading.value = true;
};
const leaveLoading = () => {
  isLoading.value = false;
};
const clearOldItem = () => {
  content.value.items = [];
};

onMounted(() => {
  getAccountDraftAll();
});

const handlePaginationEvent = (page) => {
  filter.value.page = page;
  filter.value.offset = paginationUtils.pageOffset(page, filter.value.limit);
  getAccountDraftAll();
};

const getAccountDraftAll = async (sortBy = "created_at:desc") => {
  setLoading();
  clearOldItem();
  try {
    const response = await AccountService.getAccountDraftAll(
      "Draft",
      filter.value.offset,
      filter.value.limit,
      sortBy
    );

    if (response.data?.is_success) {
      const headers = response.headers;
      const itemsOffset = Number(headers["items-offset"]);
      const itemsLimit = Number(headers["items-limit"]);
      const itemsTotal = Number(headers["items-total"]);

      filter.value.offset = itemsOffset;
      filter.value.limit = itemsLimit;
      filter.value.pageSize = paginationUtils.pageSize(itemsLimit, itemsTotal);

      content.value.items = response.data?.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    leaveLoading();
  }
};

const onHAndleSortBy = async (sortBy) => {
  await getAccountDraftAll(sortBy);
};

const onHandleRejectClicked = async (id) => {
  if (
    !(await showDialog(
      "ยืนยันการ  Reject Case ?",
      'เมื่อ Reject คุณไม่สามารถแก้ไขได้อีก\nคลิกปุ่ม "ตกลง" เพื่อดำเนินการ'
    ))
  )
    return;
  await updateAccountTaskById(id, "Reject");
};

const updateAccountTaskById = async (id, state) => {
  try {
    const response = await PartnerServive.updateAccountTask(id, state);
    if (response.data?.is_success) {
      await getAccountDraftAll();
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

const onHandleItemClick = (item) => {
  switch (item.account_task_action) {
    case "New Register":
      router.push({ name: "AccountDetail", params: { id: item.form_number } });
      break;
    case "Extend Role":
      router.push({
        name: "AccountExtendRole",
        query: { id: item.id, form_number: item.form_number },
      });
      break;
    case "Extend Company":
      router.push({
        name: "AccountExtendCompany",
        query: { id: item.id, form_number: item.form_number },
      });
      break;
      case "Change Information":
      router.push({
        name: "AccountChangeInfo",
        query: { form_number: item.form_number },
      });
      break;
  }
};
</script>
