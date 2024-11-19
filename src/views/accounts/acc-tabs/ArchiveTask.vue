<template>
  <v-container fluid>
    <!-- {{ content.items.account_task_action == New Register }} -->
      <!-- {{content.items}} -->
    <div style="display: flex; justify-content: flex-end" class="mt-5">
      <v-btn
        variant="outlined"
        @click="handlePreviewSelections"
        class="text-capitalize me-3"
        color="black"
        style="min-width: 100px; border-radius: 10px"
      >
        <v-icon left size="large" class="me-1">mdi-text-box-search-outline</v-icon>
        Preview ({{ amountItemSelect }})
      </v-btn>
      <v-btn
        @click="handleToExportSelection"
        class="text-capitalize"
        color="black"
        style="min-width: 100px; border-radius: 10px"
      >
        <v-icon left size="large" class="me-1">mdi-microsoft-excel</v-icon>
        Export ({{ amountItemSelect }})
      </v-btn>
    </div>

    <v-row justify="end" class="mt-5" dense>
      <v-col cols="12">
        <ExportTaskTable
          :items="content.items"
          :menu-items="menu_items"
          @handle-menu-clicked="onHandleMenuClicked"
          @handle-selection="onHandleSelection"
          @handle-sort-by="onHAndleSortBy"
        />
        <v-progress-linear color="red" v-if="isLoading" indeterminate></v-progress-linear>
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
import ExportTaskTable from "@/components/tables/accounts/ExportTaskTable.vue";
import PaginationControl from "@/components/controls/PaginationControl.vue";
import paginationUtils from "@/utils/paginationUtils";
import AccountService from "@/apis/AccountServive";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import PartnerServive from "@/apis/PartnerServive";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import { useAlertDialogDialog } from "@/components/dialogs/AlertSuccessDialogService";
import ExportService from "@/apis/ExportService";
import { useRouter } from "vue-router";

const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();
const { showAlert } = useAlertDialogDialog();
const router = useRouter();

const content = ref({
  items: [],
  itemsToExport: []
});

const filter = ref({
  offset: 0,
  page: 1,
  limit: 20,
  pageSize: 1
});

const amountItemSelect = ref(0);
const menu_items = [
  {
    id: 0,
    title: "แก้ไข",
    icon: "mdi mdi-wrench-cog"
  },
  {
    id: 1,
    title: "Move to Ready Export",
    icon: "mdi mdi-arrow-left"
  },
  {
    id: 2,
    title: "Reject",
    icon: "mdi mdi-close-circle"
  },
  {
    id: 4,
    title: "Export",
    icon: "mdi mdi-microsoft-excel"
  }
];

const isLoading = ref(true);

const setLoading = () => {
  isLoading.value = true;
};

const leaveLoading = () => {
  isLoading.value = false;
};

const preview = async url => {
  window.open(url, "_blank");
};

const handlePaginationEvent = page => {
  filter.value.page = page;
  filter.value.offset = paginationUtils.pageOffset(page, filter.value.limit);
  getAccountArchiveAll();
};

