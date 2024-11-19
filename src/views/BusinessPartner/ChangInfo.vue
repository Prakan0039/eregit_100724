<template>
  <div>
    <ChangeInformation
      v-if="current_view === 1"
      :DataInfo="businessPartnerChangInfo"
      @on-next="handle_update_step"
      @on-input-item-contact="handleInputItemsContact"
    />
    <v-form ref="formChangeInfo">
    <FormInformation
      v-if="current_view === 2"
      :IsAccount="options.selectedBank"
      :IsChangename="options.selectedChangeName"
      :IsBrnch="options.selectedBranch"
      :IsAddress="options.selectedAddress"
      :IsContact="options.selectedContact"
      @on-button-ok-click="handleFormInformationCommit"
      @on-input-files="handleInputDocuments"
      @remove-file="handleFileRemoved"
    />
    </v-form>

    <!-- <ChooseMultiFiles
    :max-file="10"
    icon="mdi mdi-file-document"
    @input-files="handleInputFiles"
    @request-remove-file="handleFileRemoved"
    />-->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import ChangeInformation from "@/components/forms/partnerlist/SelectChangInfo.vue";
import FormInformation from "./FormInformation.vue";
import { useRoute, useRouter } from "vue-router";
import PartnerServive from "@/apis/PartnerServive";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import ShowDialog from "@/components/dialogs/ConfirmDialog.vue";
const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();

// const router = useRouter();
const router = useRouter();
const route = useRoute();
const createDocumentBody = ref([]);
const businessPartnerChangInfo = ref({});
const bp_number = route.query.bp_number;
const items_contects = ref([]);
let current_view = ref(1);
let options = reactive({
  selectedBank: "",
  selectedChangeName: "",
  selectedBranch: "",
  selectedAddress: "",
  selectedContact: "",
  scope: "",
  vendorDetails: "",
});
const formChangeInfo = ref(null);

// Capture emitted items_contects from ChangeInformation
const handleInputItemsContact = (newItemsContects) => {
  items_contects.value = newItemsContects;
  console.log("items_contects.value", items_contects.value);
};

onMounted(async () => {
  await getBusinessPartnerInfo(bp_number);
});

const handleFileRemoved = async (documents) => {
  createDocumentBody.value = [];
  dataBodyChangInfo.value.partnerDocs = documents;
  for (
    let index = 0;
    index < dataBodyChangInfo.value.partnerDocs.length;
    index++
  ) {
    const el = dataBodyChangInfo.value.partnerDocs[index];
    if (
      !createDocumentBody.value.some((doc) => doc.document_name === el.name)
    ) {
      const base64String = await encodeFile(el);
      createDocumentBody.value.push({
        document_name: el.name,
        data: base64String.split(",")[1],
      });
    }
  }
};

const handleInputDocuments = async (documents) => {
  createDocumentBody.value = [];
  dataBodyChangInfo.value.partnerDocs = documents;
  for (
    let index = 0;
    index < dataBodyChangInfo.value.partnerDocs.length;
    index++
  ) {
    const el = dataBodyChangInfo.value.partnerDocs[index];
    if (
      !createDocumentBody.value.some((doc) => doc.document_name === el.name)
    ) {
      const base64String = await encodeFile(el);
      createDocumentBody.value.push({
        document_name: el.name,
        data: base64String.split(",")[1],
      });
    }
  }
};

const encodeFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsDataURL(file);
  });
};

