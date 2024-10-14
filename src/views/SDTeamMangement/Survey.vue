<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid>
    <h2>Mangement > Survey</h2>
    <div class="mt-5">
      <v-row>
        <v-col cols="10" align-self="center">
          <h3>Activate Survey</h3>
        </v-col>
        <v-col cols="2">
          <v-btn
            class="me-2 text-none"
            color="secondary"
            prepend-icon="mdi-plus"
            variant="flat"
            height="40"
            rounded
            to="/SDTeamMangement/Survey/Created"
            block
          >
            Create new
          </v-btn>
        </v-col>
      </v-row>
      <v-skeleton-loader
        v-if="actived_laoding"
        type="list-item-two-line"
        color="transparent"
      />
      <ItemRspSurvey
        v-else
        v-for="(item, index) in actived_items"
        :key="index"
        class="mt-3"
        :item="item"
        :action-visible="false"
        :actionId="0"
      />
      <v-divider class="mt-3 mb-3"></v-divider>
      <div>
        <v-tabs v-model="menus_index" color="secondary">
          <v-tab
            v-for="(tabs, index) in menus"
            :key="index"
            class="text-capitalize"
          >
            <h3>{{ tabs.title }}</h3>
          </v-tab>
        </v-tabs>
        <v-tabs-items>
          <v-tab-item>
            <v-skeleton-loader
              v-if="actived_laoding"
              type="list-item-two-line"
              color="transparent"
            />
            <ItemRspSurvey
              v-else
              v-for="(item, index) in list_item"
              :key="index"
              class="mt-3"
              :item="item"
              :action-visible="true"
              :actionId="menus_index"
              @action-menus="actionMenus"
            />
            <PaginationControl
              v-if="list_filter.pageSize > 1"
              class="mt-3"
              :value="list_filter.page"
              :length="list_filter.pageSize"
              @value="handlePaginationInfoMenusEvent"
            />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </v-container>
</template>
<script setup>
/*eslint-disable no-unused-vars  */
import { ref, onBeforeMount, watch } from "vue";
import ItemRspSurvey from "@/components/items/ItemRspSurvey.vue";
import PaginationControl from "@/components/controls/PaginationControl";
import RspService from "@/apis/RspService";
import paginationUtils from "@/utils/paginationUtils";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();

import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
const { showDialog } = useConfirmationDialog();

const menus_index = ref(0);
const menus = ref([]);

const actived_laoding = ref(false);
const actived_items = ref([]);

const list_laoding = ref(false);
const list_item = ref([]);
const list_filter = ref({
  state: "inactive",
  offset: 0,
  limit: 10,
  page: 1,
  pageSize: 1,
});

watch(menus_index, (newValue) => {
  list_filter.value.state = menus.value[newValue].state;
  list_filter.value.offset = 0;
  list_filter.value.limit = 10;
  list_filter.value.page = 1;
  list_filter.value.pageSize = 1;
  getRspSurveyPagination();
});
onBeforeMount(() => {
  menus.value = [
    {
      title: "Deactivede Survey",
      icon: "mdi-account-outline",
      state: "inactive",
    },
    { title: "Draft", icon: "mdi-link-variant", state: "draft" },
    { title: "Recently Delete", icon: "mdi-link-variant", state: "deleted" },
  ];
  //list_item.value = mockdata.value.data;
  getRspSurveyStateActived();
  getRspSurveyPagination();
});
const handlePaginationInfoMenusEvent = (page) => {
  list_filter.value.page = page;
  list_filter.value.offset = paginationUtils.pageOffset(
    page,
    list_filter.value.limit
  );
  getRspSurveyPagination();
};
const getRspSurveyStateActived = async () => {
  try {
    actived_laoding.value = true;
    const response = await RspService.getRspSurveysActive();
    if (response.data?.is_success) {
      actived_items.value = response.data?.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    actived_laoding.value = false;
  }
};
const getRspSurveyPagination = async () => {
  try {
    list_laoding.value = true;
    list_item.value = [];
    const response = await RspService.getRspSurveys(
      list_filter.value.state,
      list_filter.value.offset,
      list_filter.value.limit
    );
    const headers = response.headers;
    const itemsOffset = Number(headers["items-offset"]);
    const itemsLimit = Number(headers["items-limit"]);
    const itemsTotal = Number(headers["items-total"]);

    list_filter.value.offset = itemsOffset;
    list_filter.value.limit = itemsLimit;
    list_filter.value.pageSize = paginationUtils.pageSize(
      itemsLimit,
      itemsTotal
    );

    if (response.data?.is_success) {
      list_item.value = response.data?.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    list_laoding.value = false;
  }
};

const actionMenus = (surveyId, action) => {
  switch (action) {
    case "DELETE":
      handleDelete(surveyId);
      break;
    case "PERMANENTLY_DELETE":
      handlePremanentlyDelete(surveyId);
      break;
    case "DEACTIVATED_SURVEY":
      handleUndeleteSurvey(surveyId);
      break;
  }
};

const handleDelete = async (rspSurveyId) => {
  //e.preventDefault()
  const confirmed = await showDialog(
    "ยืนยันลบ Survey",
    'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ'
  );
  if (confirmed) {
    try {
      const response = await RspService.DeleteRspSurvey(rspSurveyId);
      if (response.data.is_success) {
        await getRspSurveyStateActived();
        await getRspSurveyPagination();
      }
    } catch (e) {
      if (e.response) {
        const val = e.response.data;
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
  } else {
    console.log("Action cancelled.");
  }
};

const handlePremanentlyDelete = async (rspSurveyId) => {
  //e.preventDefault()
  const confirmed = await showDialog(
    "ยืนยัน Premanently Survey",
    'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ'
  );
  if (confirmed) {
    try {
      const response = await RspService.PermanentlyDeleteRspSurvey(rspSurveyId);
      if (response.data.is_success) {
        await getRspSurveyStateActived();
        await getRspSurveyPagination();
      }
    } catch (e) {
      if (e.response) {
        const val = e.response.data;
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
  } else {
    console.log("Action cancelled.");
  }
};
const handleUndeleteSurvey = async (rspSurveyId) => {
  //e.preventDefault()
  const confirmed = await showDialog(
    "ยืนยัน Undelete",
    'กรุณาตรวจสอบคลิกปุ่ม "ตกลง" เพื่อดำเนินการ'
  );
  if (confirmed) {
    try {
      const response = await RspService.UndeleteRspSurvey(rspSurveyId);
      if (response.data.is_success) {
        await getRspSurveyStateActived();
        await getRspSurveyPagination();
      }
    } catch (e) {
      if (e.response) {
        const val = e.response.data;
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
  } else {
    console.log("Action cancelled.");
  }
};
</script>
