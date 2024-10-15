const mySurvayStructureTwo = {
  id: "",
  rspActivityStatusId: null,
  inprogressSectionId: null,
  nameQuestionnaire: {
    title: "",
    description: "",
  },
  name: "",
  createQuestionnaire: [],
};

const mySurvayStructureThree = {
  id: "",
  // rspActivityStatusId: null,
  // inprogressSectionId: null,
  nameQuestionnaire: {
    title: "",
    description: "",
  },
  createQuestionnaire: [],
};

const mapperSurvayStepTwo = (el, rspSurvayActive) => {
  if (el?.section_type.id == 1) {
    mySurvayStructureTwo.id = el.rsp_survey_section_id;
    mySurvayStructureTwo.nameQuestionnaire.title = rspSurvayActive?.name ?? "";
    mySurvayStructureTwo.nameQuestionnaire.description =
      rspSurvayActive?.description ?? "";

    mySurvayStructureTwo.name = el.name;

    mySurvayStructureTwo.inprogressSectionId = el.next_section_id;

    for (let i = 0; i < el.questions.length; i++) {
      const question = el.questions[i];

      // Paragraph
      const Paragraph = {
        id: 0,
        index: 0,
        disabled: false,
        typeQuestionCard: "None",
        data: {
          controlType: "Paragraph",
          metaData: {
            question: "",
            answer: "",
            isRequired: true,
            index: 0,
            score: 0,
            nextQuestionId: 0,
          },
        },
      };

      if (question?.question_type?.id == 1) {
        Paragraph.id = question?.rsp_survey_question_id;
        Paragraph.data.metaData.question = question?.question;
        Paragraph.data.metaData.index = question?.sequence;
        Paragraph.data.metaData.score = question?.score;
        Paragraph.data.metaData.isRequired = question?.is_required;
        Paragraph.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        mySurvayStructureTwo.createQuestionnaire.push(Paragraph);
      }

      // Multichoice
      const Multichoice = {
        id: 0,
        index: 0,
        disabled: false,
        typeQuestionCard: "None",
        data: {
          controlType: "Multichoice",
          metaData: {
            question: "Multichoice",
            index: 0,
            score: 0,
            isRequired: true,
            answer: null,
            choices: [],
          },
        },
      };

      if (question?.question_type?.id == 2) {
        Multichoice.id = question?.rsp_survey_question_id;
        Multichoice.index = question?.sequence;
        Multichoice.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        Multichoice.data.metaData.question = question?.question;
        Multichoice.data.metaData.index = question?.sequence;
        Multichoice.data.metaData.score = question?.score;
        Multichoice.data.metaData.isRequired = question?.is_required;
        Multichoice.data.metaData.choices = question?.choices.map((item) => {
          return {
            id: item.rsp_survey_choice_id,
            title: item.is_other_choice ? "other" : "chioce",
            answer: item.answer,
            isAligned: item.is_aligned,
            nextQuestionId: item.next_question_id,
            index: item.sequence,
            score: item.score,
          };
        });
        mySurvayStructureTwo.createQuestionnaire.push(Multichoice);
      }

      // Checkbox
      const Checkbox = {
        id: 0,
        index: 0,
        disabled: false,
        typeQuestionCard: "None",
        data: {
          controlType: "Checkbox",
          metaData: {
            question: "Checkbox",
            isRequired: true,
            answer: [],
            choices: [],
          },
        },
      };

      if (question?.question_type?.id == 3) {
        Checkbox.id = question?.rsp_survey_question_id;
        Checkbox.index = question?.sequence;
        Checkbox.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        Checkbox.data.metaData.question = question?.question;
        Checkbox.data.metaData.isRequired = question?.is_required;
        Checkbox.data.metaData.choices = question?.choices.map((item) => {
          if (item?.is_other_choice) {
            return {
              id: item.rsp_survey_choice_id,
              title: "chioce",
              isAligned: item.is_aligned,
              answer: item.answer,
              index: item.sequence,
              score: item.score,
              nextQuestionId: item.next_question_id,
            };
          }

          return {
            id: item.rsp_survey_choice_id,
            title: "other",
            isAligned: item.is_aligned,
            answer: item.answer,
            index: item.sequence,
            score: item.score,
            nextQuestionId: item.next_question_id,
            specify: "",
          };
        });
        mySurvayStructureTwo.createQuestionnaire.push(Checkbox);
      }

      // File upload
      const UploadType = {
        id: 0,
        index: 0,
        disabled: false,
        typeQuestionCard: "None",
        data: {
          controlType: "Uploads",
          metaData: {
            question: "Uploads files",
            isRequired: true,
            files: null,
            nextQuestionId: 0,
          },
        },
      };

      if (question?.question_type?.id == 5) {
        UploadType.id = question?.rsp_survey_question_id;
        UploadType.index = question?.sequence;
        UploadType.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        UploadType.data.metaData.isRequired = question?.is_required;
        UploadType.data.metaData.question = question?.question;

        mySurvayStructureTwo.createQuestionnaire.push(UploadType);
      }

      // DropdawnType
      const DropdawnType = {
        id: 0,
        index: 0,
        disabled: false,
        typeQuestionCard: "None",
        data: {
          controlType: "Dropdown",
          metaData: {
            question: "Dropdown",
            isRequired: true,
            answer: null,
            choices: [],
          },
        },
      };

      if (question?.question_type?.id == 4) {
        DropdawnType.id = question?.rsp_survey_question_id;
        DropdawnType.index = question?.sequence;
        DropdawnType.data.metaData.question = question?.question;
        DropdawnType.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        DropdawnType.data.metaData.isRequired = question?.is_required;
        DropdawnType.data.metaData.choices = question?.choices.map((item) => {
          return {
            id: item.rsp_survey_choice_id,
            answer: item.answer,
            nextQuestionId: item.next_question_id,
          };
        });
        mySurvayStructureTwo.createQuestionnaire.push(DropdawnType);
      }
    }
  }
};

