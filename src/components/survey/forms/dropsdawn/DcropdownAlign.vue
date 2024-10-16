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
        density="compact"
        required
        :rules="[(v) => !!v || 'Required.']"
      ></v-text-field>
    </v-col>
    <v-col cols="2">
      <v-text-field
        class="centered-placeholder"
        placeholder="คะแนนคำถาม"
        variant="outlined"
        :rules="[(v) => v !== null && v !== undefined && v !== '' || 'Required.']"
        v-model="metaData.totalScore"
        disabled
        density="compact"
      ></v-text-field>
    </v-col>
    <v-col
      class="ml-2"
      cols="12"
      v-for="(item, index) in metaData.choices"
      :key="index"
    >
      <v-row dense>
        <v-col cols="10">
          <div>
            <v-text-field
              class="centered-placeholder"
              placeholder="ตัวเลือก"
              required
              :rules="[(v) => !!v || 'Required.']"
              variant="outlined"
              v-model="item.answer"
              density="compact"
            >
              <template v-slot:append>
                <v-icon @click="onIconClick(index)" color="red">
                  mdi mdi-close-circle
                </v-icon>
              </template>
            </v-text-field>
          </div>
        </v-col>
        <v-col cols="2">
          <v-text-field
            class="centered-placeholder"
            placeholder="คะแนนคำตอบ"
            v-model="item.score"
            type="number"
            :rules="[(v) => v !== null && v !== undefined && v !== '' || 'Required.']"
            variant="outlined"
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select
            label="ทำข้อต่อไป"
            :items="propsVar.items_selection"
            density="compact"
            variant="outlined"
            v-model="item.nextQuestion"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row dense no-gutters>
        <v-checkbox
          v-model="item.isAlign"
          hide-spin-buttons
          hide-details
          class="pa-n0 ma-0 mt-n6"
          label="Align"
        ></v-checkbox>
      </v-row>
    </v-col>
    <v-col cols="12" class="d-flex">
      <a>
        <p class="clickable-underline" @click="addChoice()">เพิ่มตัวเลือก</p>
      </a>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="6" class="d-flex justify-start">
      <v-checkbox
        v-model="metaData.isRequired"
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
  metaDataDropdownAlign: {
    type: Object,
    default: () => {
      return {
        question: "",
        isRequired: false,
        isAlign: false,
        totalScore: 0,
        choices: [],
      };
    },
  },
});

let metaData = ref(propsVar.metaDataDropdownAlign);

const addChoice = () => {
  metaData.value.choices.push({
    score: "",
    isAlign: true,
    answer: "",
    nextQuestion: "",
  });
};

const onIconClick = (index) => {
  metaData.value.choices.splice(index, 1);
};

const emit = defineEmits(["on-update", "on-remove"]);

watch(metaData.value, (newValue) => {
  metaData.value.totalScore = newValue.choices.reduce((max, answer) => {
    const score = Number(answer.score);
    return score > max ? score : max;
  }, 0);
  // emit("on-update", { dropdown_align: newValue });
  emit("on-update", newValue);
  // console.log(JSON.stringify({ dropdown_align: newValue }));
});
</script>

<style>
.custom-red {
  color: red;
}
.custom-grey {
  color: grey;
}

.clickable-underline {
  text-decoration: underline;
  cursor: pointer;
}
</style>
