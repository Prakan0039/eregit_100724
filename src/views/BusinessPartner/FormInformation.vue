<template>
  <!-- <div> -->
    <div class="d-flex align-center justify-center">
      <h2 class="py-5">Change Information</h2>
    </div>
    <ChangeInfoAccount @on-data-update="handleAccount" v-if="props.IsAccount === '1'" />

    <ChangeInfoChangeName @on-data-update="handleChangeName" v-if="props.IsChangename === '2'" />

    <ChangeInfoBranch @on-data-update="handleChangeBranch" v-if="props.IsBrnch === '3'" />

    <ChangeInfoAddress @on-data-update="handleAddress" v-if="props.IsAddress === '4'" />

    <ChangeInfoContact @on-data-update="handleContact" v-if="props.IsContact === '5'" />
    <!-- <ChangeInfoBusiness v-if="IsBusiness" /> -->
  <!-- </div> -->
  <v-container>
    <!-- <ChangeInformationDetail @on-input-files="handleInputFiles" /> -->
    <v-row dense class="mb-5">
      <v-col cols="12">
    <h3>เอกสารเพิ่มเติม</h3>
    <v-card class="mt-5">
      <v-toolbar color="rgba(0, 0, 0, 0)">
        <v-toolbar-title></v-toolbar-title>
        <!-- <template v-slot:append>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        </template>-->
      </v-toolbar>
      <div class="pa-9">
        <ChooseMultiFiles
          :max-file="10"
          icon="mdi mdi-file-document"
          @input-files="handleInputFiles"
          @request-remove-file="handleFileRemoved"
        />
      </div>
    </v-card>
  </v-col>
</v-row>
  </v-container>

  <!-- <v-col cols="12" class="d-flex align-center justify-center">
    <ButtonControl text="ส่ง" @button-clicked="handleNext" />
  </v-col>-->
  
  <v-col cols="12" class="d-flex align-center justify-center">
    <ButtonControl
    style="min-width: 100px; height: 35px"
     text="ส่ง"
     @button-clicked="handleNext" />
  </v-col>
</template>

<script setup>
import { ref, defineProps } from "vue";
import ButtonControl from "@/components/controls/ButtonControl.vue";
import ChangeInformationDetail from "@/components/forms/partnerlist/Info-uploadfile.vue";
import ChooseMultiFiles from "../../components/forms/ChooseMultiFiles.vue";

import ChangeInfoAddress from "@/components/forms/partnerlist/info-address.vue";
// import ChangeInfoBusiness from "@/components/forms/partnerlist/info-business.vue";

import ChangeInfoChangeName from "@/components/forms/partnerlist/InfoChangeName.vue";
import ChangeInfoContact from "@/components/forms/partnerlist/info-contact.vue";

import ChangeInfoBranch from "@/components/forms/partnerlist/InfoAddBranch.vue";
import ChangeInfoAccount from "@/components/forms/partnerlist/info-account.vue";

const itemUpdate = ref({
  info_account: null,
  info_change_name: null,
  info_barnch: null,
  info_adress: null,
  info_contact: null,
  file_update: []
});

const emit = defineEmits([
  "on-button-ok-click",
  "on-input-files",
  "remove-file"
]);
const props = defineProps({
  IsAccount: {
    type: String,
    default: ""
  },
  IsChangename: {
    type: String,
    default: ""
  },
  IsBrnch: {
    type: String,
    default: ""
  },
  IsAddress: {
    type: String,
    default: ""
  },

  IsContact: {
    type: String,
    default: ""
  }
});

const handleFileRemovalRequest = files => {
  emit("remove-file", files);
};

const handleInputFiles = files => {
  emit("on-input-files", files);
};

const handleAccount = data => {
  itemUpdate.value.info_account = data;
  // console.log("handleAccount",data);
};

const handleChangeName = data => {
  itemUpdate.value.info_change_name = data;
  // console.log("handleChangeName",data);
};

const handleChangeBranch = data => {
  itemUpdate.value.info_barnch = data;
  // console.log("handleChangeBranch",data);
};

const handleAddress = data => {
  itemUpdate.value.info_adress = data;
  // console.log("handleAddress",data);
};

const handleContact = data => {
  itemUpdate.value.info_contact = data;
  console.log("handleContact", data);
};

// const handleInputFiles = (files) => {
//   itemUpdate.value.file_update = files;
//   // emit("on-input-files", files);
// };

const handleNext = () => {
  emit("on-button-ok-click", itemUpdate.value);
  // emit("on-input-files", files);
};
</script>
