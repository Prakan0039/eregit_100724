<template>
  <v-row
    style="background-color: white; border-radius: 10px"
    dense
    align="center"
    class="mt-2"
  >
    <v-col cols="10">
      <v-text-field
        placeholder="กรุณากรอกคำถาม"
        variant="outlined"
        v-model="metaData.question"
        required
        :rules="[(v) => !!v || 'Required.']"
        density="compact"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        class="centered-placeholder"
        placeholder="คะแนนคำถาม"
        v-model="metaData.totalScore"
        type="number"
        :rules="[
          (v) => (v !== null && v !== undefined && v !== '') || 'Required.',
        ]"
        variant="outlined"
        density="compact"
      ></v-text-field>
    </v-col>
    <v-col cols="10">
      <v-text-field
        variant="outlined"
        v-model="metaData.answer"
        required
        :rules="[(v) => !!v || 'Required.']"
        placeholder="คำตอบ"
        density="compact"
      ></v-text-field>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="6" class="d-flex justify-start">
      <v-checkbox
        v-model="metaData.isRequire"
        hide-spin-buttons
        hide-details
        class="pa-0 ma-0"
        label="Require"
      ></v-checkbox>
    </v-col>
    <v-col cols="6" class="d-flex justify-end">
      <v-btn
        prepend-icon="mdi mdi-delete-outline"
        variant="outlined"
        rounded
        @click="$emit('on-remove')"
      >
        Delete
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";

const propsVar = defineProps({
  metaDataParagrahpScore: {
    type: Object,
    default: () => {
      return {
        question: "",
        answer: "",
        isRequire: false,
        totalScore: "",
      };
    },
  },
});

let metaData = ref(propsVar.metaDataParagrahpScore);
const emit = defineEmits(["on-update", "on-remove"]);

watch(metaData.value, (newValue) => {
  emit("on-update", newValue);
  // console.log(JSON.stringify({ paragraph_score: newValue }));
});
</script>

<style>
.centered-placeholder::placeholder {
  text-align: center;
  opacity: 1;
}
</style>
