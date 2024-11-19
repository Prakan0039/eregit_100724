<template>
  <v-container fluid>
    <h2>Admin DashBoard</h2>
    <div class="mt-5">
      <v-row dense>
        <v-col cols="3">
          <RegisteredVendorsItem
            :loading="loading.registered"
            :value="content.registered_vendors?.value"
          />
        </v-col>
        <v-col cols="3">
          <RspPolicyItem
            :loading="loading.report"
            :value="content.rsp_policy_vendors?.value"
            :percent="content.rsp_policy_vendors?.percent"
          />
        </v-col>
        <v-col cols="3">
          <SurveyAlignItem
            :loading="loading.report"
            :survey_value="content.survey_align_vendors?.survey_value"
            :survey_percent="content.survey_align_vendors?.survey_percent"
            :align_value="content.survey_align_vendors?.align_value"
            :align_percent="content.survey_align_vendors?.align_percent"
          />
        </v-col>
        <v-col cols="3">
          <TrainingItem
            :loading="loading.report"
            :value="content.training_vendors?.value"
            :percent="content.training_vendors?.percent"
          />
        </v-col>
      </v-row>
      <v-row dense class="mt-5 mb-5">
        <v-col cols="10">
          <v-row no-gutters>
            <v-col cols="3">
              <v-select
                v-model="filter.search_key"
                density="compact"
                class="rounded-s-lg"
                variant="solo"
                :items="selected_items.topics"
                item-title="name"
                item-value="id"
              />
            </v-col>
            <v-col cols="9">
              <v-row no-gutters>
                <v-divider vertical></v-divider>
                <v-text-field
                  v-model="filter.search_value"
                  density="compact"
                  variant="solo"
                  class="rounded-e-lg"
                  placeholder="ค้นหา  Business Partner Name หรือ Company Name"
                  single-line
                  hide-details
                ></v-text-field>
                <v-btn
                  color="grey-lighten-2"
                  height="40"
                  rounded="0"
                  class="rounded-e"
                  @click="getVendorRspStatus"
                >
                  <v-icon size="25">mdi-magnify</v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <FilterTrackingSDActivite
            :companies_id="filter.companies_id"
            :bu_owners_id="filter.bu_owners_id"
            :activities_id="filter.activities_id"
            :status="filter.status"
            :comp_categories_id="filter.comp_categories_id"
            :date_from="filter.date_from"
            :date_to="filter.date_to"
            @companies_id="filter.companies_id = $event"
            @bu_owners_id="filter.bu_owners_id = $event"
            @activities_id="filter.activities_id = $event"
            @status="filter.status = $event"
            @comp_categories_id="filter.comp_categories_id = $event"
            @date_from="filter.date_from = $event"
            @date_to="filter.date_to = $event"
          />
        </v-col>
      </v-row>
      <!-- <v-row justify="end" dense>
        <v-col cols="2">
          <v-btn
            variant="outlined"
            :disabled="SelectedDisabled"
            @click="handleFollowUp"
            block
            class="text-capitalize"
            color="black"
          >
            <v-icon left>mdi-email</v-icon>
            Follow up ({{ SelectedCount }})
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn
            :disabled="SelectedDisabled"
            block
            class="text-capitalize"
            color="black"
            @click="handleExport"
          >
            <v-icon left>mdi-microsoft-excel</v-icon>
            Export ({{ SelectedCount }})
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn
            to="/ShareMultiVandor"
            block
            class="text-capitalize"
            color="black"
          >
            <v-icon left>mdi-microsoft-excel</v-icon>
            import BP file
          </v-btn>
        </v-col>
      </v-row> -->
      <!-- {{selected_checked[0-1]}} -->
      <!-- {{selected_checked}} -->
       
      <div class="or-divider">
        <span class="or-text">Vendor in my responsibility</span>
        <v-divider></v-divider>
      </div>
      <TrackingSDActiviteTable
        class="mt-5"
        :items="content.items"
        :loading="loading.items"
        :selected="selected_checked[`${filter.page - 1}`]"
        @selected="selected_checked[`${filter.page - 1}`] = $event"
        @sort-change="handleSortChange"
      />
      <PaginationControl
        class="mt-3"
        :value="filter.page"
        :length="filter.pageSize"
        @value="handlePaginationEvent"
      />
      <!-- {{ filter }} -->
    </div>
  </v-container>
