<!-- eslint-disable no-unused-vars -->
<template>
  {{ props.index }}

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
                v-model="item_input.email"
                variant="outlined"
                placeholder="Email"
                :rules="rules_valid.email"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters dense>
            <v-col>
              <h4>User type</h4>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="item_input.memberTypeId"
                variant="outlined"
                density="compact"
                disabled
                :loading="loading.memberType"
                :items="selected_items.memberType"
                :rules="rules_valid.memberType"
                placeholder="User type"
                item-title="name"
                item-value="id"
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters dense>
            <v-col>
              <h4>Company</h4>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="item_input.companyId"
                variant="outlined"
                density="compact"
                :disabled="loading.comapanies"
                :loading="loading.comapanies"
                :items="selected_items.comapanies"
                :rules="rules_valid.comapanies"
                placeholder="Company"
                item-title="name_th"
                item-value="id"
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters dense>
            <v-col>
              <h4>Role</h4>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="item_input.roleId"
                variant="outlined"
                density="compact"
                placeholder="Role"
                :disabled="loading.role"
                :loading="loading.role"
                :items="selected_items.role"
                :rules="rules_valid.role"
                item-title="name"
                item-value="id"
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters dense>
            <v-col>
              <h4>Team</h4>
            </v-col>
            <v-col cols="12">
              <v-select
                v-if="selected_items.teamComp.length > 0"
                variant="outlined"
                density="compact"
                placeholder="Team"
                :disabled="loading.team"
                :loading="loading.team"
                :items="selected_items.teamComp"
                :rules="rules_valid.team"
                v-model="item_input.teamId"
                item-title="name_th"
                item-value="id"
              ></v-select>
              <v-text-field
                v-else
                variant="outlined"
                v-model="item_input.teamId"
                placeholder="Team"
                :rules="rules_valid.team"
                required
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters dense v-if="props.index > -1">
            <v-col>
              <h4>Status</h4>
            </v-col>
            <v-col cols="12">
              <v-select
                variant="outlined"
                density="compact"
                placeholder="Team"
                :items="selected_items.status"
                v-model="item_input.status"
                item-title="name"
                item-value="id"
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
          type="submit"
          rounded
          class="ma-2"
          color="secondary"
          :disabled="loading.submit"
          :loading="loading.submit"
          style="width: 100px"
                @click="handleSubmitEvent"

        >
          <strong>ตกลง</strong>
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import memberTypeService from "@/apis/MemberTypeService";
import roleService from "@/apis/RoleService";
import compnayService from "@/apis/CompnayService";
import teamService from "@/apis/TeamService";

import userService from "@/apis/UserService";
import { ref, reactive, onMounted, watch } from "vue";

import { useConfirmationDialog } from "@/components/dialogs/ConfirmationDialogService";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";

const emit = defineEmits(["is-title", "is-view"]);
const { handlingErrorsMessage } = useErrorHandlingDialog();
const { showDialog } = useConfirmationDialog();

const props = defineProps({
  index: {
    type: Number,
    default: -1,
  },
  item: {
    type: Object,
    default: () => {},
  },
});

const rules_valid = ref({
  email: [
    (v) => !!v || "กรุณากรอกข้อมูลให้ครบ",
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email format ไม่ถูกต้อง",
  ],
  memberType: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  comapanies: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  role: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  team: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
});
const loading = ref({
  submit: false,
  role: false,
  team: false,
  comapanies: false,
  memberType: false,
});
const selected_items = ref({
  role: [],
  comapanies: [],
  memberType: [],
  team: [],
  teamComp: [],
  status: [
    { id: 0, name: "Inactive" },
    { id: 1, name: "Active" },
  ],
});
const validateForm = ref(null);
const item_input = reactive({
  email: "",
  memberTypeId: 1,
  companyId: null,
  roleId: null,
  teamId: null,
  status: 0,
});

watch(
  () => item_input.companyId,
  (newValue) => {
    const fineTeam = selected_items.value.team.filter(
      (s) => s.company.id === newValue
    );
    selected_items.value.teamComp = [...fineTeam];
  }
);

onMounted(() => {
  if (props.index === -1) {
    emit("is-title", "Add User");
  } else {
    item_input.email = props.item?.email;
    item_input.memberTypeId = props.item?.member_type?.id;
    item_input.companyId = props.item?.team?.company?.id;
    item_input.roleId = props.item?.role?.id;
    item_input.teamId = props.item?.team?.name_th;
    item_input.status = props.item?.is_active ? 1 : 0;
    emit("is-title", "Edit User");
  }

  onLoadedCompaniesAll();
  onLoadedMemberTypeAll();
  onLoadedRoleAll();
  onLoadedTeamAll();
});

const onLoadedMemberTypeAll = async () => {
  try {
    loading.value.memberType = true;
    const response = await memberTypeService.getMemberTypeAll();
    if (response.data?.is_success) {
      selected_items.value.memberType = response.data.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.memberType = false;
  }
};
const onLoadedCompaniesAll = async () => {
  try {
    loading.value.comapanies = true;
    const response = await compnayService.getCompanyAll();
    if (response.data?.is_success) {
      selected_items.value.comapanies = response.data.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.comapanies = false;
  }
};
const onLoadedRoleAll = async () => {
  try {
    loading.value.role = true;
    const response = await roleService.getRoleAll();
    if (response.data?.is_success) {
      selected_items.value.role = response.data.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.role = false;
  }
};
const onLoadedTeamAll = async () => {
  try {
    loading.value.team = true;
    const response = await teamService.getTeamAll();
    if (response.data?.is_success) {
      selected_items.value.team = response.data.data;
    }
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return;
    }
    handlingErrorsMessage("unknown", e.message);
  } finally {
    loading.value.team = false;
  }
};

const handleCreatedTeam = async () => {
  try {
    const p_companyId = item_input.companyId;
    const p_nameTH = item_input.teamId;
    const p_nameEN = item_input.teamId;
    const response = await teamService.createdTeam(
      p_companyId,
      p_nameTH,
      p_nameEN
    );
    if (response.data?.is_success) {
      return response.data.data?.id;
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
const handleCreated = async () => {
  try {
    loading.value.submit = true;
    const v_Email = item_input.email;
    const v_MemberTypeId = item_input.memberTypeId;
    const v_RoleId = item_input.roleId;
    const v_TeamId =
      selected_items.value.teamComp.length > 0
        ? item_input.teamId
        : await handleCreatedTeam();
    if (v_TeamId) {
      const response = await userService.createdUser(
        v_Email,
        v_MemberTypeId,
        v_RoleId,
        v_TeamId
      );
      if (response) {
        handleDismissEvent();
      }
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
    const v_Email = item_input.email;
    const v_MemberTypeId = item_input.memberTypeId;
    const v_RoleId = item_input.roleId;
    const v_Status = item_input.status;
    const v_TeamId =
      selected_items.value.teamComp.length > 0
        ? item_input.teamId
        : handleCreatedTeam();
    const response = await userService.updatedUser(
      v_Email,
      v_MemberTypeId,
      v_RoleId,
      v_TeamId,
      v_Status
    );
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
