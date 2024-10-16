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
        placeholder="คะแนนคำตอบ"
        :rules="[(v) => v !== null && v !== undefined && v !== '' || 'Required.']"
        disabled
        v-model="metaData.totalScore"
        variant="outlined"
        color="gray"
        density="compact"
      ></v-text-field>
    </v-col>
    <v-col cols="12" v-for="(item, index) in metaData.choices" :key="index">
      <v-row dense v-if="item.title === 'chioce'">
        <v-col cols="1" class="d-flex justify-end"
          ><v-icon> mdi mdi-checkbox-blank-outline </v-icon>
        </v-col>
        <v-col cols="9">
          <v-row dense no-gutters>
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
          </v-row>
          <v-row dense no-gutters>
            <v-checkbox
              v-model="item.isAlign"
              class="pa-n0 ma-0 mt-n6"
              hide-spin-buttons
              hide-details
              label="Align"
            ></v-checkbox>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-text-field
            class="centered-placeholder"
            placeholder="คะแนนคำตอบ"
            variant="outlined"
            :rules="[(v) => v !== null && v !== undefined && v !== '' || 'Required.']"
            type="number"
            v-model="item.score"
            density="compact"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row dense v-if="item.title === 'other'">
        <v-col cols="1" class="d-flex justify-end"> อื่นๆ</v-col>
        <v-col cols="9">
          <v-row dense no-gutters>
            <v-text-field
              class="centered-placeholder"
              placeholder="ตัวเลือกอื่นๆ"
              variant="outlined"
              v-model="item.answer"
              required
              :rules="[(v) => !!v || 'Required.']"
              density="compact"
            >
              <template v-slot:append>
                <v-icon @click="onIconClick(index)" color="red">
                  mdi mdi-close-circle
                </v-icon>
              </template></v-text-field
            >
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
        <v-col cols="2">
          <v-text-field
            class="centered-placeholder"
            placeholder="คะแนนคำถาม"
            variant="outlined"
            v-model="item.score"
            :rules="[(v) => v !== null && v !== undefined && v !== '' || 'Required.']"
            density="compact"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="d-flex">
      <a>
        <p class="clickable-underline" @click="addChoice()">เพิ่มตัวเลือก</p>
      </a>
      <p class="clickable-underline mr-1 ml-1 custom-grey">หรือ</p>
      <a>
        <p class="clickable-underline custom-red" @click="addOther()">
          เพิ่มอื่นๆ
        </p>
      </a>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="1" class="d-flex justify-end">
      <v-checkbox
        v-model="metaData.isRequired"
        hide-spin-buttons
        hide-details
        class="pa-0 ma-0"
        label="Require"
      ></v-checkbox>
    </v-col>
    <v-col cols="8" class="d-flex justify-end">
      <v-checkbox
        v-model="metaData.isAlign"
        hide-spin-buttons
        hide-details
        class="pa-0 ma-0"
        label="ผู้ตอบแบบสอบถามต้องเลือกตัวเลือก Align ที่เลือกไว้ทั้งหมดถึงจะ Align"
      ></v-checkbox>
    </v-col>
    <v-col cols="3" class="d-flex justify-end">
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
  metaDataCheckboxAlign: {
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
  items_selection: {
    type: Array,
    default: () => [1, 2, 3, 4],
  },
});

let metaData = ref(propsVar.metaDataCheckboxAlign);

const addChoice = () => {
  metaData.value.choices.push({
    title: "chioce",
    isChecked: false,
    score: "",
    answer: "",
    isAlign: false,
  });
};

const addOther = () => {
  metaData.value.choices.push({
    title: "other",
    isChecked: false,
    score: "",
    answer: "",
    isAlign: false,
  });
};

const onIconClick = (index) => {
  metaData.value.choices.splice(index, 1);
};

const emit = defineEmits(["on-update", "on-remove"]);

watch(metaData.value, (newValue) => {
  metaData.value.totalScore = newValue.choices.reduce(
    (sum, answer) => sum + Number(answer.score),
    0
  );
  // emit("on-update", { check_box_align: newValue });
  emit("on-update", newValue);
  // console.log(JSON.stringify({ check_box_align: newValue }));
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
