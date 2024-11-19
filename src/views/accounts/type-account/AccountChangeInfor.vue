<template>
  <v-container fuild>
    <div >
      <v-app-bar class="custom-app-bar" v-if="itemsFileDocument.length > 0">
        <AttachedMenat
          :items="itemsFileDocument"
          class="mb-9"
          @on-attach-file="handleAttchFiles"
          app
        />
      </v-app-bar>
      <div class="d-flex justify-end mb-5 mt-5">
        <!-- <ButtonControl
          icon="mdi mdi-file-document"
          class="mr-2"
          text="ขอเอกสารเพิ่มเติม"
          @click="handleSwitchToRewwuestDoc"
        /> -->
        <ButtonControl
          @click="handleOnDaftSave"
          icon="mdi mdi-content-save-cog"
          text="Save Daft"
        />
      </div>

      <div v-show="is_id_form === FORM_ID.REQUEST_DOCS">
        <RequestDocument
          @on-back="handleReqDocumentBack"
          @on-commit-data="handleReqDocumentCommit"
        />
      </div>

      <div v-show="is_id_form === FORM_ID.CHANGE_INFO">
        <v-form ref="formChangeInfo">
          <bank-account
            v-if="isBankInfo"
            v-for="(
              item, index
            ) in dataChangeInfoRequest.change_bank_information"
            :key="index"
            :index="index"
            :partner-name="item.business_partner_name"
            :partner-number="item.business_partner_number"
            :account-name="item.bank_account_name"
            :account-holder="item.bank_account_holder"
            :bank-key="item.bank?.bank_key"
            :re-mark="item.remark"
            :bank-id="item.bank?.id"
            :bank-branch="item.bank_branch"
            @on-update="handleBankAccountUpdate"
          />
          <add-branch
            v-if="isAddBranchInfo"
            v-for="(
              item, index
            ) in dataChangeInfoRequest.add_branch_information"
            :key="index"
            :index="index"
            :add-branch-info="item"
            @on-data-update="handleBranchUpdate"
          />
          <change-address
            v-if="isChangeAddressInfo"
            v-for="(
              item, index
            ) in dataChangeInfoRequest.change_address_information"
            :key="index"
            :index="index"
            :change-address="item"
            @on-data-update="handleAddressUpdate"
          />
          <change-name
            v-if="isChangeNameInfo"
            v-for="(
              item, index
            ) in dataChangeInfoRequest.change_name_information"
            :key="index"
            :index="index"
            :change-name-infomation="item"
            @on-data-update="handleChangeName"
          />
          <contact-information
            v-if="isChangeContactInfo"
            v-for="(
              item, index
            ) in dataChangeInfoRequest.change_contact_information"
            :key="index"
            :index="index"
            :contact="item"
            @on-data-update="handleItemsContactUpdate"
          />
          <div class="d-flex justify-center">
            <ButtonControl
              @click="handleOnClick"
              icon="mdi mdi-content-save-cog"
              text="บันทึก"
            />
          </div>
        </v-form>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import PartnerServive from "@/apis/PartnerServive";
import RequestDocument from "@/components/forms/accounts/RequestDocument.vue";
import AttachedMenat from "@/components/forms/accounts/AttachedMenat.vue";
import ButtonControl from "@/components/controls/ButtonControl.vue";
import BankAccount from "@/components/forms/accounts/extend-action/BankAccount.vue";
import AddBranch from "@/components/forms/accounts/extend-action/AddBranch.vue";
import ChangeAddress from "@/components/forms/accounts/extend-action/ChangeAddress.vue";
import ChangeName from "@/components/forms/accounts/extend-action/ChangeName.vue";
import ContactInformation from "@/components/forms/accounts/extend-action/ContactInformation.vue";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Enum from "@/utils/enum.util";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";

const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();

const router = useRouter();
const route = useRoute();

const form_number = route.query.form_number;
const dataChangeInfoRequest = ref({});
const attachFiles = ref([]);
const itemsFileDocument = ref([]);
const FORM_ID = {
  CHANGE_INFO: 0,
  REQUEST_DOCS: 1,
};

const is_id_form = ref(FORM_ID.CHANGE_INFO);
const formChangeInfo = ref(null);

onMounted(async () => {
  await getChangeInfomationRequestByFormNumber();
  await getUploadDocumentByFormNumber();
});

const getUploadDocumentByFormNumber = async () => {
  try {
    const response = await PartnerServive.getUploadDocumentByFormNumber(
      form_number
    );
    if (response.data?.is_success) {
      itemsFileDocument.value = response.data.data.map((el) => {
        return {
          file: null,
          file_name: el.document_name,
          file_size: "no available",
        };
      });
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      console.log(
        val.message ?? "Error",
        val?.data?.error ?? "some thing error"
      );
      return;
    }
    console.log("unknown", e.message);
  }
};

