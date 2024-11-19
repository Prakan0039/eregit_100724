<template>

  <v-container fluid class="mt-8">
    <div class="box-froms">
      <div class="custom-app-bar" v-if="itemsFileDocument.length > 0">
        <AttachedMenat
          :items="itemsFileDocument"
          :downloadall="
            register_form_detail.uploaded_document?.document_path ?? null
          "
          :downloaddisclosure="disclosureDocument"
          class="mb-9"
          @on-disclosure-file="handleDownloadDisclosur"
          @on-attach-file="handleAttchFiles"
        />
      </div>
      <!-- {{ input_data.stepper_info_form?.step_one?.main_data
        ?.bp_type_selection }} -->
      <!-- {{input_data.register_info_form  }} -->

      <div v-if="is_id_form === FORM_ID.REQUEST_DOCS">
        <RequestDocument
          @on-back="handleReqDocumentBack"
          @on-commit-data="handleReqDocumentCommit"
        />
      </div>
      <!-- {{ !customer_or_vender }} -->
      <div
        class="d-flex justify-end mb-5 mt-5"
        v-if="is_id_form !== FORM_ID.REQUEST_DOCS"
      >
        <!-- <ButtonControl
          icon="mdi mdi-file-document"
          class="mr-2"
          text="ขอเอกสารเพิ่มเติม"
          @button-clicked="handleMoreDocs"
        /> -->
        <!-- {{ input_data.stepper_info_form.step_two.address_en.name.gender }} -->

        <ButtonControl
          v-if="is_id_form === FORM_ID.STEPPER_INFO"
          style="
            box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
            height: 35px;
            border-radius: 10px;
          "
          icon="mdi mdi-bookmark"
          text="Save Draft"
          class="mt-5"
          @button-clicked="handleSaveDaft"
        />
      </div>
      <RegisterInfo
        v-if="is_id_form === FORM_ID.REGISTER_INFO"
        :register-form-detail="register_form_detail"
        @on-commit-data="handleRegisterCommit"
        @on-input="handleRegisterInput"
      />

      <SteperInfo
        :isItemDoc="itemsFileDocument.length > 0"
        v-if="is_id_form === FORM_ID.STEPPER_INFO"
        :register-form-detail="register_form_detail"
        :type-form="customer_or_vender"
        :register-info="temp_register_info_form"
        @on-data-commit="handleCustCommit"
        @on-input="handleSetpInput"
        @on-reverse-form="handleReverseForm"
      />
    </div>
  </v-container>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

import ButtonControl from "@/components/controls/ButtonControl.vue";
import AttachedMenat from "@/components/forms/accounts/AttachedMenat.vue";
import RegisterInfo from "@/components/forms/accounts/RegisterInfo.vue";
import SteperInfo from "../../components/forms/accounts/SteperInfo.vue";
import RequestDocument from "../../components/forms/accounts/RequestDocument.vue";

import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
const { showDialog } = useConfirmationDialog();

import { ref } from "vue";
import { useRoute } from "vue-router";
import AccountType from "@/utils/enum.util";
import { onMounted } from "vue";
import PartnerServive from "@/apis/PartnerServive";

const route = useRoute();
const id = route.params.id;

const FORM_ID = {
  REGISTER_INFO: 0,
  STEPPER_INFO: 1,
  REQUEST_DOCS: 2,
};

const is_id_form = ref(FORM_ID.REGISTER_INFO);
const customer_or_vender = ref(AccountType.AccountType.VENDER);
const itemsFileDocument = ref([]);
const disclosureDocument = ref(null);
const input_data = ref({
  register_info_form: {},
  stepper_info_form: {},
  attach_files: [],
});
const temp_register_info_form = ref({});
const register_form_detail = ref(null);
// const register_form_user_id = ref(null);
const item_file_document = ref([]);
const acc_id = ref(id);

const handleAttchFiles = (item_files) => {
  input_data.value.attach_files = item_files;
};

const handleDownloadDisclosur = () => {
  window.open(disclosureDocument.value.file_url, "_blank");
  // console.log("download_disclosur", disclosureDocument.value.file_url);
};

const handleReverseForm = () => {
  is_id_form.value = FORM_ID.REGISTER_INFO;
};

const handleRegisterInput = (register_info_data) => {
  input_data.value.register_info_form = register_info_data;
  customer_or_vender.value = register_info_data.type_register;
  // console.log(JSON.stringify(customer_or_vender.value.input_data.value.register_info_form));
};

const handleRegisterCommit = (register_info_data) => {
  input_data.value.register_info_form = register_info_data;
  customer_or_vender.value = register_info_data.type_register;
  temp_register_info_form.value = register_info_data;
  is_id_form.value = FORM_ID.STEPPER_INFO;
  // console.log("input_data.value.register_info_form ", input_data.value.register_info_form )
};

const getUploadDocumentByFormNumber = async () => {
  try {
    const response = await PartnerServive.getUploadDocumentByFormNumber(id);
    if (response.data?.is_success) {
      const promises = response.data.data.map(async (el) => {
        const size = 0;
        return {
          file: el.document_path,
          file_name: el.document_name,
          file_size: size,
        };
      });

      // รอให้ promises ทั้งหมดเสร็จสิ้นก่อนที่จะกำหนดค่าให้กับ itemsFileDocument.value
      itemsFileDocument.value = await Promise.all(promises);
      console.log("file", itemsFileDocument.value);
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      console.log(
        val.message ?? "Error",
        val?.data?.error ?? "some thing error"
      );
    }
    console.log("unknown", e.message);
  }

  try {
    const getDownloadDisclosure =
      await PartnerServive.getDownloadDisclosureByFormNumber(id);
    if (getDownloadDisclosure.data?.is_success) {
      itemsFileDocument.value.push({
        file: getDownloadDisclosure.data.data[0].file_url,
        file_name: "Disclosure.pdf",
        file_size: "135 kb.",
      });
      console.log(
        "getDownloadDisclosure",
        getDownloadDisclosure.data.data[0].file_url
      );
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      console.log(
        val.message ?? "Error",
        val?.data?.error ?? "some thing error"
      );
    }
    console.log("unknown", e.message);
  }
};
// const getBusinessPartnerRegisterFormById = async (id) => {
//   try {
//     const response = await PartnerServive.getBusinessPartnerRegisterFormById(
//       id
//     );
//     if (response.data?.is_success) {
//       await getRegisterFormDetailByFormNumber(response.data.data.form_number);
//     }
//   } catch (e) {
//     if (e.response) {
//       const val = e.response.data;
//       handlingErrorsMessage(val.message, val?.data.error);
//       return;
//     }
//     handlingErrorsMessage("unknown", e.message);
//   }
// };

