import { defineStore } from "pinia";

export const useSurveyStore = defineStore("SURVEY_STORE", {
  state: () => ({
    survey3: {
      tempId: 0,
      tempQuestionIds: [],
    },
  }),
  actions: {},
});