const handlePreviewSelections = async () => {
  try {
    const payload = [];
    for (let index = 0; index < content.value.itemsToExport.length; index++) {
      const el = content.value.itemsToExport[index];
      const findFormNumber = content.value.items.find(item => item.id == el);
      if (findFormNumber)
        payload.push({ form_number: findFormNumber.form_number });
    }
    const response = await PartnerServive.exportAccountTask(payload);
    if (response.data) {
      if (response.data.data?.file_url_vendor)
        preview(response.data.data.file_url_vendor);
      if (response.data.data?.file_url_customer)
        preview(response.data.data.file_url_customer);
      if (response.data.data?.file_url_change_info)
        preview(response.data.data?.file_url_change_info);
      // await showAlert("Preview Successfully", "Preview ข้อมูล account สำเร็จ");
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

const handleToExportSelection = async () => {
  try {
    const payload = [];
    for (let index = 0; index < content.value.itemsToExport.length; index++) {
      const el = content.value.itemsToExport[index];
      const findFormNumber = content.value.items.find(item => item.id == el);
      if (findFormNumber)
        payload.push({ form_number: findFormNumber.form_number });
    }
    const response = await PartnerServive.exportAccountTask(payload);
    if (response.data) {
      if (response.data.data?.file_url_vendor)
        ExportService.downloadFile(
          "file_url_vendor",
          "xlsx",
          response.data.data.file_url_vendor
        );
      if (response.data.data?.file_url_customer)
        ExportService.downloadFile(
          "file_url_customer",
          "xlsx",
          response.data.data.file_url_customer
        );
      if (response.data.data?.file_url_change_info)
        ExportService.downloadFile(
          "file_url_change_info",
          "xlsx",
          response.data.data?.file_url_change_info
        );
      // await showAlert("Export Successfully", "Export ข้อมูล account สำเร็จ");
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

const onHandleMenuClicked = async value => {
  const { event_id, item_id, index, form_number } = value;
  console.log(event_id);
  switch (event_id) {
    case menu_items[0].id:
  console.log("แก้ไข: ", form_number);

  const currentItem = content.value.items.find(item => item.form_number === form_number);

  // ถ้าเจอ currentItem และ account_task_action เป็น "New Register"
  if (currentItem && currentItem.account_task_action === "New Register") {
    // console.log("New Register!");
    router.push({ name: "AccountDetail", params: { id: form_number } });
  } else if(currentItem && currentItem.account_task_action === "Change Information"){
    router.push({
        name: "AccountChangeInfo",
        query: { form_number: form_number },
      });
  }else if(currentItem && currentItem.account_task_action === "Extend Company")
  {
    router.push({
        name: "AccountExtendCompany",
        query: { form_number: form_number },
      });
  }
  {
    console.log("ไม่มี New Register หรือข้อมูลไม่ตรงกับ form_number ที่กด");
  }
  break;
    case menu_items[1].id:
      console.log("Move to Ready Export: ", item_id);
      await updateAccountTaskById(item_id, "ReadyToExport");
      break;
    case menu_items[2].id:
      console.log("Reject: ", item_id);
      if (
        !(await showDialog(
          "ยืนยันการ  Reject Case ?",
          'เมื่อ Reject คุณไม่สามารถแก้ไขได้อีก\nคลิกปุ่ม \\"ตกลง\\" เพื่อดำเนินการ'
        ))
      )
        return;
      await updateAccountTaskById(item_id, "Reject");
      break;
    case menu_items[3].id:
      // console.log("Export: ", item_id);
      // console.log("Index: ", index);
      await exportAccountTaskById(content.value.items[index]?.form_number);
      break;
  }
};

const exportAccountTaskById = async form_number => {
  try {
    const response = await PartnerServive.exportAccountTask([{ form_number }]);
    if (response.data?.is_success) {
      if (response.data.data?.file_url_vendor)
        ExportService.downloadFile(
          "file_url_vendor",
          "xlsx",
          response.data.data.file_url_vendor
        );
      if (response.data.data?.file_url_customer)
        ExportService.downloadFile(
          "file_url_customer",
          "xlsx",
          response.data.data.file_url_customer
        );
      if (response.data.data?.file_url_change_info)
        ExportService.downloadFile(
          "file_url_change_info",
          "xlsx",
          response.data.data?.file_url_change_info
        );
      await showAlert("Export Successfully", "Export ข้อมูล account สำเร็จ");
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

const updateAccountTaskById = async (id, state) => {
  try {
    const response = await PartnerServive.updateAccountTask(id, state);
    if (response.data?.is_success) {
      await getAccountArchiveAll();
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

onMounted(async () => {
  await getAccountArchiveAll();
});

const clearOldItem = () => {
  content.value.items = [];
};

const getAccountArchiveAll = async (sortBy = "created_at:desc") => {
  setLoading();
  clearOldItem();
  try {
    const response = await AccountService.getAccountArchivetAll(
      "Archive",
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

const onHAndleSortBy = async sortBy => {
  await getAccountArchiveAll(sortBy);
};

const onHandleSelection = value => {
  amountItemSelect.value = value.length;
  content.value.itemsToExport = value;
  // console.log("onHandleSelection: ", JSON.stringify(value));
};
</script>

<style>
.full-page {
  width: 100%;
}
</style>