</template>
<script setup>
/*eslint-disable no-unused-vars  */
// downloadFile
import { ref, onMounted, computed } from "vue";
import exportService from "@/apis/ExportService";
import RegisteredVendorsItem from "@/components/items/RegisteredVendorsItem.vue";
import RspPolicyItem from "@/components/items/RspPolicyItem.vue";
import SurveyAlignItem from "@/components/items/SurveyAlignItem.vue";
import TrainingItem from "@/components/items/TrainingItem.vue";
import TrackingSDActiviteTable from "@/components/tables/AdminDashBoardTable.vue";
import FilterTrackingSDActivite from "@/components/dialogs/FilterTrackingSDActivite.vue";
import PaginationControl from "@/components/controls/PaginationControl.vue";
import RspService from "@/apis/RspService";
import paginationUtils from "@/utils/paginationUtils";
import { useRouter } from "vue-router";

import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
const router = useRouter();
const selected_checked = ref([]);
const selected_items = ref({
  topics: [
    {
      id: "business_partner_name",
      name: "Business Partner Name",
    },
    {
      id: "vender_number",
      name: "vendor Number",
    },
    {
      id: "tax_id",
      name: "Tax ID",
    },
    {
      id: "contact_owner_email",
      name: "Contact Owner",
    },
    {
      id: "team_owner_name",
      name: "Team Owner",
    },
  ],
  companies: [],
  bu_owners: [],
  activities: [],
  status: [
    {
      id: 0,
      name: "Inactive",
    },
    {
      id: 1,
      name: "Active",
    },
  ],
  companies_cate: [],
});

const filter = ref({
  search_key: "business_partner_name",
  search_value: null,
  companies_id: null,
  bu_owners_id: null,
  activities_id: null,
  status: null,
  comp_categories_id: null,
  date_from: null,
  date_to: null,
  offset: 0,
  limit: 20,
  page: 1,
  pageSize: 1,
});
const loading = ref({
  registered: false,
  report: false,
  items: false,
});

const content = ref({
  registered_vendors: {
    value: 0,
  },
  rsp_policy_vendors: {
    value: 0,
    percent: 0,
  },
  survey_align_vendors: {
    survey_value: 0,
    survey_percent: 0,
    align_value: 0,
    align_percent: 0,
  },
  training_vendors: {
    value: 0,
    percent: 0,
  },
  items: [],
});

const SelectedDisabled = computed({
  get() {
    const checkedCount = selected_checked.value.flat();
    return checkedCount.length === 0;
  },
});
const SelectedCount = computed({
  get() {
    const checkedCount = selected_checked.value.flat();
    return checkedCount.length;
  },
});

