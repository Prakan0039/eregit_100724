<template>
  <!-- <h1>{{i.name_th}}</h1> -->
  <!-- {{ businessPartnerDetail.bp_number }} -->
  <div>
    <v-card class="mx-auto elevation-1" color="secondary" height="50" style="background-color: #ED1C24 !important; border-radius: 10px;">
      <v-card-item dense>
        <v-row no-gutters dense justify="space-around">
          <!-- <v-col cols="1">
            <v-checkbox hide-details class="pa-0 mt-n3"></v-checkbox>
          </v-col> -->
          <v-col cols="2" align-self="center" class="mt-1">
            <strong>Created date</strong>
          </v-col>
          <v-col cols="2" align-self="center" class="mt-1">
            <strong>Tax ID</strong>
          </v-col>
          <v-col cols="2" align-self="center" class="mt-1">
            <strong>Role</strong>
          </v-col>
          <v-col cols="2" align-self="center" class="mt-1">
            <strong>Name</strong>
          </v-col>
          <v-col cols="2" align-self="center" class="mt-1">
            <strong>Contact owner</strong>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
    <!-- {{i.name_th}} -->
    <!-- {{ items }} -->
    <v-expansion-panels v-model="panel" class="mt-1">
      <v-progress-linear
        class="rounded-pill"
        :indeterminate="loading"
        bg-color="transparent"
        color="secondary"
      ></v-progress-linear>
      <v-expansion-panel
        v-for="(i, index) in items"
        :key="index"
        class="mt-3"
        style="border-radius: 10px !important;"
        :style="index === panel ? 'border: 2px solid red;' : ''"
      >
        <v-expansion-panel-title :color="index === panel ? '#FFF1F0' : ''">
          <template v-slot:actions="{ expanded }">
            <v-icon
              color="secondary"
              :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            ></v-icon>
          </template>

          <v-row no-gutters dense justify="space-around">
            <!-- <v-col cols="1">
              <v-checkbox hide-details hide-spin-buttons class="pa-0 ma-0"></v-checkbox>
            </v-col> -->
            <v-col cols="2" align-self="center">
              <!-- <strong> {{ i.created_at }}</strong> -->
              <strong> {{ dateUtils.parseDdMmYy(i.created_at) }}</strong>
            </v-col>
            <v-col cols="2" align-self="center">
              <strong>{{ i.taxpayer_id_number }}</strong>
            </v-col>
            <v-col cols="2" align-self="center">
              <strong>{{ i.business_partner_role }}</strong>
            </v-col>
            <v-col cols="2" align-self="center">
              <strong>{{ i.name_th }}</strong>
            </v-col>

            <v-col cols="2" align-self="center">
              <v-chip color="secondary" label size="small">
                <strong>{{ i.contact_owner?.email }}</strong>
              </v-chip>
              <br />
              <div class="mt-2">
                <strong>{{ i.contact_owner?.business_unit }}</strong>
                &nbsp;/&nbsp;<span class="text-grey">{{
                  i.contact_owner?.team
                }}</span>
                &nbsp;/&nbsp;<span class="text-grey">{{
                  i.contact_owner?.company
                }}</span>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text style="background-color: #fff1f0">
          <v-card class="ml-n3 mr-n3" elevation="0" rounded="0">
            <v-card-item class="ma-2">
              <v-row justify="space-around" dense="">
                <v-col cols="8">
                  <v-row dense>
                    <v-col cols="12">
                      <div class="text-h6 text-secondary font-weight-black">
                        Company Info.
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Business Partner Number</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.business_partner_number
                      }}</span>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >FPT Affillate</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.is_fpt_affiliate === 1
                          ? "Yes"
                          : "No"
                      }}</span>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Organization Type</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.business_register_type
                      }}</span>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Juristic Type</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.account_business_partner_type
                      }}</span>
                    </v-col>

                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Company Category</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.company_category
                      }}</span>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Product/ Service Category</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.product_category
                      }}</span>
                    </v-col>

                    <v-col cols="12">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Vendor Number</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information?.vendor_number
                      }}</span>
                    </v-col>

                    <v-col cols="12">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Company Code of Vendor</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.company_code_of_vendor || '-'
                      }}</span>
                    </v-col>
                    <v-col cols="12">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Customer Number</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.customer_number || '-'
                      }}</span>
                    </v-col>

                    <v-col cols="12">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Company Code of Customer</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.company_information
                          ?.company_code_of_customer || '-'
                      }}</span>
                    </v-col>

                  </v-row>
                  <v-divider class="mt-5 mb-5"></v-divider>

                  <v-row dense>
                    <v-col cols="12">
                      <div class="text-h6 text-secondary font-weight-black">
                        Payment Info.
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >VAT Registered</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.payment_information
                          ?.is_vat_registered === 1
                          ? "Yes"
                          : "No"
                      }}</span>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Account Name</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.payment_information
                          ?.bank_account_name
                      }}</span>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Bank</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.payment_information?.bank
                      }}</span>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Account Number</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.payment_information
                          ?.bank_account_number
                      }}</span>
                    </v-col>
                  </v-row>
                  <v-divider class="mt-5 mb-5"></v-divider>

                  <v-row dense class="mt-5">
                    <v-col cols="12">
                      <div class="text-h6 text-secondary font-weight-black">
                        Branch Info.
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="4">
                          <v-select
                            v-model="business_branch"
                            density="compact"
                            variant="outlined"
                            placeholder="Roles"
                            :items="businessPartnerDetail.branch_list"
                            item-value="branch_code"
                            item-title="branch_code"
                          >
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="3">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Business Partner Role</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.branch?.business_partner_role
                      }}</span>
                    </v-col>
                    <v-col cols="9">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Branch Code
                      </label>
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.branch?.branch_code
                      }}</span>
                    </v-col>

                    <v-col cols="12">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Branch Address</label
                      >
                      <br />
                      <span class="font-weight-black">{{
                        businessPartnerDetail.branch?.branch_address
                      }}</span>
                    </v-col>
                    <v-col cols="12">
                      <label class="font-weight-medium text-grey-lighten-1"
                        >Contact Person</label
                      >
                      <br />
                      <v-row
                        v-for="(item, index) in businessPartnerDetail.branch
                          ?.contact_person"
                        :key="index"
                        dense
                      >
                        <v-col cols="4">
                          <span class="font-weight-black">
                            {{ item.name }}</span
                          >
                        </v-col>
                        <v-col cols="4">
                          <span class="font-weight-black">
                            {{ item.mobile }}</span
                          >
                        </v-col>
                        <v-col cols="4">
                          <span class="font-weight-black">
                            {{ item.email }}</span
                          >
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider vertical></v-divider>

              </v-row>
            </v-card-item>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