const mapperSurvayStepThree = (el) => {
  if (el?.section_type.id == 2) {
    const questionnaire = {
      id: el?.rsp_survey_section_id,
      index: el.sequence,
      title: el?.name,
      score: el?.score,
      sumScore: el?.score,
      nextSectionId: el?.next_section_id,
      inprogressSectionId: el.next_section_id,
      data: [],
    };

    for (let i = 0; i < el.questions.length; i++) {
      const question = el.questions[i];

      const Paragraph = {
        id: "",
        index: 0,
        disabled: false,
        typeQuestionCard: "None",
        data: {
          controlType: "Paragraph",
          metaData: {
            question: "Paragraph",
            totalScore: 0,
            answer: "",
            isRequire: true,
            nextQuestionId: 0,
          },
        },
      };

      if (question?.question_type?.id == 1) {
        Paragraph.id = question?.rsp_survey_question_id;
        Paragraph.index = question?.sequence;
        Paragraph.data.metaData.totalScore = question?.score;
        Paragraph.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        Paragraph.data.metaData.question = question?.question;
        Paragraph.data.metaData.isRequire = question?.is_required;
        Paragraph.data.metaData.totalScore = question?.score;

        questionnaire.data.push(Paragraph);
      }

      const Checkbox = {
        id: "",
        index: 0,
        disabled: false,
        typeQuestionCard: "Align",
        data: {
          controlType: "Checkbox",
          metaData: {
            question: "Checkbox",
            isRequired: true,
            isAlign: true,
            totalScore: 25,
            answer: [],
            choices: [],
          },
        },
      };

      if (question?.question_type?.id == 3) {
        Checkbox.id = question?.rsp_survey_question_id;
        Checkbox.index = question?.sequence;
        Checkbox.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        Checkbox.data.metaData.totalScore = question?.score;
        Checkbox.data.metaData.isRequired = question?.is_required;
        Checkbox.data.metaData.question = question?.question;
        Checkbox.data.metaData.isAlign = question?.is_alignment_question;

        Checkbox.data.metaData.choices = question?.choices.map((item) => {
          if (item.is_other_choice) {
            return {
              id: item.rsp_survey_choice_id,
              title: "other",
              score: item.score,
              answer: item.answer,
              specify: "",
              isAlign: item.is_aligned,
              index: item.sequence,
              nextQuestionId: item.next_question_id,
            };
          }

          return {
            id: item.rsp_survey_choice_id,
            title: "chioce",
            score: item.score,
            answer: item.answer,
            isAlign: item.is_aligned,
            index: item.sequence,
            nextQuestionId: item.next_question_id,
          };
        });

        questionnaire.data.push(Checkbox);
      }

      const Multichoice = {
        id: "0",
        index: 1,
        disabled: false,
        typeQuestionCard: "Align",
        data: {
          controlType: "Multichoice",
          metaData: {
            question: "Multichoice",
            isRequired: false,
            totalScore: 15,
            answer: null,
            choices: [],
          },
        },
      };

      if (question?.question_type?.id == 2) {
        Multichoice.id = question?.rsp_survey_question_id;
        Multichoice.index = question?.sequence;
        Multichoice.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        Multichoice.data.metaData.question = question?.question;
        Multichoice.data.metaData.isRequired = question?.is_required;
        Multichoice.data.metaData.totalScore = question?.score;
        Multichoice.data.metaData.choices = question?.choices.map((item) => {
          if (item?.is_other_choice) {
            return {
              id: item.rsp_survey_choice_id,
              index: item.sequence,
              title: "other",
              isAlign: item.is_aligned,
              answer: item.answer,
              specify: "",
              nextQuestionId: item.next_question_id,
              score: item.score,
            };
          }

          return {
            id: item.rsp_survey_choice_id,
            index: item.sequence,
            title: "chioce",
            isAlign: item.is_aligned,
            answer: item.answer,
            nextQuestionId: item.next_question_id,
            score: item.score,
          };
        });

        questionnaire.data.push(Multichoice);
      }

      const DropdawnType = {
        id: 0,
        index: 0,
        disabled: false,
        typeQuestionCard: "None",
        data: {
          controlType: "Dropdown",
          metaData: {
            question: "Dropdown",
            isRequired: true,
            totalScore: 0,
            answer: null,
            choices: [],
          },
        },
      };

      if (question?.question_type?.id == 4) {
        DropdawnType.id = question?.rsp_survey_question_id;
        DropdawnType.index = question?.sequence;
        DropdawnType.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        DropdawnType.data.metaData.totalScore = question?.score;
        DropdawnType.data.metaData.isRequired = question?.is_required;

        DropdawnType.data.metaData.choices = question?.choices.map((item) => {
          if (item.is_other_choice) {
            return {
              id: item.rsp_survey_choice_id,
              index: item.sequence,
              score: item.score,
              isAlign: item.is_aligned,
              specify: "",
              answer: item.answer,
              nextQuestionId: item.next_question_id,
            };
          }

          return {
            id: item.rsp_survey_choice_id,
            index: item.sequence,
            score: item.score,
            isAlign: item.is_aligned,
            answer: item.answer,
            nextQuestionId: item.next_question_id,
          };
        });
        questionnaire.data.push(DropdawnType);
      }

      // File upload
      const UploadType = {
        id: 0,
        index: 0,
        disabled: false,
        typeQuestionCard: "None",
        data: {
          controlType: "Uploads",
          metaData: {
            question: "Uploads files",
            isRequired: true,
            files: null,
            nextQuestionId: 0,
          },
        },
      };

      if (question?.question_type?.id == 5) {
        UploadType.id = question?.rsp_survey_question_id;
        UploadType.index = question?.sequence;
        UploadType.typeQuestionCard = question?.is_alignment_question
          ? "Align"
          : "None";
        UploadType.data.metaData.isRequired = question?.is_required;
        UploadType.data.metaData.question = question?.question;
        questionnaire.data.push(UploadType);
      }
    }
    mySurvayStructureThree.createQuestionnaire.push(questionnaire);
  }
};

const MapperSurvay = (data, rspSurvayActive, rspActivityStatusId) => {
  mySurvayStructureTwo.rspActivityStatusId = rspActivityStatusId ?? "";
  mySurvayStructureThree.rspActivityStatusId = rspActivityStatusId ?? "";

  // mySurvayStructureTwo.inprogressSectionId = inprogressSectionId;
  // mySurvayStructureThree.inprogressSectionId = inprogressSectionId;

  mySurvayStructureThree.nameQuestionnaire.title = rspSurvayActive?.name ?? "";

  mySurvayStructureThree.createQuestionnaire = [];
  mySurvayStructureTwo.createQuestionnaire = [];

  for (let index = 0; index < data.sections.length; index++) {
    const el = data.sections[index];
    mapperSurvayStepTwo(el, rspSurvayActive);
    mapperSurvayStepThree(el, rspSurvayActive);
  }
  return { mySurvayStructureTwo, mySurvayStructureThree };
};

export default { MapperSurvay };
