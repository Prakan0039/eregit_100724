<template>
  <v-container fluid>
    <h2>Business Partner List</h2>
    <div class="mt-5">
      <v-row dense class="mt-5 mb-5">
        <v-col cols="12" md="10">
          <v-row no-gutters dense>
            <v-col cols="12" md="3">
              <div class="box-filter">
                <v-select
                v-model="filter.search_key"
                density="compact"
                class="rounded-s-lg"
                variant="solo"
                :items="selected_items.topics"
                item-title="name"
                item-value="id"
              />
              </div>
            </v-col>
            <v-col cols="12"  md="9">
              <v-row no-gutters>
                <v-divider vertical></v-divider>
                <div class="box-input">
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
                  style="background-color: #EDEDED;"
                  height="40"
                  rounded="0"
                  class="rounded-e"
                  @click="getSearchBusinessPartner"
                >
                  <v-icon size="25">mdi-magnify</v-icon>
                </v-btn>
                </div>

              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="2">
          <FilterBusinessPratner
            :companies_id="filter.companies_id"
            :role_id="filter.role_id"
            :bu_owners_id="filter.bu_owners_id"
            :affiliate_id="filter.affiliate_id"
            :partner_type_id="filter.partner_type_id"
            :comp_categories_id="filter.comp_categories_id"
            :date_from="filter.date_from"
            :date_to="filter.date_to"
            @companies_id="filter.companies_id = $event"
            @role_id="filter.role_id = $event"
            @bu_owners_id="filter.bu_owners_id = $event"
            @affiliate_id="filter.affiliate_id = $event"
            @partner_type_id="filter.partner_type_id = $event"
            @comp_categories_id="filter.comp_categories_id = $event"
            @date_from="filter.date_from = $event"
            @date_to="filter.date_to = $event"
          />
        </v-col>
      </v-row>

      <v-row justify="end" class="mt-2 mb-2" dense>
        <v-col cols="auto">
          <v-btn
            to="/BusinessPartner/SearchBusinessPartner"
            block
            class="text-capitalize rounded-pill"
            color="#ED1C24"
          >
            <v-icon left>mdi-plus-box-outline</v-icon>
            <span style="padding-top: 4px; padding-left: 5px;">Create form</span>
          </v-btn>
        </v-col>
      </v-row>
      <BusinessPartnerTable
        class="mt-5"
        :items="content.items"
        :loading="loading.items"
        :selected="selected_checked[`${filter.page - 1}`]"
        @selected="selected_checked[`${filter.page - 1}`] = $event"
      />

      <PaginationControl
        class="mt-3"
        :value="filter.page"
        :length="filter.pageSize"
        @value="handlePaginationEvent"
      />
    </div>
  </v-container>
</template>
<script setup>
/*eslint-disable no-unused-vars  */
import { ref, onBeforeMount, onMounted, computed } from "vue";
import BusinessPartnerTable from "@/components/tables/businesspartner/BusinessPartnerTable.vue";
import FilterBusinessPratner from "@/components/dialogs/FilterBusinessPratner.vue";
import PaginationControl from "@/components/controls/PaginationControl";

import paginationUtils from "@/utils/paginationUtils";
import { useRouter } from "vue-router";
import RspService from "@/apis/RspService";
import PartnerService from "@/apis/PartnerServive";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();

const fav = ref(true);
const menu = ref(false);
const message = ref(false);
const hints = ref(true);

const selected_checked = ref([]);
const selected_items = ref({
  topics: [
    {
      id: "business_partner_name",
      name: "Business Partner Name",
    },
    {
      id: "company_name",
      name: "Company Name",
    },
    {
      id: "vender_number",
      name: "Vendor Number",
    },
    {
      id: "customer_number",
      name: "Customer Number",
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
  partner_type: [],
  affiliate: [],
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
  role_id: null,
  bu_owners_id: null,
  affiliate_id: null,
  partner_type_id: null,
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
  items: [],
});

onMounted(() => {
  getSearchBusinessPartner();
});

const getSearchBusinessPartner = async () => {
  try {
    loading.value.items = true;
    content.value.items = [];
    const response = await PartnerService.getSearchBusinessPartner(
      filter.value.offset,
      filter.value.limit,
      filter.value.search_key,
      filter.value.search_value,
      filter.value.companies_id,
      filter.value.role_id,
      filter.value.bu_owners_id,
      filter.value.affiliate_id,
      filter.value.partner_type_id,
      filter.value.date_from,
      filter.value.date_to,
      filter.value.comp_categories_id
    );
    // console.log("ddd", filter.value )
    const headers = response.headers;
    const itemsOffset = Number(headers["items-offset"]);
    const itemsLimit = Number(headers["items-limit"]);
    const itemsTotal = Number(headers["items-total"]);

    filter.value.offset = itemsOffset;
    filter.value.limit = itemsLimit;
    // console.log(itemsLimit);
    filter.value.pageSize = paginationUtils.pageSize(itemsLimit, itemsTotal);
    if (response.data?.is_success) {
      content.value.items = [];

      content.value.items = response.data.data?.business_partners;

      // response.data?.data.forEach((dataItem) => {
      // response.data.data?.business_partners ??
      //   [].forEach((partner) => {
      //     content.value.items.push(partner);
      //   });
      // });
      // content.value.items = response.data?.data.map((item) => {
      //   return {
      //     ...item.business_partners
      //   }
      // });
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      // handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    // handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.items = false;
  }
};

const handlePaginationEvent = (page) => {
  filter.value.page = page;
  filter.value.offset = paginationUtils.pageOffset(page, filter.value.limit);
  getSearchBusinessPartner();
};
</script>


<style scoped>
 .box-filter :deep(.v-text-field .v-field) {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
}

.box-input{
  display: flex;
  width:100%;
}

.box-input :deep(.v-text-field .v-field) {
  border-radius: 0px;
}

.box-input button {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}


</style>
