<template>
  <v-container fluid>
    <v-row justify="end" class="mt-5 pt-5" dense>
      <!-- <v-col cols="2">
        <v-btn variant="outlined" block class="text-capitalize" color="black">
          <v-icon left>mdi mdi-arrow-left</v-icon>
          Move To Daft ({{ amountItemSelect }})
        </v-btn>
      </v-col> -->
      <v-col cols="12">
        <ExportTaskTable
          :items="content.items"
          :menu-items="[]"
          @handle-menu-clicked="onHandleMenuClicked"
          @handle-selection="onHandleSelection"
          @handle-sort-by="onHAndleSortBy"
        />
        <v-progress-linear
          color="red"
          v-if="isLoading"
          indeterminate
        ></v-progress-linear>
        <!-- @handle-item-click="onHandleItemClick" -->
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
// import { useRouter } from "vue-router";
import paginationUtils from "@/utils/paginationUtils";
import AccountService from "@/apis/AccountServive";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import PartnerServive from "@/apis/PartnerServive";

// const router = useRouter();
const { handlingErrorsMessage } = useErrorHandlingDialog();
// const dialogFilter = ref(false);
const amountItemSelect = ref(0);
const menu_items = [
  {
    id: 0,
    title: "Move to Daft",
    icon: "mdi mdi-arrow-left",
  },
];

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

const updateAccountTaskById = async (id, state) => {
  try {
    const response = await PartnerServive.updateAccountTask(id, state);
    if (response.data?.is_success) {
      await getAccountRejectAll();
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

const onHandleMenuClicked = async (value) => {
  const { event_id, item_id } = value;
  switch (event_id) {
    case menu_items[0].id:
      // console.log("Move to Daft: ", item_id);
      await updateAccountTaskById(item_id, "Draft");
      break;
  }
};
onMounted(async () => {
  await getAccountRejectAll();
});

const handlePaginationEvent = (page) => {
  filter.value.page = page;
  filter.value.offset = paginationUtils.pageOffset(page, filter.value.limit);
  getAccountRejectAll();
};

const getAccountRejectAll = async (sortBy = "created_at:desc") => {
  setLoading();
  try {
    const response = await AccountService.getAccountRejectAll(
      "Reject",
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
  await getAccountRejectAll(sortBy);
};

// const onHandleItemClick = (item) => {
//   switch (item.account_task_action) {
//     case "New Register":
//       router.push({ name: "AccountDetail", params: { id: item.id } });
//       break;
//     case "Extend Role":
//       router.push({
//         name: "AccountExtendRole",
//         query: { id: item.id, form_number: item.form_number },
//       });
//       break;
//     case "Extend Company":
//       router.push({
//         name: "AccountExtendCompany",
//         query: { id: item.id, form_number: item.form_number },
//       });
//       break;
//   }
// };

// const onHandleClickSearch= () => {
//   console.log(JSON.stringify(filter.value))
// }

const onHandleSelection = (value) => {
  amountItemSelect.value = value.length;
  // console.log("onHandleSelection: ", JSON.stringify(value));
};
</script>

<style>
.full-page {
  width: 100%;
}
</style>
