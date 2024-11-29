<template>
  {{ props.index }}
  <!-- {{  props.item?.is_active }} -->
  <div id="form-user">
    <v-form v-model="validateForm" @submit.prevent="handleSubmitEvent">
      <v-card class="elevation-1">
        <v-card-text>
          <v-row no-gutters dense>
            <v-col>
              <h4>Email</h4>
            </v-col>
            <v-col cols="12">
              <v-text-field
                variant="outlined"
                v-model="input_data.email"
                placeholder="Email"
                :rules="rules_valid.email"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters dense>
            <v-col>
              <h4>Role</h4>
            </v-col>
            <v-col cols="12">
              <v-select
                variant="outlined"
                v-model="input_data.role"
                :disabled="loading.role"
                :loading="loading.role"
                density="compact"
                placeholder="Role"
                :items="roles_items_selection"
                item-title="name"
                item-value="id"
              ></v-select>
              <!--  -->
              <!-- <v-text-field variant="outlined" v-model="form.role" placeholder="role"
              :rules="[(v) => !!v || 'Role is required']" required density="compact"></v-text-field>-->
            </v-col>
          </v-row>

          <v-row no-gutters densec v-if="props.index > -1">
            <v-col>
              <h4>Status</h4>
            </v-col>
            <v-col cols="12">
              <v-select
                variant="outlined"
                v-model="input_data.status"
                density="compact"
                :items="status_items_selection"
                item-title="title"
                item-value="value"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div class="text-center mt-5">
        <v-btn
          rounded
          class="ma-2"
          color="black"
          style="width: 100px"
          :disabled="loading.submit"
          @click="handleDismissEvent"
        >
          <strong>ยกเลิก</strong>
        </v-btn>
        <v-btn
          rounded
          class="ma-2"
          color="secondary"
          style="width: 100px"
          :disabled="loading.submit"
          :loading="loading.submit"
          @click="handleSubmitEvent"
        >
          <strong>ตกลง</strong>
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from "vue";

import roleService from "@/apis/RoleService";
import UserService from "@/apis/UserService";
import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import PartnerServive from "@/apis/PartnerServive";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();

const status_items_selection = [
  { value: true, title: "Active" },
  { value: false, title: "InActive" }
];
const validateForm = ref(null);

const emit = defineEmits(["is-view"]);
const loading = ref({
  submit: false,
  role: false,
  team: false,
  comapanies: false,
  memberType: false
});
const props = defineProps({

  item: {
    type: Object,
    default: () => {}
  },
  index: {
    type: Number,
    default: -1,
  },
});

const form = ref(null);

const input_data = ref({
  email: "",
  role: "",
  status: ""
});

const roles_items_selection = ref("");

onBeforeMount(async () => {
  await onLoadedRoleAll();
  if (props.index === -1) {
    emit("is-title", "Add User");
  } else {
    input_data.email = props.item?.user?.email;
    input_data.role = props.item?.user?.email;
    input_data.status = props.item?.is_active ? 1 : 0;
    // item_input.memberTypeId = props.item?.member_type?.id;
    // item_input.companyId = props.item?.team?.company?.id;
    // item_input.roleId = props.item?.role?.id;
    // item_input.teamId = props.item?.team?.name_th;
    // item_input.status = props.item?.is_active ? 1 : 0;
    emit("is-title", "Edit Userll");
  }
});
watch(
  () => props.item,
  newItem => {
    if (newItem) {
      input_data.value.email = newItem?.user?.email || ""; // ตั้งค่าอีเมลจาก props
      // input_data.value.role = newItem?.role?.id || ""; // ตั้งค่า role จาก props
      input_data.value.status = newItem?.is_active ?? ""; // ตั้งค่า status
    }
  },
  { immediate: true }
); // ทำงานทันทีเมื่อคอมโพเนนต์โหลด
const rules_valid = ref({
  email: [
    v => !!v || "กรุณากรอกข้อมูลให้ครบ",
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email format ไม่ถูกต้อง"
  ],
  memberType: [v => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  role: [v => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  team: [v => !!v || "กรุณากรอกข้อมูลให้ครบ"]
});

const onLoadedRoleAll = async () => {
  try {
    const response = await roleService.getRoleAll();
    if (response.data?.is_success) {
      roles_items_selection.value = response.data.data;
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

// const onFatchUserById = async (id) => {
//   try {
//    const response = await UserService.getUserById(id);
//     if (response.data?.is_success) {
//       console.log(JSON.stringify(response.data?.data))
//     }
//   } catch (e) {
//  if (e.response) {
//       const val = e.response.data;
//       handlingErrorsMessage(val.message, val?.data.error);
//       return;
//     }
//     handlingErrorsMessage("unknown", e.message);
//   }
// };

const handleCreated = async () => {
  try {
    loading.value.submit = true;
    const v_Email = input_data.email;
    const v_Role = input_data.role;

    const response = await PartnerServive.createPartnerMember(v_Email, v_Role);
    if (response) {
      handleDismissEvent();
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.submit = false;
  }
};

const handleUpdated = async () => {
  try {
    loading.value.submit = true;
    const v_Email = input_data.email;
    const v_RoleId = input_data.role;
    const v_Status = input_data.status;
    const response = await PartnerServive.updatePartnerMember(v_Email, v_RoleId, v_Status);
    if (response) {
      handleDismissEvent();
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.submit = false;
  }
};

// const handleSubmitEvent = async (e) => {
//   e.preventDefault();
//   if (form.value && form.value.validate()) {
//     // Form is valid, you can perform further actions
//     console.log("Form is valid");
//   } else {
//     // Form is not valid, handle accordingly
//     console.log("Form is not valid");
//   }
// };

const handleDismissEvent = () => {
  emit("is-view", "user-main");
  
};

const handleSubmitEvent = async () => {
  if (validateForm.value) {
    const confirmed = await showDialog(
      "ยืนยันการเพิ่มบัญชี ?",
      "การุณาตรวจสอบ\nคลิกปุ่มตกลงเพื่อดำเนินการ"
    );
    if (confirmed) {
      if (props.index === -1) {
        handleCreated();
      } else {
        handleUpdated();
      }
    } else {
      console.log("Action cancelled.");
    }
  }
};
</script>