const getRegisterFormDetailByFormNumber = async (form_number) => {
  try {
    const response = await PartnerServive.getRegisterFormDetail(form_number);
    if (response.data?.is_success) {
      register_form_detail.value = response.data?.data;
      // register_form_user_id.value = register_form_detail.value.business_partner_register_form.created_user_id
      item_file_document.value =
        register_form_detail.value.uploaded_document ??
        [].map((el) => {
          return {
            file: null,
            file_name: el.document_name,
            file_size: "15.2 MB",
          };
        });
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

const handleSetpInput = (stepper_data) => {
  input_data.value.stepper_info_form = stepper_data;
  console.log("step22", input_data.value.stepper_info_form);
};

const handleCustCommit = async (stepper_info_data) => {
  input_data.value.stepper_info_form = stepper_info_data;
  if (
    !(await showDialog(
      "ยืนยันการบันทึกข้อมูล ?",
      'งานของคุณจะถูกย้ายไปยัง Ready To Export\nคลิกปุ่ม "ตกลง" เพื่อดำเนินการ'
    ))
  )
    return;
  let name_th =
    `${input_data.value.stepper_info_form.step_two.address_th.name.one}${input_data.value.stepper_info_form.step_two.address_th.name.two}${input_data.value.stepper_info_form.step_two.address_th.name.three}${input_data.value.stepper_info_form.step_two.address_th.name.four}`;
  let name_en =
    `${input_data.value.stepper_info_form.step_two.address_en.name.one}${input_data.value.stepper_info_form.step_two.address_en.name.two}${input_data.value.stepper_info_form.step_two.address_en.name.three}${input_data.value.stepper_info_form.step_two.address_en.name.four}`;

  if (input_data.value.register_info_form.customer_type_data.data == 1) {
    name_th = `${input_data.value.stepper_info_form.step_two.address_th.name.gender?? ""}${input_data.value.stepper_info_form.step_two.address_th.name.one}${input_data.value.stepper_info_form.step_two.address_th.name.two}${input_data.value.stepper_info_form.step_two.address_th.name.three}${input_data.value.stepper_info_form.step_two.address_th.name.four}`;
    name_en = `${input_data.value.stepper_info_form.step_two.address_en.name.gender?? ""}${input_data.value.stepper_info_form.step_two.address_en.name.one}${input_data.value.stepper_info_form.step_two.address_en.name.two}${input_data.value.stepper_info_form.step_two.address_en.name.three}${input_data.value.stepper_info_form.step_two.address_en.name.four}`;
  }
  const requestSaveDaftBusinessPartnerRegis = {
    form_number:
      register_form_detail.value.business_partner_register_form?.form_number ??
      null,
    // updated_user_id:
    // Number(register_form_detail.value.business_partner_register_form?.created_user_id ?? null),
    business_partner_register_form: {
      taxpayer_id_number:
        input_data.value.stepper_info_form?.step_one?.main_data?.tax_number ??
        null,

      // taxpayer_id_number:
      //   input_data.value.register_info_form?.thai_people_id ?? null, // data.stepper_info_form.step_one?.main_data.tax_number
      created_user_id: Number(
        register_form_detail.value.business_partner_register_form
          ?.created_user_id ?? null
      ),
      //  input_data.value.stepper_info_form?.step_one?.other
      // ?.bank_branch ?? null,
      //   input_data.value.register_info_form?.customer_info?.th?.company_name, // data.register_info_form.customer_info.th.company_name
      // name_en:
      //   input_data.value.register_info_form?.customer_info?.en?.company_name, // data.register_info_form.customer_info.en.company_name
      name_th, // data.register_info_form.customer_info.th.company_name
      name_en, // data.register_info_form.customer_info.en.company_name
      form_status_id:
        register_form_detail.value.business_partner_register_form?.form_status
          ?.id, //number
      business_partner_role_id:
        input_data.value.register_info_form?.type_register, // data.register_info_form.type_register //number
      fill_type_id: input_data.value.register_info_form?.type_data, // data.register_info_form.type_data.data //number
      company_id: input_data.value.stepper_info_form?.step_one?.other
        .company_code
        ? input_data.value.stepper_info_form?.step_one?.other.company_code
            .map((comp) => comp.id)
            .join(",")
        : "",
      employee_type_id:
        register_form_detail.value.business_partner_register_form.employee_type
          .map((el) => el.id)
          .join(","), // unknow
      payment_term_id: Number(
        input_data.value.register_info_form?.term_data?.data
      ), // data.register_info_form.term_data.data
      registered_user_email: "user@example.com", // unknow
      // created_at: "2023-11-10T14:20:12", // auto fill
      // created_user_id: 1, // auto fill
      // updated_at: "2023-11-12T10:30:45", // auto fill
      // updated_user_id: 1, // auto fill
    },

    business_partner_profile_form: {
      business_partner_type_id:
        input_data.value.register_info_form?.customer_type_data?.data, // data.customer_type_data.data //number
      business_register_type_id:
        input_data.value.register_info_form?.type_register, //  data.type_register //number
      is_vat_registered:
        input_data.value.register_info_form?.tax_register?.type == "1"
          ? true
          : false, // data.tax_register.type //number
      is_head_office:
        input_data.value.register_info_form?.tax_register?.branch == "1"
          ? true
          : false, // data.tax_register.branch //number
      branch_code:
        input_data.value.register_info_form?.tax_register?.branch_code ?? null, // data.tax_register.branch_code //string
      company_category_id:
        input_data.value.register_info_form?.type_business?.data ?? null, // data.type_business.data //number
      product_category:
        input_data.value.register_info_form?.type_product_service ?? null, // data.type_product_service
      customer_category:
        input_data.value.register_info_form?.customer_type ?? null, // unknowฃ

      address_th: `${input_data.value.stepper_info_form.step_two.address_th.address.one}${input_data.value.stepper_info_form.step_two.address_th.address.two}`,

      ///step_info_th
      // province_th_id:
      //   input_data.value.register_info_form?.customer_info?.th?.info?.province, // data.customer_info.th.province //number
      // district_th_id:
      //   input_data.value.register_info_form?.customer_info?.th?.info?.district, // data.customer_info.th.district //number
      // subdistrict_th_id:
      //   input_data.value.register_info_form?.customer_info?.th?.info?.parish, // data.customer_info.th.parish //number
      // postal_code_th_id:
      //   input_data.value.register_info_form?.customer_info?.th?.info?.zip_code, // data.customer_info.th.zip_code //number

      ///step_2_th
      province_th_id:
        input_data.value.stepper_info_form.step_two.address_th.location
          .province ?? null,
      district_th_id:
        input_data.value.stepper_info_form.step_two.address_th.location
          .district,
      subdistrict_th_id:
        input_data.value.stepper_info_form.step_two.address_th.location.parish,
      postal_code_th_id:
        input_data.value.stepper_info_form.step_two.address_th.location
          .zip_code,

      address_en: `${input_data.value.stepper_info_form.step_two.address_en.address.one}${input_data.value.stepper_info_form.step_two.address_en.address.two}`,
      // input_data.value.register_info_form?.customer_info?.en?.address, // data.customer_info.en.address

      //step_info
      // province_en:
      //   input_data.value.register_info_form?.customer_info?.en?.info?.province, // data.customer_info.en.province
      // district_en:
      //   input_data.value.register_info_form?.customer_info?.en?.info?.district, // data.customer_info.en.district
      // subdistrict_en:
      //   input_data.value.register_info_form?.customer_info?.en?.info?.parish, // data.customer_info.en.parish
      // postal_code_en_id:
      //   input_data.value.register_info_form?.customer_info?.en?.info?.zip_code, // data.customer_info.en.zip_code

      //steptwo
      province_en:
        input_data.value.stepper_info_form.step_two.address_en.location
          .province,
      district_en:
        input_data.value.stepper_info_form.step_two.address_en.location
          .district,
      subdistrict_en:
        input_data.value.stepper_info_form.step_two.address_en.location.parish,
      postal_code_en_id:
        input_data.value.stepper_info_form.step_two.address_th.location
          .zip_code,

      contact_name_1:
        input_data.value.register_info_form?.items_contects[0]?.name ?? null, // data.items_contects[0]?.name
      contact_mobile_number_1:
        input_data.value.register_info_form?.items_contects[0]?.phone ?? null, // data.items_contects[0]?.phone
      contact_email_1:
        input_data.value.register_info_form?.items_contects[0]?.email ?? null, // data.items_contects[0]?.email
      contact_name_2:
        input_data.value.register_info_form?.items_contects[1]?.name ?? null, // data.items_contects[2]?.name
      contact_mobile_number_2:
        input_data.value.register_info_form?.items_contects[1]?.phone ?? null, // data.items_contects[2]?.phone
      contact_email_2:
        input_data.value.register_info_form?.items_contects[1]?.email ?? null, // data.items_contects[2]?.email
      contact_name_3:
        input_data.value.register_info_form?.items_contects[2]?.name ?? null, // data.items_contects[3]?.name
      contact_mobile_number_3:
        input_data.value.register_info_form?.items_contects[2]?.phone ?? null, // data.items_contects[3]?.phone
      contact_email_3:
        input_data.value.register_info_form?.items_contects[2]?.email ?? null, // data.items_contects[3]?.email
      bank_account_name:
        input_data.value.register_info_form?.bank_info?.acc_name_en ?? null, // data.bank_info.acc_name_en
      // bank_id: Number(
      //   input_data.value.register_info_form?.bank_info?.bank_name
      // ), // data.bank_info.bank_name //number
      bank_id:
        Number(input_data.value.stepper_info_form?.step_one?.other?.bank_key) ??
        null,
      // bank_branch:
      // input_data.value.register_info_form?.bank_info?.bank_branch ?? null, // data.bank_info.bank_branch
      bank_branch:
        input_data.value.stepper_info_form?.step_one?.other?.bank_branch ??
        null,
      bank_account_number:
        input_data.value.stepper_info_form?.step_one?.other?.bank_account ??
        null,
      // created_at: "2023-11-10T14:20:12", // auto fill
      // created_user_id: 1, // auto fill
      // updated_at: "2023-11-12T10:30:45", // auto fill
      // updated_user_id: 1, // auto fill
    },

    account_information_form: {
      //   //SETEP ONE
      business_partner_number:
        input_data.value.stepper_info_form?.step_one?.main_data
          ?.business_partner ?? null,

      vendor_number:
        input_data.value.stepper_info_form?.step_one?.main_data
          ?.vender_number ?? null, // data.stepper_info_form?.step_one?.main_data.vender_number
      customer_number: null, // unknow

      business_partner_group_id:
        input_data.value.stepper_info_form?.step_one?.main_data
          ?.business_partner_gruop_selection, // data.stepper_info_form?.step_one?.main_data.business_partner_gruop_selection //number

      business_partner_category:
        input_data.value.stepper_info_form?.step_one?.main_data
          ?.business_partner_catega ?? null, // data.stepper_info_form?.step_one?.main_data.business_partner_catega
      business_partner_role:
        input_data.value.stepper_info_form?.step_one?.main_data
          ?.business_partner_role ?? null, // data.stepper_info_form?.step_one?.main_data.business_partner_role
      account_business_partner_type_id:
        input_data.value.stepper_info_form?.step_one?.main_data
          ?.bp_type_selection ?? null, // data.stepper_info_form?.step_one?.main_data.bp_type_selection //number
      is_natural_person: input_data.value.stepper_info_form?.step_one?.main_data
        .naturel_person
        ? true
        : false, // data.stepper_info_form?.step_one?.main_data.naturel_person   //null ? 0:1
      tax_category:
        input_data.value.stepper_info_form?.step_one?.main_data?.tax_catega ??
        null, // data.stepper_info_form?.step_one?.main_data.tax_catega
      industry:
        input_data.value.stepper_info_form?.step_one?.main_data?.indutry ??
        null, // data.stepper_info_form?.step_one?.main_data.indutry
      trading_partner:
        input_data.value.stepper_info_form?.step_one?.main_data
          ?.tarding_partner ?? null, // data.stepper_info_form?.step_one?.main_data.tarding_partner
      valid_from:
        input_data.value.stepper_info_form?.step_one?.main_data?.valid_from ??
        null, // data.stepper_info_form?.step_one?.main_data.valid_from
      valid_to:
        input_data.value.stepper_info_form?.step_one?.main_data?.valid_to ??
        null, // data.stepper_info_form?.step_one?.main_data.valid_to

      //   //STEP TWO
      name1_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.name?.one ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.one
      name2_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.name?.two ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.two
      name3_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.name?.three ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.three
      name4_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.name?.four ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.four
      search_term1_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.search?.one ??
        null, // data.stepper_info_form?.step_two?.address_th?.search.one
      search_term2_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.search?.two ??
        null, // data.stepper_info_form?.step_two?.address_th?.search.two
      address1_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.address
          ?.one ?? null, // data.stepper_info_form?.step_two?.address_th?.address.one
      address2_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.address
          ?.two ?? null, // data.stepper_info_form?.step_two?.address_th?.address.two
      language: "EN",
      // input_data.value.stepper_info_form?.step_two?.country_info?.country ??
      // null, // data.stepper_info_form?.step_two?.country_info.country
      name1_en:
        input_data.value.stepper_info_form?.step_two?.address_en.name?.one ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.one
      name2_en:
        input_data.value.stepper_info_form?.step_two?.address_en.name?.two ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.two
      name3_en:
        input_data.value.stepper_info_form?.step_two?.address_en.name?.three ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.three
      name4_en:
        input_data.value.stepper_info_form?.step_two?.address_en.name?.four ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.four
      search_term1_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.search?.one ??
        null, // data.stepper_info_form?.step_two?.address_th?.search.one
      search_term2_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.search?.two ??
        null, // data.stepper_info_form?.step_two?.address_th?.search.two
      address1_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.address
          ?.one ?? null, // data.stepper_info_form?.step_two?.address_th?.address.one
      address2_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.address
          ?.two ?? null, // data.stepper_info_form?.step_two?.address_th?.address.two
      country:
        input_data.value.stepper_info_form?.step_two?.country_info?.country ??
        null, // unknow

      //   //STEP THREE
      branch_description:
        input_data.value.stepper_info_form.step_three?.info?.branch_desc ??
        null, // data.stepper_info_form.step_three?.info.branch_desc
      default_branch_code:
        input_data.value.stepper_info_form.step_three?.info?.branch_code ??
        null, // data.stepper_info_form.step_three?.info.branch_code
      branch_name1_th:
        input_data.value.stepper_info_form.step_three?.address_th?.name?.one ??
        null, //data.stepper_info_form.step_three?.address_th.name?.one
      branch_name2_th:
        input_data.value.stepper_info_form.step_three?.address_th?.name?.two ??
        null, // data.stepper_info_form.step_three?.address_th.name?.two
      branch_name3_th:
        input_data.value.stepper_info_form.step_three?.address_th?.name
          ?.three ?? null, // data.stepper_info_form.step_three?.address_th.name?.three
      branch_name4_th:
        input_data.value.stepper_info_form.step_three?.address_th?.name?.four ??
        null, // data.stepper_info_form.step_three?.address_th.name?.four
      branch_search_term1_th:
        input_data.value.stepper_info_form.step_three?.info?.serach_team.th ??
        null,
      // input_data.value.stepper_info_form.step_three?.address_th?.search
      //   ?.one ?? null, // data.stepper_info_form.step_three?.address_th.search.one
      branch_search_term2_th:
        input_data.value.stepper_info_form.step_three?.address_th?.search
          ?.two ?? null, // data.stepper_info_form.step_three?.address_th.search.two
      branch_address1_th:
        input_data.value.stepper_info_form.step_three?.address_th?.address
          ?.one ?? null, // data.stepper_info_form.step_three?.address_th.address.one
      branch_address2_th:
        input_data.value.stepper_info_form.step_three?.address_th?.address
          ?.two ?? null, // data.stepper_info_form.step_three?.address_th.address.two
      branch_province_th_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.province ?? null, // data.stepper_info_form.step_three?.address_th.location.province //number
      branch_distict_th_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.district ?? null, // data.stepper_info_form.step_three?.address_th.location.district //number
      branch_subdisticte_th_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.parish ?? null, // data.stepper_info_form.step_three?.address_th.location.parish  //number
      branch_postal_code_th_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.zip_code ?? null, // data.stepper_info_form.step_three?.address_th.location.zip_code //number
      branch_name1_en:
        input_data.value.stepper_info_form.step_three?.address_en?.name?.one ??
        null, //data.stepper_info_form.step_three?.address_en.name?.one
      branch_name2_en:
        input_data.value.stepper_info_form.step_three?.address_en?.name?.two ??
        null, // data.stepper_info_form.step_three?.address_en.name?.two
      branch_name3_en:
        input_data.value.stepper_info_form.step_three?.address_en?.name
          ?.three ?? null, // data.stepper_info_form.step_three?.address_en.name?.three
      branch_name4_en:
        input_data.value.stepper_info_form.step_three?.address_en?.name?.four ??
        null, // data.stepper_info_form.step_three?.address_en.name?.four
      branch_search_term1_en:
        input_data.value.stepper_info_form.step_three?.info?.serach_team.en ??
        null,
      // input_data.value.stepper_info_form.step_three?.address_en?.search.one ??
      // null, // data.stepper_info_form.step_three?.address_en.search.one
      branch_search_term2_en:
        input_data.value.stepper_info_form.step_three?.address_en?.search
          ?.two ?? null, // data.stepper_info_form.step_three?.address_en.search.two
      branch_address1_en:
        input_data.value.stepper_info_form.step_three?.address_en?.address
          ?.one ?? null, // data.stepper_info_form.step_three?.address_en.address.one
      branch_address2_en:
        input_data.value.stepper_info_form.step_three?.address_en?.address
          ?.two ?? null, // data.stepper_info_form.step_three?.address_en.address.two
      branch_province_en:
        input_data.value.stepper_info_form.step_three?.address_en?.location
          ?.province ?? null, // data.stepper_info_form.step_three?.address_en.location.province //number
      branch_distict_en:
        input_data.value.stepper_info_form.step_three?.address_en?.location
          ?.district ?? null, // data.stepper_info_form.step_three?.address_en.location.district  //number
      branch_subdisticte_en:
        input_data.value.stepper_info_form.step_three?.address_en?.location
          ?.parish ?? null, // data.stepper_info_form.step_three?.address_en.location.parish //number
      branch_postal_code_en_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.zip_code ?? null, // data.stepper_info_form.step_three?.address_th.location.zip_code //number, // data.stepper_info_form.step_three?.address_en.location.zip_code //number
      branch_contact_name_1:
        input_data.value.stepper_info_form.step_three?.contacts?.[0]?.name ??
        null, // data.stepper_info_form.step_three?.contacts?.[0]?.name
      branch_contact_mobile_number_1:
        input_data.value.stepper_info_form.step_three?.contacts?.[0]?.phone ??
        null, // data.stepper_info_form.step_three?.contacts?.[0]?.phone
      branch_contact_email_1:
        input_data.value.stepper_info_form.step_three?.contacts?.[0]?.email ??
        null, // data.stepper_info_form.step_three?.contacts?.[0]?.email
      branch_contact_name_2:
        input_data.value.stepper_info_form.step_three?.contacts?.[1]?.name ??
        null, // data.stepper_info_form.step_three?.contacts?.[1]?.name
      branch_contact_mobile_number_2:
        input_data.value.stepper_info_form.step_three?.contacts?.[1]?.phone ??
        null, // data.stepper_info_form.step_three?.contacts?.[1]?.phone
      branch_contact_email_2:
        input_data.value.stepper_info_form.step_three?.contacts?.[1]?.email ??
        null, // data.stepper_info_form.step_three?.contacts?.[1]?.email
      branch_contact_name_3:
        input_data.value.stepper_info_form.step_three?.contacts?.[2]?.name ??
        null, // data.stepper_info_form.step_three?.contacts?.[2]?.name
      branch_contact_mobile_number_3:
        input_data.value.stepper_info_form.step_three?.contacts?.[2]?.phone ??
        null, // data.stepper_info_form.step_three?.contacts?.[2]?.phone
      branch_contact_email_3:
        input_data.value.stepper_info_form.step_three?.contacts?.[2]?.email ??
        null, // data.stepper_info_form.step_three?.contacts?.[2]?.email

      //   //STEP FOUR
      reconciliation_account_id:
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.reconcliation_acct_seletion ?? null, // data.stepper_info_form.step_four?.more_data_one.reconcliation_acct_seletion //number
      instruction_key:
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.instruction_key ?? null, // data.stepper_info_form.step_four?.more_data_one.instruction_key
      sort_key:
        input_data.value.stepper_info_form.step_four?.more_data_one?.sort_key ??
        null, // data.stepper_info_form.step_four?.more_data_one.sort_key
      check_double_invoice:
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.check_double_invoice ?? null, // data.stepper_info_form.step_four?.more_data_one.check_double_invoice
      payment_methods:
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.payment_methodes, // data.stepper_info_form.step_four?.more_data_one.payment_methodes
      payment_term_id: Number(
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.pyment_term_selection ?? null
      ), // data.stepper_info_form.step_four?.more_data_one.pyment_term_selection //number
      payment_terms_id: Number(
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.payment_terms_selection ?? null
      ), // data.stepper_info_form.step_four?.more_data_one.payment_terms_selection // number

      withholding_tax_type_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_type?.["1"] ?? null,

      withholding_tax_code_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_code?.["1"] ?? null, // data.stepper_info_form.step_four?.with_tax_code?.["1"]

      subject_to_wht_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .subject_wht?.["1"] ?? null, // data.stepper_info_form.step_four?.subject_wht?.["1"]
      type_of_recipient_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .type_reciepient?.["1"] ?? null, // data.stepper_info_form.step_four?.type_reciepient?.["1"]
      withhold_agent_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .with_agent?.["1"], // data.stepper_info_form.step_four?.more_data_two.with_agent?.["1"]
      obligation_from_1:
        input_data.value.stepper_info_form.step_four?.more_data_two.obli_from?.[
          "1"
        ], // data.stepper_info_form.step_four?.more_data_two.obli_from?.["1"]
      obligation_to_1:
        input_data.value.stepper_info_form.step_four?.more_data_two.obli_to?.[
          "1"
        ], // data.stepper_info_form.step_four?.more_data_two.obli_to?.["1"]
      withholding_tax_type_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_type?.["2"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_tax_type?.["2"]
      withholding_tax_code_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .with_tax_code?.["2"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_tax_code?.["2"]
      subject_to_wht_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .subject_wht?.[2], // data.stepper_info_form.step_four?.more_data_two.subject_wht?.[2]
      type_of_recipient_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .type_reciepient?.["2"] ?? null, // data.stepper_info_form.step_four?.more_data_two.type_reciepient?.["2"]
      withhold_agent_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .with_agent?.["2"], // data.stepper_info_form.step_four?.more_data_two.with_agent?.["2"]
      obligation_from_2:
        input_data.value.stepper_info_form.step_four?.more_data_two.obli_from?.[
          "2"
        ], // data.stepper_info_form.step_four?.more_data_two.obli_from?.["2"]
      obligation_to_2:
        input_data.value.stepper_info_form.step_four?.more_data_two.obli_to?.[
          "2"
        ], // data.stepper_info_form.step_four?.more_data_two.obli_to?.["2"]
      withholding_tax_type_3:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_type?.["3"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_tax_type?.["3"]

      withholding_tax_code_3:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_code?.["3"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_tax_code?.["3"]

      subject_to_wht_3:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.subject_wht?.["3"] ?? null, // data.stepper_info_form.step_four?.more_data_two.subject_wht?.["3"]

      type_of_recipient_3:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.type_reciepient?.["3"] ?? null, // data.stepper_info_form.step_four?.more_data_two.type_reciepient?.["3"]

      purchase_organization:
        input_data.value.stepper_info_form.step_four?.vander_info?.pruch, // data.stepper_info_form.step_four?.vander_info.pruch

      order_currency:
        input_data.value.stepper_info_form.step_four?.vander_info
          ?.order_currency ?? null, // data.stepper_info_form.step_four?.vander_info.order_currency

      gr_base_invoice_verif:
        input_data.value.stepper_info_form.step_four?.gb_base, // data.stepper_info_form.step_four?.gb_base
      long_text_general: null, //unknow
      house_bank: null, //unknow
      long_text_company: null, //unknow
      saleperson: null, //unknow
      telephone: null, //unknow
      customer: null, //unknow
      head_office:
        input_data.value.stepper_info_form.step_four?.vander_info
          ?.head_office ?? null, // data.stepper_info_form.step_four?.vander_info.head_office
      payee_in_doc:
        input_data.value.stepper_info_form.step_four?.vander_info
          ?.pa_yee_in_doc ?? null, // data.stepper_info_form.step_four?.vander_info.pa_yee_in_doc
    },
  };
  // console.error(JSON.stringify(input_data.value.stepper_info_form.step_four))
  // console.warn(JSON.stringify(requestSaveDaftBusinessPartnerRegis));

  try {
    const response = await PartnerServive.createSaveBusinessPartnerRegisterForm(
      requestSaveDaftBusinessPartnerRegis
    );
    if (response.data.is_success) {
      router.push({
        name: "AccountManagement",
        query: { path: "ExportTask" },
      });
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

const handleSaveDaft = async () => {
  if (
    !(await showDialog(
      "ยืนยันการบันทึกข้อมูล ?",
      "เมื่อทำการ Save draft งานของคุณจะไปอยู่ที่เมนู Draft\nคลิกปุ่ม ตกลง เพื่อดำเนินการ"
    ))
  )
    return;
  let name_th =
   `${input_data.value.stepper_info_form.step_two.address_th.name.one}${input_data.value.stepper_info_form.step_two.address_th.name.two}${input_data.value.stepper_info_form.step_two.address_th.name.three}${input_data.value.stepper_info_form.step_two.address_th.name.four}`;
  let name_en =
    `${input_data.value.stepper_info_form.step_two.address_en.name.one}${input_data.value.stepper_info_form.step_two.address_en.name.two}${input_data.value.stepper_info_form.step_two.address_en.name.three}${input_data.value.stepper_info_form.step_two.address_en.name.four}`;

  // if (input_data.value.register_info_form.customer_type_data.data == 1) {
  //   name_th = `${input_data.value.register_info_form.customer_info.th.pserson.gender?? ""}${input_data.value.stepper_info_form.step_two.address_th.name.one}${input_data.value.stepper_info_form.step_two.address_th.name.two}${input_data.value.stepper_info_form.step_two.address_th.name.three}${input_data.value.stepper_info_form.step_two.address_th.name.four}`;
  //   name_en = `${input_data.value.register_info_form?.customer_info?.en?.pserson.gender?? ""}${input_data.value.stepper_info_form.step_two.address_en.name.one}${input_data.value.stepper_info_form.step_two.address_en.name.two}${input_data.value.stepper_info_form.step_two.address_en.name.three}${input_data.value.stepper_info_form.step_two.address_en.name.four}`;
  // }
  if (input_data.value.register_info_form.customer_type_data.data == 1) {
    name_th = `${input_data.value.stepper_info_form.step_two.address_th.name.gender?? ""}${input_data.value.stepper_info_form.step_two.address_th.name.one}${input_data.value.stepper_info_form.step_two.address_th.name.two}${input_data.value.stepper_info_form.step_two.address_th.name.three}${input_data.value.stepper_info_form.step_two.address_th.name.four}`;
    name_en = `${input_data.value.stepper_info_form.step_two.address_en.name.gender?? ""}${input_data.value.stepper_info_form.step_two.address_en.name.one}${input_data.value.stepper_info_form.step_two.address_en.name.two}${input_data.value.stepper_info_form.step_two.address_en.name.three}${input_data.value.stepper_info_form.step_two.address_en.name.four}`;
  }

  const requestSaveDaftBusinessPartnerRegis = {
    form_number:
      register_form_detail.value.business_partner_register_form?.form_number ??
      null,
    business_partner_register_form: {
      taxpayer_id_number:
        input_data.value.stepper_info_form?.step_one?.main_data?.tax_number ??
        null,
      created_user_id: Number(
        register_form_detail.value.business_partner_register_form
          ?.created_user_id ?? null
      ),
      // name_th:
      //   input_data.value.register_info_form?.customer_info?.th?.company_name, // data.register_info_form.customer_info.th.company_name
      // name_en:
      //   input_data.value.register_info_form?.customer_info?.en?.company_name, // data.register_info_form.customer_info.en.company_name
      name_th, // data.register_info_form.customer_info.th.company_name
      name_en, // data.register_info_form.customer_info.en.company_name
      form_status_id:
        register_form_detail.value.business_partner_register_form?.form_status
          ?.id, //number
      business_partner_role_id:
        input_data.value.register_info_form?.type_register, // data.register_info_form.type_register //number
      fill_type_id: input_data.value.register_info_form?.type_data, // data.register_info_form.type_data.data //number
      company_id: input_data.value.stepper_info_form?.step_one?.other
        .company_code
        ? input_data.value.stepper_info_form?.step_one?.other.company_code
            .map((comp) => comp.id)
            .join(",")
        : "",
      employee_type_id:
        register_form_detail.value.business_partner_register_form.employee_type
          .map((el) => el.id)
          .join(","), // unknow
      payment_term_id: Number(
        input_data.value.register_info_form?.term_data?.data
      ), // data.register_info_form.term_data.data
      registered_user_email: "user@example.com", // unknow
      // created_at: "2023-11-10T14:20:12", // auto fill
      // created_user_id: 1, // auto fill
      // updated_at: "2023-11-12T10:30:45", // auto fill
      // updated_user_id: 1, // auto fill
    },

    business_partner_profile_form: {
      business_partner_type_id:
        input_data.value.register_info_form?.customer_type_data?.data, // data.customer_type_data.data //number
      business_register_type_id:
        input_data.value.register_info_form?.type_register, //  data.type_register //number
      is_vat_registered:
        input_data.value.register_info_form?.tax_register?.type == "1"
          ? true
          : false, // data.tax_register.type //number
      is_head_office:
        input_data.value.register_info_form?.tax_register?.branch == "1"
          ? true
          : false, // data.tax_register.branch //number
      branch_code:
        input_data.value.register_info_form?.tax_register?.branch_code ?? null, // data.tax_register.branch_code //string
      company_category_id:
        input_data.value.register_info_form?.type_business?.data ?? null, // data.type_business.data //number
      product_category:
        input_data.value.register_info_form?.type_product_service ?? null, // data.type_product_service
      customer_category:
        input_data.value.register_info_form?.customer_type ?? null, // unknow

      address_th: `${input_data.value.stepper_info_form.step_two.address_th.address.one}${input_data.value.stepper_info_form.step_two.address_th.address.two}`,
      //stepin_fo
      // province_th_id:
      //   input_data.value.register_info_form?.customer_info?.th?.info?.province, // data.customer_info.th.province //number
      // district_th_id:
      //   input_data.value.register_info_form?.customer_info?.th?.info?.district, // data.customer_info.th.district //number
      // subdistrict_th_id:
      //   input_data.value.register_info_form?.customer_info?.th?.info?.parish, // data.customer_info.th.parish //number
      // postal_code_th_id:
      //   input_data.value.register_info_form?.customer_info?.th?.info?.zip_code, // data.customer_info.th.zip_code //number
      ///step_2_th
      province_th_id:
        input_data.value.stepper_info_form?.step_two?.address_th?.location
          .province ?? null,
      district_th_id:
        input_data.value.stepper_info_form?.step_two?.address_th?.location
          ?.district ?? null,
      subdistrict_th_id:
        input_data.value.stepper_info_form?.step_two?.address_th?.location
          ?.parish ?? null,
      postal_code_th_id:
        input_data.value.stepper_info_form?.step_two?.address_th?.location
          ?.zip_code ?? null,

      address_en: `${input_data.value.stepper_info_form.step_two.address_en.address.one}${input_data.value.stepper_info_form.step_two.address_en.address.two}`,
      // input_data.value.register_info_form?.customer_info?.en?.address, // data.customer_info.en.address

      //stepin_fo
      // province_en:
      //   input_data.value.register_info_form?.customer_info?.en?.info?.province, // data.customer_info.en.province
      // district_en:
      //   input_data.value.register_info_form?.customer_info?.en?.info?.district, // data.customer_info.en.district
      // subdistrict_en:
      //   input_data.value.register_info_form?.customer_info?.en?.info?.parish, // data.customer_info.en.parish
      // postal_code_en_id:
      //   input_data.value.register_info_form?.customer_info?.en?.info?.zip_code, // data.customer_info.en.zip_code
      //steptwo
      province_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.location
          ?.province ?? null,
      district_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.location
          ?.district ?? null,
      subdistrict_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.location
          ?.parish ?? null,
      postal_code_en_id:
        input_data.value.stepper_info_form?.step_two?.address_th?.location
          ?.zip_code ?? null,

      contact_name_1:
        input_data.value.register_info_form?.items_contects[0]?.name ?? null, // data.items_contects[0]?.name
      contact_mobile_number_1:
        input_data.value.register_info_form?.items_contects[0]?.phone ?? null, // data.items_contects[0]?.phone
      contact_email_1:
        input_data.value.register_info_form?.items_contects[0]?.email ?? null, // data.items_contects[0]?.email
      contact_name_2:
        input_data.value.register_info_form?.items_contects[1]?.name ?? null, // data.items_contects[2]?.name
      contact_mobile_number_2:
        input_data.value.register_info_form?.items_contects[1]?.phone ?? null, // data.items_contects[2]?.phone
      contact_email_2:
        input_data.value.register_info_form?.items_contects[1]?.email ?? null, // data.items_contects[2]?.email
      contact_name_3:
        input_data.value.register_info_form?.items_contects[2]?.name ?? null, // data.items_contects[3]?.name
      contact_mobile_number_3:
        input_data.value.register_info_form?.items_contects[2]?.phone ?? null, // data.items_contects[3]?.phone
      contact_email_3:
        input_data.value.register_info_form?.items_contects[2]?.email ?? null, // data.items_contects[3]?.email
      bank_account_name:
        input_data.value.register_info_form?.bank_info?.acc_name_en ?? null, // data.bank_info.acc_name_en
      bank_id:
        Number(input_data.value.stepper_info_form?.step_one?.other?.bank_key) ??
        null, // data.bank_info.bank_name //number
      bank_branch:
        input_data.value.stepper_info_form?.step_one?.other?.bank_branch ??
        null,
      // data.bank_info.bank_branch
      bank_account_number:
        input_data.value.stepper_info_form?.step_one?.other?.bank_account ??
        null,
      // created_at: "2023-11-10T14:20:12", // auto fill
      // created_user_id: 1, // auto fill
      // updated_at: "2023-11-12T10:30:45", // auto fill
      // updated_user_id: 1, // auto fill
    },

    account_information_form: {
      //   //SETEP ONE
      business_partner_number:
        input_data.value.stepper_info_form?.step_one?.main_data
          .business_partner, // data.stepper_info_form?.step_one?.main_data.business_partner
      vendor_number:
        input_data.value.stepper_info_form?.step_one?.main_data?.vender_number, // data.stepper_info_form?.step_one?.main_data.vender_number
      customer_number: null, // unknow
      business_partner_group_id:
        input_data.value.stepper_info_form?.step_one?.main_data
          .business_partner_gruop_selection, // data.stepper_info_form?.step_one?.main_data.business_partner_gruop_selection //number
      business_partner_category:
        input_data.value.stepper_info_form?.step_one?.main_data
          .business_partner_catega, // data.stepper_info_form?.step_one?.main_data.business_partner_catega
      business_partner_role:
        input_data.value.stepper_info_form?.step_one?.main_data
          .business_partner_role, // data.stepper_info_form?.step_one?.main_data.business_partner_role
      account_business_partner_type_id:
        input_data.value.stepper_info_form?.step_one?.main_data
          .bp_type_selection, // data.stepper_info_form?.step_one?.main_data.bp_type_selection //number
      is_natural_person: input_data.value.stepper_info_form?.step_one?.main_data
        .naturel_person
        ? true
        : false, // data.stepper_info_form?.step_one?.main_data.naturel_person   //null ? 0:1
      tax_category:
        input_data.value.stepper_info_form?.step_one?.main_data?.tax_catega, // data.stepper_info_form?.step_one?.main_data.tax_catega
      industry:
        input_data.value.stepper_info_form?.step_one?.main_data?.indutry, // data.stepper_info_form?.step_one?.main_data.indutry
      trading_partner:
        input_data.value.stepper_info_form?.step_one?.main_data
          ?.tarding_partner, // data.stepper_info_form?.step_one?.main_data.tarding_partner
      valid_from:
        input_data.value.stepper_info_form?.step_one?.main_data?.valid_from, // data.stepper_info_form?.step_one?.main_data.valid_from
      valid_to:
        input_data.value.stepper_info_form?.step_one?.main_data?.valid_to, // data.stepper_info_form?.step_one?.main_data.valid_to

      //   //STEP TWO
      name1_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.name?.one ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.one
      name2_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.name?.two ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.two
      name3_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.name?.three ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.three
      name4_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.name?.four ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.four
      search_term1_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.search?.one ??
        null, // data.stepper_info_form?.step_two?.address_th?.search.one
      search_term2_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.search?.two ??
        null, // data.stepper_info_form?.step_two?.address_th?.search.two
      address1_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.address
          ?.one ?? null, // data.stepper_info_form?.step_two?.address_th?.address.one
      address2_th:
        input_data.value.stepper_info_form?.step_two?.address_th?.address
          ?.two ?? null, // data.stepper_info_form?.step_two?.address_th?.address.two
      language: "EN",
      // input_data.value.stepper_info_form?.step_two?.country_info?.country ??
      // null, // data.stepper_info_form?.step_two?.country_info.country
      name1_en:
        input_data.value.stepper_info_form?.step_two?.address_en.name?.one ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.one
      name2_en:
        input_data.value.stepper_info_form?.step_two?.address_en.name?.two ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.two
      name3_en:
        input_data.value.stepper_info_form?.step_two?.address_en.name?.three ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.three
      name4_en:
        input_data.value.stepper_info_form?.step_two?.address_en.name?.four ??
        null, // data.stepper_info_form?.step_two?.address_th?.name?.four
      search_term1_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.search?.one ??
        null, // data.stepper_info_form?.step_two?.address_th?.search.one
      search_term2_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.search?.two ??
        null, // data.stepper_info_form?.step_two?.address_th?.search.two
      address1_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.address
          ?.one ?? null, // data.stepper_info_form?.step_two?.address_th?.address.one
      address2_en:
        input_data.value.stepper_info_form?.step_two?.address_en?.address
          ?.two ?? null, // data.stepper_info_form?.step_two?.address_th?.address.two
      // country: "TH", // unknow
      country:
        input_data.value.stepper_info_form?.step_two?.country_info?.country ??
        null, // unknow

      //   //STEP THREE
      branch_description:
        input_data.value.stepper_info_form.step_three?.info?.branch_desc ??
        null, // data.stepper_info_form.step_three?.info.branch_desc
      default_branch_code:
        input_data.value.stepper_info_form.step_three?.info?.branch_code ??
        null, // data.stepper_info_form.step_three?.info.branch_code
      branch_name1_th:
        input_data.value.stepper_info_form.step_three?.address_th?.name?.one ??
        null, //data.stepper_info_form.step_three?.address_th.name?.one
      branch_name2_th:
        input_data.value.stepper_info_form.step_three?.address_th?.name?.two ??
        null, // data.stepper_info_form.step_three?.address_th.name?.two
      branch_name3_th:
        input_data.value.stepper_info_form.step_three?.address_th?.name
          ?.three ?? null, // data.stepper_info_form.step_three?.address_th.name?.three
      branch_name4_th:
        input_data.value.stepper_info_form.step_three?.address_th?.name?.four ??
        null, // data.stepper_info_form.step_three?.address_th.name?.four
      branch_search_term1_th:
        input_data.value.stepper_info_form.step_three?.info?.serach_team.th ??
        null,
      // input_data.value.stepper_info_form.step_three?.address_th?.search
      //   ?.one ?? null, // data.stepper_info_form.step_three?.address_th.search.one
      branch_search_term2_th:
        input_data.value.stepper_info_form.step_three?.address_th?.search
          ?.two ?? null, // data.stepper_info_form.step_three?.address_th.search.two
      branch_address1_th:
        input_data.value.stepper_info_form.step_three?.address_th?.address
          ?.one ?? null, // data.stepper_info_form.step_three?.address_th.address.one
      branch_address2_th:
        input_data.value.stepper_info_form.step_three?.address_th?.address
          ?.two ?? null, // data.stepper_info_form.step_three?.address_th.address.two
      branch_province_th_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.province ?? null, // data.stepper_info_form.step_three?.address_th.location.province //number
      branch_distict_th_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.district ?? null, // data.stepper_info_form.step_three?.address_th.location.district //number
      branch_subdisticte_th_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.parish ?? null, // data.stepper_info_form.step_three?.address_th.location.parish  //number
      branch_postal_code_th_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.zip_code ?? null, // data.stepper_info_form.step_three?.address_th.location.zip_code //number
      branch_name1_en:
        input_data.value.stepper_info_form.step_three?.address_en?.name?.one ??
        null, //data.stepper_info_form.step_three?.address_en.name?.one
      branch_name2_en:
        input_data.value.stepper_info_form.step_three?.address_en?.name?.two ??
        null, // data.stepper_info_form.step_three?.address_en.name?.two
      branch_name3_en:
        input_data.value.stepper_info_form.step_three?.address_en?.name
          ?.three ?? null, // data.stepper_info_form.step_three?.address_en.name?.three
      branch_name4_en:
        input_data.value.stepper_info_form.step_three?.address_en?.name?.four ??
        null, // data.stepper_info_form.step_three?.address_en.name?.four
      branch_search_term1_en:
        input_data.value.stepper_info_form.step_three?.info?.serach_team.en ??
        null,
      // input_data.value.stepper_info_form.step_three?.address_en?.search.one ??
      // null, // data.stepper_info_form.step_three?.address_en.search.one
      branch_search_term2_en:
        input_data.value.stepper_info_form.step_three?.address_en?.search.two ??
        null, // data.stepper_info_form.step_three?.address_en.search.two
      branch_address1_en:
        input_data.value.stepper_info_form.step_three?.address_en?.address
          .one ?? null, // data.stepper_info_form.step_three?.address_en.address.one
      branch_address2_en:
        input_data.value.stepper_info_form.step_three?.address_en?.address
          .two ?? null, // data.stepper_info_form.step_three?.address_en.address.two
      branch_province_en:
        input_data.value.stepper_info_form.step_three?.address_en?.location
          ?.province ?? null, // data.stepper_info_form.step_three?.address_en.location.province //number
      branch_distict_en:
        input_data.value.stepper_info_form.step_three?.address_en?.location
          ?.district ?? null, // data.stepper_info_form.step_three?.address_en.location.district  //number
      branch_subdisticte_en:
        input_data.value.stepper_info_form.step_three?.address_en?.location
          ?.parish ?? null, // data.stepper_info_form.step_three?.address_en.location.parish //number
      branch_postal_code_en_id:
        input_data.value.stepper_info_form.step_three?.address_th?.location
          ?.zip_code ?? null, // data.stepper_info_form.step_three?.address_th.location.zip_code //number
      branch_contact_name_1:
        input_data.value.stepper_info_form.step_three?.contacts?.[0]?.name ??
        null, // data.stepper_info_form.step_three?.contacts?.[0]?.name
      branch_contact_mobile_number_1:
        input_data.value.stepper_info_form.step_three?.contacts?.[0]?.phone ??
        null, // data.stepper_info_form.step_three?.contacts?.[0]?.phone
      branch_contact_email_1:
        input_data.value.stepper_info_form.step_three?.contacts?.[0]?.email ??
        null, // data.stepper_info_form.step_three?.contacts?.[0]?.email
      branch_contact_name_2:
        input_data.value.stepper_info_form.step_three?.contacts?.[1]?.name ??
        null, // data.stepper_info_form.step_three?.contacts?.[1]?.name
      branch_contact_mobile_number_2:
        input_data.value.stepper_info_form.step_three?.contacts?.[1]?.phone ??
        null, // data.stepper_info_form.step_three?.contacts?.[1]?.phone
      branch_contact_email_2:
        input_data.value.stepper_info_form.step_three?.contacts?.[1]?.email ??
        null, // data.stepper_info_form.step_three?.contacts?.[1]?.email
      branch_contact_name_3:
        input_data.value.stepper_info_form.step_three?.contacts?.[2]?.name ??
        null, // data.stepper_info_form.step_three?.contacts?.[2]?.name
      branch_contact_mobile_number_3:
        input_data.value.stepper_info_form.step_three?.contacts?.[2]?.phone ??
        null, // data.stepper_info_form.step_three?.contacts?.[2]?.phone
      branch_contact_email_3:
        input_data.value.stepper_info_form.step_three?.contacts?.[2]?.email ??
        null, // data.stepper_info_form.step_three?.contacts?.[2]?.email

      //   //STEP FOUR
      reconciliation_account_id:
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.reconcliation_acct_seletion ?? null, // data.stepper_info_form.step_four?.more_data_one.reconcliation_acct_seletion //number
      instruction_key:
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.instruction_key ?? null, // data.stepper_info_form.step_four?.more_data_one.instruction_key
      sort_key:
        input_data.value.stepper_info_form.step_four?.more_data_one?.sort_key ??
        null, // data.stepper_info_form.step_four?.more_data_one.sort_key
      check_double_invoice:
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.check_double_invoice ?? null, // data.stepper_info_form.step_four?.more_data_one.check_double_invoice
      payment_methods:
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.payment_methodes, // data.stepper_info_form.step_four?.more_data_one.payment_methodes
      payment_term_id: Number(
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.pyment_term_selection ?? null
      ), // data.stepper_info_form.step_four?.more_data_one.pyment_term_selection //number
      payment_terms_id: Number(
        input_data.value.stepper_info_form.step_four?.more_data_one
          ?.payment_terms_selection ?? null
      ), // data.stepper_info_form.step_four?.more_data_one.payment_terms_selection // number
      withholding_tax_type_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_type?.["1"] ?? null, // data.stepper_info_form.step_four?.with_tax_type?.["1"]
      withholding_tax_code_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .with_tax_code?.["1"] ?? null, // data.stepper_info_form.step_four?.with_tax_code?.["1"]
      subject_to_wht_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .subject_wht?.["1"] ?? null, // data.stepper_info_form.step_four?.subject_wht?.["1"]
      type_of_recipient_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .type_reciepient?.["1"] ?? null, // data.stepper_info_form.step_four?.type_reciepient?.["1"]
      withhold_agent_1:
        input_data.value.stepper_info_form.step_four?.more_data_two
          .with_agent?.["1"], // data.stepper_info_form.step_four?.more_data_two.with_agent?.["1"]
      obligation_from_1:
        input_data.value.stepper_info_form.step_four?.more_data_two.obli_from?.[
          "1"
        ], // data.stepper_info_form.step_four?.more_data_two.obli_from?.["1"]
      obligation_to_1:
        input_data.value.stepper_info_form.step_four?.more_data_two.obli_to?.[
          "1"
        ], // data.stepper_info_form.step_four?.more_data_two.obli_to?.["1"]
      withholding_tax_type_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_type?.["2"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_tax_type?.["2"]
      withholding_tax_code_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_code?.["2"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_tax_code?.["2"]
      subject_to_wht_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.subject_wht?.[2] ?? null, // data.stepper_info_form.step_four?.more_data_two.subject_wht?.[2]
      type_of_recipient_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.type_reciepient?.["2"] ?? null, // data.stepper_info_form.step_four?.more_data_two.type_reciepient?.["2"]
      withhold_agent_2:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_agent?.["2"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_agent?.["2"]
      obligation_from_2:
        input_data.value.stepper_info_form.step_four?.more_data_two.obli_from?.[
          "2"
        ] ?? null, // data.stepper_info_form.step_four?.more_data_two.obli_from?.["2"]
      obligation_to_2:
        input_data.value.stepper_info_form.step_four?.more_data_two.obli_to?.[
          "2"
        ] ?? null, // data.stepper_info_form.step_four?.more_data_two.obli_to?.["2"]
      withholding_tax_type_3:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_type?.["3"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_tax_type?.["3"]
      withholding_tax_code_3:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.with_tax_code?.["3"] ?? null, // data.stepper_info_form.step_four?.more_data_two.with_tax_code?.["3"]
      subject_to_wht_3:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.subject_wht?.["3"] ?? null, // data.stepper_info_form.step_four?.more_data_two.subject_wht?.["3"]
      type_of_recipient_3:
        input_data.value.stepper_info_form.step_four?.more_data_two
          ?.type_reciepient?.["3"] ?? null, // data.stepper_info_form.step_four?.more_data_two.type_reciepient?.["3"]
      purchase_organization:
        input_data.value.stepper_info_form.step_four?.vander_info?.pruch ??
        null, // data.stepper_info_form.step_four?.vander_info.pruch
      order_currency:
        input_data.value.stepper_info_form.step_four?.vander_info
          ?.order_currency ?? null, // data.stepper_info_form.step_four?.vander_info.order_currency

      gr_base_invoice_verif:
        input_data.value.stepper_info_form.step_four?.gb_base, // data.stepper_info_form.step_four?.gb_base

      long_text_general: null, //unknow
      house_bank: null, //unknow
      long_text_company: null, //unknow
      saleperson: null, //unknow
      telephone: null, //unknow
      customer: null, //unknow
      // updated_user_id:
      // Number(register_form_detail.value.business_partner_register_form?.created_user_id ?? null),
      head_office:
        input_data.value.stepper_info_form.step_four?.vander_info
          ?.head_office ?? null, // data.stepper_info_form.step_four?.vander_info.head_office
      payee_in_doc:
        input_data.value.stepper_info_form.step_four?.vander_info
          ?.pa_yee_in_doc ?? null, // data.stepper_info_form.step_four?.vander_info.pa_yee_in_doc
    },
  };

  try {
    const response = await PartnerServive.createDaftBusinessPartnerRegisterForm(
      requestSaveDaftBusinessPartnerRegis
    );
    if (response.data.is_success) {
      router.push({
        name: "AccountManagement",
        query: { path: "DaftTask" },
      });
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      
      if (val?.data?.error ?? null) {
        handlingErrorsMessage(val.message, val?.data?.error);
      } else {
        handlingErrorsMessage(val.message, val);
      }

      return;
    }
    handlingErrorsMessage("unknown", e.message);
  }
};

const handleReqDocumentBack = () => {
  is_id_form.value = FORM_ID.REGISTER_INFO;
};

const handleReqDocumentCommit = () => {
  is_id_form.value = FORM_ID.REGISTER_INFO;
};

onMounted(async () => {
  // await getBusinessPartnerRegisterFormById(acc_id.value);
  await getRegisterFormDetailByFormNumber(acc_id.value);
  getUploadDocumentByFormNumber();
});
</script>

<style scoped>
.custom-app-bar {
  height: 79px !important; /* Set your desired height */
}

@media (min-width: 992px) {
  .box-froms {
    margin-left: 150px;
    margin-right: 150px;
  }
}
</style>