const onCreatePartnerDocumentUploads = async () => {
  try {
    const response = await PartnerServive.createUploadDocuments(
      route.query.bp_number,
      createDocumentBody.value,
      console.log(createDocumentBody.value)
    );
    if (response.data.is_success) return true;
    return false;
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return false;
    }
    handlingErrorsMessage("unknown", e.message);
    return false;
  }
};
const getBusinessPartnerInfo = async (bp_number) => {
  try {
    const response = await PartnerServive.getBusinessPartnerChangInfo(
      bp_number
    );
    if (response.data?.is_success) {
      businessPartnerChangInfo.value = response.data.data;
      console.log("infodata", businessPartnerChangInfo.value);
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
const handle_update_step = (option_items) => {
  options = option_items;
  options.scope = option_items.scope;
  options.vendorDetails = option_items.vendorDetails;
  // console.log("options", options)
  current_view.value++;
};

const dataBodyChangInfo = ref({
  bp_number: null,
  changed_part_id: null,
  change_bank_information: [
    // {
    //   bank_account_name: null,
    //   bank_id: null,
    //   bank_branch: null,
    //   bank_account_number: null,
    //   remark: null,
    // },
  ],
  // items_contects: [],
  partnerDocs: {},
  change_name_information: [
    {
      name_th: null,
      name_en: null,
    },
  ],
  add_branch_information: [
    {
      branch_code: null,
      business_partner_role_id: null,
      address_th: null,
      province_th_id: null,
      district_th_id: null,
      subdistrict_th_id: null,
      postal_code_th_id: null,
      address_en: null,
      province_en: null,
      district_en: null,
      subdistrict_en: null,
      postal_code_en_id: null,
      country: null,
    },
  ],
  //mapping
  change_contact_information: [],

  change_address_information: [
    {
      branch_code: null,
      address_th: null,
      province_th_id: null,
      district_th_id: null,
      subdistrict_th_id: null,
      postal_code_th_id: null,
      address_en: null,
      province_en: null,
      district_en: null,
      subdistrict_en: null,
      postal_code_en_id: null,
      country: null,
    },
  ],
});
const handleFormInformationCommit = async (data) => {
  const is_valid = await formChangeInfo.value.validate();
  console.log(is_valid["valid"]);
  if (is_valid && !is_valid["valid"]) return;
  console.log("handleFormInformationCommit", data);
  dataBodyChangInfo.value.bp_number = route.query?.bp_number ?? null;
  dataBodyChangInfo.value.changed_part_id = options.scope;
  // if (data.info_account.items_contects) {
  //   dataBodyChangInfo.value.change_bank_information[0].bank_account_name =
  //     data.info_account.items_contects.account_name_en;

  //   dataBodyChangInfo.value.change_bank_information[0].bank_id =
  //     data.info_account.items_contects.bank;

  //   dataBodyChangInfo.value.change_bank_information[0].bank_branch =
  //     data.info_account.items_contects.branch_account;

  //   dataBodyChangInfo.value.change_bank_information[0].bank_account_number =
  //     data.info_account.items_contects.account_number;

  //   dataBodyChangInfo.value.change_bank_information[0].remark = "";
  // }

  // Map items_contects to change_bank_information
  // if (data.info_account.items_contects) {
  if (data.info_account) {
    console.log(
      "Mapping items_contects to change_bank_information:",
      data.info_account
    );
    dataBodyChangInfo.value.change_bank_information = data.info_account.map(
      (item) => ({
        bank_account_name: item.bank_account_name,
        bank_id: parseInt(item.bank_id, 10),
        bank_branch: item.bank_branch,
        bank_account_number: item.bank_account_number,
        remark: item.remark,
      })
    );
  }
  // }

  if (data.info_change_name) {
    dataBodyChangInfo.value.change_name_information[0].name_th =
      data.info_change_name.name_th;
    dataBodyChangInfo.value.change_name_information[0].name_en =
      data.info_change_name.name_en;
  }
  if (data.info_barnch) {
    dataBodyChangInfo.value.add_branch_information[0].branch_code =
      data.info_barnch.branch_code;

    dataBodyChangInfo.value.add_branch_information[0].business_partner_role_id =
      data.info_barnch.radio_1;
    dataBodyChangInfo.value.add_branch_information[0].address_th =
      data.info_barnch.address.th.address;

    //province
    dataBodyChangInfo.value.add_branch_information[0].province_th_id =
      data.info_barnch.address.th.info.province;

    dataBodyChangInfo.value.add_branch_information[0].district_th_id =
      data.info_barnch.address.th.info.district;

    dataBodyChangInfo.value.add_branch_information[0].subdistrict_th_id =
      data.info_barnch.address.th.info.parish;

    dataBodyChangInfo.value.add_branch_information[0].postal_code_th_id =
      data.info_barnch.address.th.info.zip_code;

    //provineEn
    dataBodyChangInfo.value.add_branch_information[0].address_en =
      data.info_barnch.address.en.address;

    dataBodyChangInfo.value.add_branch_information[0].province_en =
      data.info_barnch.address.en.info.province;

    dataBodyChangInfo.value.add_branch_information[0].district_en =
      data.info_barnch.address.en.info.district;

    dataBodyChangInfo.value.add_branch_information[0].subdistrict_en =
      data.info_barnch.address.en.info.parish;

    dataBodyChangInfo.value.add_branch_information[0].postal_code_en_id =
      data.info_barnch.address.th.info.zip_code;
  }
  //เปลี่ยนที่อยู่
  if (data.info_adress) {
    dataBodyChangInfo.value.change_address_information[0].branch_code =
      data.info_adress.branch_code;
    dataBodyChangInfo.value.change_address_information[0].address_th =
      data.info_adress.address.th.address;
    dataBodyChangInfo.value.change_address_information[0].province_th_id =
      data.info_adress.address.th.info.province;
    dataBodyChangInfo.value.change_address_information[0].district_th_id =
      data.info_adress.address.th.info.district;
    dataBodyChangInfo.value.change_address_information[0].subdistrict_th_id =
      data.info_adress.address.th.info.parish;
    dataBodyChangInfo.value.change_address_information[0].postal_code_th_id =
      data.info_adress.address.th.info.zip_code;
    dataBodyChangInfo.value.change_address_information[0].address_en =
      data.info_adress.address.en.address;
    dataBodyChangInfo.value.change_address_information[0].province_en =
      data.info_adress.address.en.info.province;
    dataBodyChangInfo.value.change_address_information[0].district_en =
      data.info_adress.address.en.info.district;
    dataBodyChangInfo.value.change_address_information[0].subdistrict_en =
      data.info_adress.address.en.info.parish;
    dataBodyChangInfo.value.change_address_information[0].postal_code_en_id =
      data.info_adress.address.th.info.zip_code;
    dataBodyChangInfo.value.change_address_information[0].country = "";
  }
  if (data.info_contact) {
    console.log(
      "Mapping info_contact:",
      data.info_contact.change_contact_information
    );

    // ตรวจสอบว่า info_contact เป็น object และมีอาเรย์ change_contact_information
    if (
      data.info_contact &&
      Array.isArray(data.info_contact.change_contact_information)
    ) {
      dataBodyChangInfo.value.change_contact_information =
        data.info_contact.change_contact_information.map((item) => ({
          branch_code: item.branch_code?.trim() || "", // ใช้ trim() เพื่อลบช่องว่างถ้ามี
          business_partner_name: item.business_partner_name?.trim() || "",
          name: item.name?.trim() || "",
          mobile_number: item.mobile_number?.trim() || "",
          email: item.email?.trim() || "",
          remark: item.remark?.trim() || "",
        }));
    } else {
      // หากไม่เป็นอาเรย์ อาจจะตั้งค่าเป็นอาเรย์ว่าง หรือจัดการตามความต้องการ
      dataBodyChangInfo.value.change_contact_information = [];
      console.warn("info_contact.change_contact_information is not an array");
    }
    // dataBodyChangInfo.value.change_contact_information[0].branch_code =
    //   data.info_contact.value.branch_code;

    // dataBodyChangInfo.value.change_contact_information[0].business_partner_name =
    //   data.info_contact.value.business_partner_name;

    // dataBodyChangInfo.value.change_contact_information[0].mobile_number;
    // data.info_contact.value.email;

    // dataBodyChangInfo.value.change_contact_information[0].remark = "";
  }
      const confirmed = await showDialog(
      "ยืยยันการแก้ไขข้อมูล ?",
      "กรุณาตรวจสอบข้อมูล คุณไม่สามารถกลับมาแก้ไขได้อีก\nคลิกปุ่ม ตกลง เพื่อดำเนินการ"
    );

    if (!confirmed) return;

  try {
    // for (let i = 0; i < dataBodyChangInfo.value.items_contects.length; i++) {
    //   const el = dataBodyChangInfo.value.items_contects[i];
    //   dataBodyChangInfo.value[`account_name_en_${i + 1}`] =
    //   el.account_name_en;

    //   dataBodyChangInfo.value[`branch_account_${i + 1}`] =
    //   el.branch_account;

    //   dataBodyChangInfo.value[`account_number_${i + 1}`] =
    //     el.account_number;

    //   dataBodyChangInfo.value[`bank_${i + 1}`] =
    //     el.bank;
    // }
    console.log("dataBodyChangInfo.value", dataBodyChangInfo.value);
    const response = await PartnerServive.createChangInfo(
      dataBodyChangInfo.value
    );
    if (response.data?.is_success) {
      
  if (createDocumentBody.value.length > 0) {
    await onCreatePartnerDocumentUploads();
    // window.alert(response.data.message);
    router.push({
      path: "/BusinessPartner/BusinessPartnerList",
    }).then(() => {

      window.scrollTo(0, 0);
    });
  } else {
    console.log("Not onCreatePartnerDocumentUploads");
    router.push({
      path: "/BusinessPartner/BusinessPartnerList",
    }).then(() => {

      window.scrollTo(0, 0);
    });
  }
  // handleToComapnyProfile(response.data.data?.form_number);
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
</script>

<style scoped>
:deep(.v-field) {
  border-radius: 10px !important;
  border: 1px solid #ededed !important;
  -webkit-border-radius: 10px !important;
  -moz-border-radius: 10px !important;
  -ms-border-radius: 10px !important;
  -o-border-radius: 10px !important;
}
</style>
