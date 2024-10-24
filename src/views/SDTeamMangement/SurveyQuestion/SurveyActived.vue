<template>
  <v-container>
    <v-card class="pt-5">
      <v-radio-group v-model="selected">
        <template v-slot:label>
          <div><strong class="mt-6">Active กิจกรรมนี้เมื่อใด</strong></div>
        </template>

        <v-radio value="now">
          <template v-slot:label>
            <div class="pa-1">
              <strong class="text-black">Active ตอนนี้</strong>
            </div>
          </template>
        </v-radio>

        <v-radio value="selected" class="pa-0">
          <template v-slot:label>
            <div style="width: 500px">
              <v-row dense align="left">
                <v-col cols="3" align-self="center">
                  <strong class="text-black">Active วันที่ </strong>
                </v-col>
                <v-col cols="9" align-self="center">
                  <DatePickerControl
                    :disabled="selected === 'now'"
                    :date="selectedActiveDate"
                    @date="selectedActiveDate = $event"
                  />
                </v-col>
              </v-row>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card>
  </v-container>
</template>

<script setup>
import DatePickerControl from "@/components/controls/DatePickerControl.vue";
import { ref, watch } from "vue";
const selected = ref("now");
const currDate = new Date();
// currDate.setDate(currDate.getDate() + 1);

// Format the date to DD/MM/YYYY
const day = String(currDate.getDate()).padStart(2, "0");
const month = String(currDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
const year = currDate.getFullYear();

const formattedDate = `${day}/${month}/${year}`;

const selectedActiveDate = ref(formattedDate);

const emit = defineEmits(["on-updated"]);

watch(
  () => selectedActiveDate.value,
  () => {
    let parts = null;
    if (selected.value != "now") {
      parts = selectedActiveDate.value.split("/");
    }
    const v_active =
      selected.value === "now"
        ? new Date()
        : new Date(parts[2], parts[1] - 1, parts[0]);
    emit("on-updated", v_active)
  },
  { immediate: false, deep: true }
);
</script>
