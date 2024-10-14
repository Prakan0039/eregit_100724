<template>
  <!-- <v-card> -->
  <!-- <v-card-title> -->

  <div>
    <v-hover>
      <template v-slot="{ isHovering, props }">
        <v-row
          v-bind="props"
          dense
          class="mt-2 mb-2 pa-5"
          style="background-color: white; border-radius: 10px; height: auto"
        >
          <v-col cols="5" class="mt-1">
            <h4>
              <span>คำถามที่</span> <span>{{ propsVar.index + 1 }}</span>
              <span> id</span> <span>{{ propsVar.id }}</span>
            </h4>
          </v-col>
          <v-col cols="4">
            <v-btn
              v-show="isHovering"
              class="ml-10 mt-n8 handle"
              variant="text"
              density="comfortable"
              icon="mdi mdi-dots-grid"
            ></v-btn>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="dataForm.controlType"
              variant="outlined"
              density="compact"
              :items="items"
              item-title="text"
              item-value="text"
            >
              <template #selection="{ item }">
                <div style="display: flex; align-items: center">
                  <v-icon>{{ item.raw.icon }}</v-icon>
                  <span style="margin-left: 10px">{{ item.raw.text }}</span>
                </div>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :icon="item.raw.icon"></v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" class="mt-n5">
            <div>
              <!-- <p>{{ dataForm.controlType }}</p> -->
              <ParagrahpNone
                :meta-data-paragrahp-none="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Paragraph' &&
                  propsVar.type === 'None'
                "
              />
              <MultiChoiceNone
                :items_selection="countQuestions"
                :meta-data-multi-choice-none="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Multichoice' &&
                  propsVar.type === 'None'
                "
              />
              <CheckboxNone
                :items_selection="countQuestions"
                :meta-data-checkbox-none="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Checkbox' &&
                  propsVar.type === 'None'
                "
              />
              <DropdownNone
                :items_selection="countQuestions"
                :meta-data-dropdown-none="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Dropdown' &&
                  propsVar.type === 'None'
                "
              />
              <UploadNone
                :meta-data-upload-none="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Uploads' && propsVar.type === 'None'
                "
              />

              <ParagrahpScore
                :meta-data-paragrahp-score="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Paragraph' &&
                  propsVar.type === 'Score'
                "
              />
              <MultiChoiceScore
                :items_selection="countQuestions"
                :meta-data-multi-choice-score="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Multichoice' &&
                  propsVar.type === 'Score'
                "
              />
              <CheckboxScore
                :items_selection="countQuestions"
                :meta-data-checkbox-score="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Checkbox' &&
                  propsVar.type === 'Score'
                "
              />
              <DropdownScore
                :items_selection="countQuestions"
                :meta-data-dropdown-score="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Dropdown' &&
                  propsVar.type === 'Score'
                "
              />
              <UploadScore
                :meta-data-upload-score="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Uploads' &&
                  propsVar.type === 'Score'
                "
              />

              <MultiChoiceAlign
                :items_selection="countQuestions"
                :meta-data-multi-choice-align="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Multichoice' &&
                  propsVar.type === 'Align'
                "
              />
              <CheckboxAlign
                :items_selection="countQuestions"
                :meta-data-checkbox-align="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Checkbox' &&
                  propsVar.type === 'Align'
                "
              />
              <DcropdownAlign
                :items_selection="countQuestions"
                :meta-data-dropdown-align="dataForm.control"
                @on-update="handleFormUpdated"
                @on-remove="handleQuestRemove"
                v-if="
                  dataForm.controlType === 'Dropdown' &&
                  propsVar.type === 'Align'
                "
              />
            </div>
          </v-col>
        </v-row>
        <!-- </v-card-title>
  </v-card> -->
      </template>
    </v-hover>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ParagrahpNone from "@/components/survey/forms/paragrahps/ParagrahpNone.vue";
import MultiChoiceNone from "@/components/survey/forms/multi-choice/MultiChoiceNone.vue";
import CheckboxNone from "@/components/survey/forms/checkboxs/CheckboxNone.vue";
import DropdownNone from "@/components/survey/forms/dropsdawn/DropdownNone.vue";
import UploadNone from "@/components/survey/forms/uploads-control/UploadNone.vue";

import ParagrahpScore from "@/components/survey/forms/paragrahps/ParagrahpScore.vue";
import MultiChoiceScore from "@/components/survey/forms/multi-choice/MultiChoiceScore.vue";
import CheckboxScore from "@/components/survey/forms/checkboxs/CheckboxScore.vue";
import DropdownScore from "@/components/survey/forms/dropsdawn/DropdownScore.vue";
import UploadScore from "@/components/survey/forms/uploads-control/UploadScore.vue";

import MultiChoiceAlign from "@/components/survey/forms/multi-choice/MultiChoiceAlign.vue";
import CheckboxAlign from "@/components/survey/forms/checkboxs/CheckboxAlign.vue";
import DcropdownAlign from "@/components/survey/forms/dropsdawn/DcropdownAlign.vue";
import { watch } from "vue";

const propsVar = defineProps({
  id: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: "Align", // None, Score, Align
  },
  data: {
    type: Object,
    default: () => {
      return {
        controlType: "Paragraph", //Paragraph, Multichoice, Checkbox, Dropdown, Uploads
        metaData: () => undefined,
      };
    },
  },
  countQuestion: {
    type: Number,
    default: 0,
  },
});

const countQuestions = computed(() => {
  const itemsSelection = [];
  for (
    let index = propsVar.index + 2;
    index <= propsVar.countQuestion;
    index++
  ) {
    itemsSelection.push(index);
  }
  return itemsSelection;
});

const emit = defineEmits(["on-update", "on-remove"]);
const dataForm = ref({
  id: propsVar.id,
  index: propsVar.index + 1,
  control: propsVar.data.metaData,
  controlType: propsVar.data.controlType,
});

let tempControlType = dataForm.value.controlType;

const items = [
  { text: "Paragraph", icon: "mdi-format-paragraph" },
  { text: "Multichoice", icon: "mdi-format-list-bulleted" },
  { text: "Checkbox", icon: "mdi-checkbox-marked" },
  { text: "Dropdown", icon: "mdi-menu-down" },
  { text: "Uploads", icon: "mdi-cloud-upload" },
];

watch(dataForm.value, (newValue) => {
  if (newValue.controlType !== tempControlType) {
    dataForm.value.control = undefined;
  }
  tempControlType = newValue.controlType;
  emit("on-update", dataForm.value);
});

watch(propsVar, (newValue) => {
  dataForm.value.index = newValue.index + 1;
});

const handleFormUpdated = (item) => {
  dataForm.value.control = item;
};

const handleQuestRemove = () => {
  console.log("Remove quest at : ", propsVar.id);
  emit("on-remove", propsVar.id);
};
</script>