const isBankInfo = computed(() => {
  if (dataChangeInfoRequest.value.changed_part)
    return dataChangeInfoRequest.value.changed_part.some(
      (el) => el.id == Enum.ChangePartForm.BANK_INFO
    );
  return false;
});

const isAddBranchInfo = computed(() => {
  if (dataChangeInfoRequest.value.changed_part)
    return dataChangeInfoRequest.value.changed_part.some(
      (el) => el.id == Enum.ChangePartForm.ADD_BRANCH
    );
  return false;
});

const isChangeAddressInfo = computed(() => {
  if (dataChangeInfoRequest.value.changed_part)
    return dataChangeInfoRequest.value.changed_part.some(
      (el) => el.id == Enum.ChangePartForm.ADDRESS_INFO
    );
  return false;
});

const isChangeNameInfo = computed(() => {
  if (dataChangeInfoRequest.value.changed_part)
    return dataChangeInfoRequest.value.changed_part.some(
      (el) => el.id == Enum.ChangePartForm.NAME_INFO
    );
  return false;
});

const isChangeContactInfo = computed(() => {
  if (dataChangeInfoRequest.value.changed_part)
    return dataChangeInfoRequest.value.changed_part.some(
      (el) => el.id == Enum.ChangePartForm.CONTACT_INFO
    );
  return false;
});

const handleAttchFiles = (item_files) => {
  attachFiles.value = item_files;
};

const itemsChangeInfo = ref({
  change_bank_information: [],
  change_name_information: [],
  add_branch_information: [],
  change_address_information: [],
  change_contact_information: [],
});

const handleBankAccountUpdate = (dataUpdated) => {
  const { index, newValue } = dataUpdated;
  itemsChangeInfo.value.change_bank_information[index] = newValue;
};

const handleChangeName = (dataUpdated) => {
  const { index, newValue } = dataUpdated;
  itemsChangeInfo.value.change_name_information[index] = newValue;
  console.log(JSON.stringify(itemsChangeInfo.value.change_name_information));
};

const handleBranchUpdate = (dataUpdated) => {
  const { index, newValue } = dataUpdated;
  itemsChangeInfo.value.add_branch_information[index] = newValue;
};

const handleAddressUpdate = (dataUpdated) => {
  const { index, newValue } = dataUpdated;
  itemsChangeInfo.value.change_address_information[index] = newValue;
};

const handleItemsContactUpdate = (dataUpdated) => {
  const { index, newValue } = dataUpdated;
  itemsChangeInfo.value.change_contact_information[index] = newValue;
};