import { ref, onMounted, watch, computed } from "vue";
import { defineProps } from "vue";
import dateUtils from "@/utils/dateUtils";
import PartnerServive from "@/apis/PartnerServive";
// import RspService from '@/apis/RspService';
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();

const emit = defineEmits(["action-edit", "selected"]);

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 400,
  },
  selected: {
    type: Array,
    default: () => [],
  },
});
const Selected = computed({
  get() {
    return props.selected ?? [];
  },
  set(value) {
    emit("selected", value);
  },
});
const panel = ref([]);
const selected_all = ref(false);
const businessPartnerDetail = ref({});
// const survey_result_details = ref({});
const business_branch = ref(null);

const loader = ref({
  bp_detail: false,
  branch_code: false,
  survey_result: false,
});

watch(selected_all, (newValue) => {
  if (newValue) {
    const bp_numbers = Array.from(props.items, (i) => i.bp_number);
    Selected.value = [...bp_numbers];
  } else {
    Selected.value = [];
  }
});

watch(panel, (i) => {
  if (i != undefined) {
    const bp_number = props.items[i].bp_number;
    getBusinessPartnerDetail(bp_number);
    // console.log("cccc", bp_number);
    // getRspSurveyResultDetail(bp_number);
  }
});

watch(business_branch, (branch_code) => {
  if (branch_code) {
    const bp_number = props.items[panel.value].bp_number;
    getBusinessPartnerDetailฺBranchCode(bp_number, branch_code);
  }
});

const getBusinessPartnerDetail = async (bp_number) => {
  try {
    loader.value.bp_detail = true;
    const response = await PartnerServive.getBusinessPartnerDetail(bp_number);
    if (response.data?.is_success) {
      businessPartnerDetail.value = response.data?.data;
      business_branch.value = businessPartnerDetail.value?.branch?.branch_code;

      // console.log('businessPartnerDetail',businessPartnerDetail);
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loader.value.bp_detail = false;
  }
};
// eslint-disable-next-line no-unused-vars
const getBusinessPartnerDetailฺBranchCode = async (bp_number, branch_code) => {
  try {
    loader.value.branch_code = true;
    const response = await PartnerServive.getBusinessPartnerDetailBranchCode(
      bp_number,
      branch_code
    );
    if (response.data?.is_success) {
      businessPartnerDetail.value = response.data?.data;
      // console.log("wfedfsd", businessPartnerDetail.value);
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loader.value.branch_code = false;
  }
};
// eslint-disable-next-line no-unused-vars
const handleEditEvent = (item) => {
  emit("action-edit", item);
};
</script>