onMounted(() => {
  sessionStorage.setItem("bp_numbers", JSON.stringify([]));
  getRegisteredVendorAmount();
  getRspReportData();
  getVendorRspStatus();
});
const handleFollowUp = () => {
  const bp_numbers = selected_checked.value.flat();
  const jsonArray = JSON.stringify(bp_numbers);
  sessionStorage.setItem("bp_numbers", jsonArray);
  router.push("/SDTeamDashboard/FollowUp");
};
const handleExport = () => {
  const bp_numbers = selected_checked.value.flat();
  exportRspActivityReport(bp_numbers);
};
const getRegisteredVendorAmount = async () => {
  try {
    loading.value.registered = true;
    const response = await RspService.getRegisteredVendorAmount();
    if (response) {
      content.value.registered_vendors.value =
        response.data?.data?.registered_vendor_amount;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.registered = false;
  }
};

const getRspReportData = async () => {
  try {
    loading.value.report = true;
    const response = await RspService.getRspReportData();

    if (response) {
      // policy
      content.value.rsp_policy_vendors.value =
        response.data.data.policy.completed_amount;
      content.value.rsp_policy_vendors.percent =
        response.data.data.policy.completed_percentage;

      // survey
      content.value.survey_align_vendors.align_value =
        response.data.data.survey.aligned_amount;
      content.value.survey_align_vendors.align_percent =
        response.data.data.survey.aligned_percentage;

      content.value.survey_align_vendors.survey_value =
        response.data.data.survey.completed_amount;
      content.value.survey_align_vendors.survey_percent =
        response.data.data.survey.completed_percentage;

      // training
      content.value.training_vendors.value =
        response.data.data.training.completed_amount;
      content.value.training_vendors.percent =
        response.data.data.training.completed_percentage;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.report = false;
  }
};

const getVendorRspStatus = async () => {
  try {
    loading.value.items = true;
    content.value.items = [];
    const response = await RspService.getVendorRspStatus(
      filter.value.offset,
      filter.value.limit,
      filter.value.search_key,
      filter.value.search_value,
      filter.value.companies_id,
      filter.value.bu_owners_id,
      filter.value.comp_categories_id,
      filter.value.activities_id,
      filter.value.status,
      filter.value.date_from,
      filter.value.date_to,
      "bp_number:desc"
    );
    const headers = response.headers;
    const itemsOffset = Number(headers["items-offset"]);
    const itemsLimit = Number(headers["items-limit"]);
    const itemsTotal = Number(headers["items-total"]);

    console.log("itemsOffset ", itemsOffset);
    console.log("itemsLimit ", itemsLimit);
    console.log("itemsTotal ", itemsTotal);

    filter.value.offset = itemsOffset ? itemsOffset : 0;
    filter.value.limit = itemsLimit ? itemsLimit : 10;
    filter.value.pageSize = paginationUtils.pageSize(itemsLimit, itemsTotal);

    if (response.data?.is_success && !response.data?.data?.error) {
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
    loading.value.items = false;
  }
};

const handleSortChange = async (sort) => {
  try {
    loading.value.items = true;
    content.value.items = [];
    filter.value.offset = 0;
    filter.value.page = 1;
    const response = await RspService.getVendorRspStatus(
      filter.value.offset,
      filter.value.limit,
      filter.value.search_key,
      filter.value.search_value,
      filter.value.companies_id,
      filter.value.bu_owners_id,
      filter.value.comp_categories_id,
      filter.value.activities_id,
      filter.value.status,
      filter.value.date_from,
      filter.value.date_to,
      sort
    );
    const headers = response.headers;
    const itemsOffset = Number(headers["items-offset"]);
    const itemsLimit = Number(headers["items-limit"]);
    const itemsTotal = Number(headers["items-total"]);

    console.log("itemsOffset ", itemsOffset);
    console.log("itemsLimit ", itemsLimit);
    console.log("itemsTotal ", itemsTotal);

    filter.value.offset = itemsOffset ? itemsOffset : 0;
    filter.value.limit = itemsLimit ? itemsLimit : 10;
    filter.value.pageSize = paginationUtils.pageSize(itemsLimit, itemsTotal);

    if (response.data?.is_success && !response.data?.data?.error) {
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
    loading.value.items = false;
  }
};

const exportRspActivityReport = async (bp_numbers) => {
  try {
    const response = await RspService.exportRspActivityReport(bp_numbers);
    const file_url = response.data?.data?.file_url;
    // await exportService.exportBase64(`RspActivityReport`, "PDF", file_url);
    await exportService.downloadFileV2(file_url);
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};
const handlePaginationEvent = (page) => {
  filter.value.page = page;
  filter.value.offset = paginationUtils.pageOffset(page, filter.value.limit);
  getVendorRspStatus();
};
</script>
<style scoped>
.custom-underline {
  text-decoration: underline;
  color: black;
}

.v-field {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 0px 6px 0px !important;
}

.or-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px; /* ระยะห่างระหว่างข้อความและเส้นแบ่ง */
  margin: 20px 0;
}

.or-text {
  font-weight: bold;
  color: gray;
  white-space: nowrap; /* ทำให้ข้อความไม่ห่อในหลายบรรทัด */
}

.divider-line {
  flex-grow: 1; /* ขยาย divider ให้ครอบคลุมความกว้างที่เหลือ */
  height: 1px; /* กำหนดความสูงของเส้นแบ่ง */
  background-color: gray; /* เปลี่ยนสีตามต้องการ */
}
</style>