const getChangeInfomationRequestByFormNumber = async () => {
  try {
    const response =
      await PartnerServive.getChangeInfomationRequestByFormNumber(form_number);
    if (response.data?.is_success) {
      dataChangeInfoRequest.value = response.data?.data;
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

const handleSwitchToRewwuestDoc = () => {
  is_id_form.value = FORM_ID.REQUEST_DOCS;
};

const handleReqDocumentBack = () => {
  is_id_form.value = FORM_ID.CHANGE_INFO;
};

const handleReqDocumentCommit = () => {
  is_id_form.value = FORM_ID.CHANGE_INFO;
};

const handleOnDaftSave = async () => {
  const is_valid = await formChangeInfo.value.validate();
  console.log(is_valid["valid"]);
  if (is_valid && !is_valid["valid"]) return;
  if (
    await showDialog(
      "ยืนยันการบันถึงข้อมูล ?",
      "การ save daft งานของคุณจะไปอยู่ใน daft\nคลิกปุ่ม ตกลง เพื่อดำเนินการ"
    )
  ) {
    const payloadDraft = {
      form_number: dataChangeInfoRequest.value.form_number,
      changed_part_id: dataChangeInfoRequest.value.changed_part
        .map((el) => el.id)
        .join(","),
      change_bank_information:
        itemsChangeInfo.value.change_bank_information.map((el) => {
          return {
            business_partner_number: el.partner_number,
            business_partner_name: el.partner_name,
            bank_account_name: el.bank_account,
            bank_id: Number(el.bank_id),
            bank_key: el.bank_key,
            bank_account_holder: el.account_holder,
            bank_branch: el.bank_branch,
            bank_account_number: el.bankAccoutNumber,
            remark: el.remark,
          };
        }),
      change_name_information:
        itemsChangeInfo.value.change_name_information.map((el) => {
          return {
            business_partner_number: el.partner_number,
            name_th: el.new_name_th_1,
            name1_th: el.new_name_th_1,
            name2_th: el.new_name_th_2,
            name3_th: el.new_name_th_3,
            name4_th: el.new_name_th_4,
            search_term1_th: el.new_search_term_th,
            name_en: el.new_name_en_1,
            name1_en: el.new_name_en_1,
            name2_en: el.new_name_en_2,
            name3_en: el.new_name_en_3,
            name4_en: el.new_name_en_4,
            search_term1_en: el.new_search_term_en,
          };
        }),
      add_branch_information: itemsChangeInfo.value.add_branch_information.map(
        (el) => {
          return {
            business_partner_number: el.partner_number,
            branch_code: el.branch_code,
            branch_description: el.branch_description,
            business_partner_role: el.role,
            name1_th: el.name_1_th,
            name2_th: el.name_2_th,
            name3_th: el.name_3_th,
            name4_th: el.name_4_th,
            search_term1_th: el.search_term_1_th,
            address_th: el.address_1_th,
            address1_th: el.address_2_th,
            address2_th: el.address_3_th,
            province_th: el.addressTh?.province,
            district_th: el.addressTh?.district,
            subdistrict_th: el.addressTh?.parish,
            postal_code_th: el.addressTh?.zip_code,
            name1_en: el.name_1_en,
            name2_en: el.name_2_en,
            name3_en: el.name_3_en,
            name4_en: el.name_4_en,
            search_term1_en: el.search_term_1_en,
            address_en: el.address_1_en,
            address1_en: el.address_2_en,
            address2_en: el.address_3_en,
            province_en: el.addressEn?.province,
            district_en: el.addressEn?.district,
            subdistrict_en: el.addressEn?.parish,
            postal_code_en: el.addressEn?.zip_code,
            country: "TH",
          };
        }
      ),
      change_address_information:
        itemsChangeInfo.value.change_address_information.map((el) => {
          return {
            business_partner_number: el.partner_number,
            branch_code: el.branch_code,
            branch_description: el.branch_description,
            business_partner_role: el.business_partner_role,
            name1_th: el.name_1_th,
            name2_th: el.name_2_th,
            name3_th: el.name_3_th,
            name4_th: el.name_4_th,
            search_term1_th: el.search_term1_th,
            address_th: el.address_1_th,
            address1_th: el.address_2_th,
            address2_th: el.address_3_th,
            province_th: el.addressTh?.province,
            district_th: el.addressTh?.district,
            subdistrict_th: el.addressTh?.parish,
            postal_code_th: el.addressTh?.zip_code,
            name1_en: el.name_1_en,
            name2_en: el.name_2_en,
            name3_en: el.name_3_en,
            name4_en: el.name_4_en,
            search_term1_en: el.search_term1_en,
            address_en: el.address_1_en,
            address1_en: el.address_2_en,
            address2_en: el.address_3_en,
            province_en: el.addressEn?.province,
            district_en: el.addressEn?.district,
            subdistrict_en: el.addressEn?.parish,
            postal_code_en: el.addressEn?.zip_code,
            country: "TH",
            created_at: new Date(),
            created_user_id: 187,
            updated_at: new Date(),
            updated_user_id: 1,
          };
        }),
      change_contact_information:
        itemsChangeInfo.value.change_contact_information.map((el) => {
          return {
            business_partner_number: el.partner_number,
            branch_code: el.branch_code,
            business_partner_name: el.partner_name,
            name: el.contact_name,
            mobile_number: el.telephone,
            email: el.email,
            remark: el.remark,
          };
        }),
    };

    if (await onSaveDraftChangeInfomation(payloadDraft)) {
      router.push({
        name: "AccountManagement",
        query: { path: "DaftTask" },
      });
    }
  }
};

const handleOnClick = async () => {
  const is_valid = await formChangeInfo.value.validate();
  console.log(is_valid["valid"])
  if (is_valid && !is_valid["valid"]) return;
  if (
    await showDialog(
      "ยืยยันการแก้ไขข้อมูล ?",
      "กรุณาตรวจสอบข้อมูล คุณไม่สามารถแก้ไขได้แล้ว\nคลิกปุ่ม ตกลง เพื่อดำเนินการ"
    )
  ) {
    
    const payloadSave = {
      form_number: dataChangeInfoRequest.value.form_number,
      changed_part_id: dataChangeInfoRequest.value.changed_part
        .map((el) => el.id ?? null)
        .join(","),
      change_bank_information:
        itemsChangeInfo.value.change_bank_information.map((el) => {
          return {
            business_partner_number: el.partner_number,
            business_partner_name: el.partner_name,
            bank_account_name: el.bank_account,
            bank_id: Number(el.bank_id),
            bank_key: el.bank_key,
            bank_account_holder: el.account_holder,
            bank_branch: el.bank_branch,
            bank_account_number: el.bankAccoutNumber,
            remark: el.remark,
          };
        } ) ,
      change_name_information:
        itemsChangeInfo.value.change_name_information.map((el) => {
          return {
            business_partner_number: el.partner_number,
            name_th: el.new_name_th_1,
            name1_th: el.new_name_th_1,
            name2_th: el.new_name_th_2,
            name3_th: el.new_name_th_3,
            name4_th: el.new_name_th_4,
            search_term1_th: el.new_search_term_th,
            name_en: el.new_name_en_1,
            name1_en: el.new_name_en_1,
            name2_en: el.new_name_en_2,
            name3_en: el.new_name_en_3,
            name4_en: el.new_name_en_4,
            search_term1_en: el.new_search_term_en,
          };
        }),
      add_branch_information: itemsChangeInfo.value.add_branch_information.map(
        (el) => {
          return {
            business_partner_number: el.partner_number,
            branch_code: el.branch_code,
            branch_description: el.branch_description,
            business_partner_role: el.role,
            name1_th: el.name_1_th,
            name2_th: el.name_2_th,
            name3_th: el.name_3_th,
            name4_th: el.name_4_th,
            search_term1_th: el.search_term1_th,
            address_th: el.address_1_th,
            address1_th: el.address_2_th,
            address2_th: el.address_3_th,
            province_th: el.addressTh?.province,
            district_th: el.addressTh?.district,
            subdistrict_th: el.addressTh?.parish,
            postal_code_th: el.addressTh?.zip_code,
            name1_en: el.name_1_en,
            name2_en: el.name_2_en,
            name3_en: el.name_3_en,
            name4_en: el.name_4_en,
            search_term1_en: el.search_term1_en,
            address_en: el.address_1_en,
            address1_en: el.address_2_en,
            address2_en: el.address_3_en,
            province_en: el.addressEn?.province,
            district_en: el.addressEn?.district,
            subdistrict_en: el.addressEn?.parish,
            postal_code_en: el.addressEn?.zip_code,
            country: "TH",
          };
        }
      ),
      change_address_information:
        itemsChangeInfo.value.change_address_information.map((el) => {
          return {
            business_partner_number: el.partner_number,
            branch_code: el.branch_code,
            branch_description: el.branch_description,
            business_partner_role: el.business_partner_role,
            name1_th: el.name_1_th,
            name2_th: el.name_2_th,
            name3_th: el.name_3_th,
            name4_th: el.name_4_th,
            search_term1_th: el.search_term1_th,
            address_th: el.address_1_th,
            address1_th: el.address_2_th,
            address2_th: el.address_3_th,
            province_th: el.addressTh?.province,
            district_th: el.addressTh?.district,
            subdistrict_th: el.addressTh?.parish,
            postal_code_th: el.addressTh?.zip_code,
            name1_en: el.name_1_en,
            name2_en: el.name_2_en,
            name3_en: el.name_3_en,
            name4_en: el.name_4_en,
            search_term1_en: el.search_term1_en,
            address_en: el.address_1_en,
            address1_en: el.address_2_en,
            address2_en: el.address_3_en,
            province_en: el.addressEn?.province,
            district_en: el.addressEn?.district,
            subdistrict_en: el.addressEn?.parish,
            postal_code_en: el.addressEn?.zip_code,
            country: "TH",
            created_at: new Date(),
            created_user_id: 187,
            updated_at: new Date(),
            updated_user_id: 1,
          };
        }),
      change_contact_information:
        itemsChangeInfo.value.change_contact_information.map((el) => {
          return {
            business_partner_number: el.partner_number,
            branch_code: el.branch_code,
            business_partner_name: el.partner_name,
            name: el.contact_name,
            mobile_number: el.telephone,
            email: el.email,
            remark: el.remark,
          };
        }),
    };

    if (await onSaveChangeInfomation(payloadSave)) {
      router.push({
        name: "AccountManagement",
        query: { path: "ExportTask" },
      });
    }
  }
};

const onSaveChangeInfomation = async (payloadSave) => {
  try {
    const response = await PartnerServive.saveChangInfomation(payloadSave);
    if (response.data?.is_success) {
      return true;
    }
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

const onSaveDraftChangeInfomation = async (payloadSave) => {
  try {
    const response = await PartnerServive.saveDraftChangInfomation(payloadSave);
    if (response.data?.is_success) {
      return true;
    }
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
</script>

<style>
.custom-app-bar {
  height: 79px !important;
}
</style>
