<template>
  <v-container fluid>
    <div class="pa-7 ma-9">
      <!-- {{ businessPartnerFormId.value.data.company.name_th }} -->
      <!-- {{ businessPartnerFormId.company[0].name_th }} -->
      <v-card rounded class="mx-auto pa-4">
        <v-card-title class="d-flex align-center justify-center">
          <v-row dense no-gutters class="mb-4">
            <v-col cols="12" class="text-center mb-5">
              <h3>
                แบบรายงานและเปิดเผยความขัดแย้งและผลประโยชน์
              </h3>
            </v-col>
            <v-row justify="center" align="center">
              <v-col cols="12" class="text-center mb-4">
                <h4>สำหรับบุคคลหรือนิติบุคคลที่เข้ามาก่อนิติสัมพันธ์</h4>
              </v-col>
            </v-row>

            <v-col cols="12">
              <v-row justify="center" align="center">
                <h4>Conflict of Interest Disclosure Form for vendor</h4>
              </v-row>
            </v-col>
          </v-row>
        </v-card-title>
        <v-form ref="formDisclosure">
          <v-row dense no-gutters class="ma-5 pa-">
            <v-col cols="6">
              <v-text-field
                class="ml-2"
                density="compact"
                dense
                v-model="input_data.company_name"
                :rules="rules_valid.require"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="2" class="ml-4 pl-4">
              <v-card-title>
                <h6>เลขประจำผู้เสียภาษีอากร</h6>
              </v-card-title>
              <!-- <h4 class="ml-">เลขประจำผู้เสียภาษีอากร</h4> -->
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="input_data.taxpayer_id_number"
                class="mr-"
                density="compact"
                dense
                :rules="rules_valid.require"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <!-- <h4 class="ml-">บรรทัดสอง</h4> -->
            <v-col cols="1" class>
              <v-card-title>
                <h6>ข้าพเจ้าชื่อ</h6>
              </v-card-title>
            </v-col>
            <v-col cols="2">
              <v-radio-group
                v-model="input_data.select_title"
                :rules="rules_valid.team"
                inline
              >
                <v-radio label="นาย" value="นาย"></v-radio>
                <v-radio label="นาง" value="นาง"></v-radio>
                <v-radio label="นางสาว" value="นางสาว"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="3">
              <v-text-field
                class="ml-"
                density="compact"
                dense
                variant="outlined"
                :rules="rules_valid.require"
                v-model="input_data.firstname"
              ></v-text-field>
            </v-col>
            <v-col cols="1" class>
              <v-card-title>
                <h6>นามสกุล</h6>
              </v-card-title>
            </v-col>
            <v-col cols="3">
              <v-text-field
                class
                density="compact"
                :rules="rules_valid.require"
                dense
                variant="outlined"
                v-model="input_data.lastname"
              ></v-text-field>
            </v-col>
            <v-col cols="2" class>
              <v-card-title>
                <h6>ขอรายงานว่าข้าพเจ้า</h6>
              </v-card-title>
            </v-col>
            <v-col cols="12">
              <v-row dense>
                <v-col cols="12" class>
                  <v-radio-group v-model="input_data.radio" color="red" class>
                    <v-radio value="0">
                      <template v-slot:label>
                        <div>
                          <strong class="text-black">ไม่มี</strong>
                          {{ is_related }}
                        </div>
                      </template>
                    </v-radio>
                    <v-radio value="1">
                      <template v-slot:label>
                        <div>
                          <strong class="text-black">มี</strong>
                          {{ is_related }}
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <div v-if="input_data.radio == 1">
            <v-row
              dense
              no-gutters
              class="ma-5"
              v-for="(item, index) in input_data.items_contects"
              :key="index"
            >
              <!-- <h4 class="ml-">บรรทัดสอง</h4> -->
              <v-col cols="1" class="ma-">
                <v-card-title>
                  <h6>ชื่อ</h6>
                </v-card-title>
                <!-- <h4 class="ml-">เลขประจำผู้เสียภาษีอากร</h4> -->
              </v-col>
              <v-col cols="2">
                <v-radio-group
                  v-model="item.select_title"
                  inline
                  color="red"
                  :rules="rules_valid.team"
                >
                  <v-radio label="นาย" value="นาย"></v-radio>
                  <v-radio label="นาง" value="นาง"></v-radio>
                  <v-radio label="นางสาว" value="นางสาว"></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  class="ml-"
                  density="compact"
                  dense
                  variant="outlined"
                  :rules="rules_valid.require"
                  v-model="item.firstname"
                ></v-text-field>
              </v-col>
              <v-col cols="1" class>
                <v-card-title>
                  <h6>นามสกุล</h6>
                </v-card-title>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  class
                  density="compact"
                  dense
                  variant="outlined"
                  :rules="rules_valid.require"
                  v-model="item.lastname"
                ></v-text-field>
              </v-col>

              <v-col cols="1" class>
                <v-card-title>
                  <h6>ตำแหน่ง</h6>
                </v-card-title>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class
                  density="compact"
                  dense
                  variant="outlined"
                  :rules="rules_valid.require"
                  v-model="item.position"
                ></v-text-field>
              </v-col>

              <v-col cols="1" class>
                <v-card-title>
                  <h6>หน่วยงาน</h6>
                </v-card-title>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class
                  density="compact"
                  dense
                  variant="outlined"
                  :rules="rules_valid.require"
                  v-model="item.agency"
                ></v-text-field>
              </v-col>
              <v-col cols="1" class>
                <v-card-title>
                  <h6>เกี่ยวข้องเป็น</h6>
                </v-card-title>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  class
                  density="compact"
                  dense
                  variant="outlined"
                  v-model="item.relevant"
                  :rules="textRequired"
                  append-icon="mdi mdi-close-circle"
                  @click:append="handleRemoveContact(index)"
                ></v-text-field>
              </v-col>
            </v-row>

            <ButtonControl
              v-if="input_data.items_contects.length < 5"
              icon="mdi mdi-plus"
              text="เพิ่ม"
              @button-clicked="handleAddNewContact"
            />
            <v-row justify="center" align="center">
              <v-col cols="12" class="text-center mb-0">
                <h4>
                  ข้าพเจ้าฯ
                  ขอรายงานรายละเอียดของรายการที่เป็นหรืออาจเป็นความขัดแย้งทางผลประโยชน์กับบริษัทฯ
                  เพิ่มเติม ดังนี้
                </h4>
              </v-col>
              <v-col cols="12" class="ma-5">
                <v-textarea
                  v-model="input_data.more"
                  class
                  label
                  variant="outlined"
                ></v-textarea>
              </v-col>
            </v-row>
            <strong>เอกสารเพิ่มเติม</strong>
            <v-card class="mt-9 pt-">
              <v-toolbar color="rgba(0, 0, 0, 0)">
                <v-toolbar-title></v-toolbar-title>
                <template v-slot:append>
                  <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
                </template>
              </v-toolbar>
              <div class="pa-9">
                <ChooseMultiFiles
                  :max-file="10"
                  icon="mdi mdi-file-document"
                  @input-files="handleInputFiles"
                />
              </div>
              <v-row justify="end" class="mt-2 mb-2">
                <v-col cols="2">
                  <v-card-actions class="pa-5">
                    <v-spacer></v-spacer>

                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <v-row dense no-gutters class="ma-5 pl-6">
            <v-col cols="12">
              <v-card-text>
                <p>
                  <strong>
                    ข้าพเจ้าขอยืนยันและรับรองว่า
                    ข้าพเจ้าได้ใช้ความรู้และความเชื่อที่ดีที่สุดของข้าพเจ้า
                    ในการเปิดเผยความสัมพันธ์และความขัดแย้ง ที่เกิดขึ้นจริง
                    ที่รับรู้ หรือ
                  </strong>
                  <strong
                    >ที่อาจเกิดขึ้นของข้าพเจ้าอย่างเต็มที่และครบถ้วนในแบบฟอร์มนี้ตามข้อกำหนดของบริษัท</strong
                  >
                </p>
              </v-card-text>
            </v-col>

            <v-col cols="12" class="mb-9">
              <v-card-text>
                <p>
                  <strong class="pl-4 ml-4">
                    หากข้าพเจ้ามีเจตนาปกปิด บิดเบือน หรือให้ข้อมูลเท็จ
                    ข้าพเจ้ายินดีให้บริษัทดำเนินการตามที่เห็นว่าเหมาะสม
                    รวมถึงพนักงานที่ข้าพเจ้าปกปิด
                  </strong>
                  <!-- <br /> -->
                  <strong>
                    ความสัมพันธ์ที่เกี่ยวข้อง
                    อาจถูกดำเนินการตามบทลงโทษที่ได้บัญญัติไว้ในนโยบายต่อต้านการทุจริตคอร์รัปชั่น
                    (Anti-Corruption Policy) ด้วย
                  </strong>
                </p>
              </v-card-text>
            </v-col>

            <v-row justify-end v-if="current_view === 2">
              <v-col cols="12" class="text-right">{{ name }}</v-col>
            </v-row>
          </v-row>
        </v-form>
        <v-row justify="center" class="mb-5 mt-" v-if="current_view === 1">
          <v-col cols="auto">
            <ButtonControl
              color="black"
              text="ลงชื่อ"
              width="100"
              @button-clicked="handleNext"
            />
          </v-col>
        </v-row>
      </v-card>
      <v-footer color="transparent" style="margin-top: 50px">
        <v-row justify="center">
          <v-col cols="auto">
            <button-control
              color="black"
              text="ย้อนกลับ"
              width="100"
              @button-clicked="handleBack"
            />
          </v-col>
          <v-col cols="auto">
            <button-control
              type="submit"
              @button-clicked="handleForm"
              color="secondary"
              text="ตกลง"
              width="100"
              :disabled="!Disible"
            />
          </v-col>
        </v-row>
      </v-footer>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import ButtonControl from "@/components/controls/ButtonControl.vue";
import ChooseMultiFiles from "../../components/forms/ChooseMultiFiles.vue";
const { handlingErrorsMessage } = useErrorHandlingDialog();

import { useAlerDisclosuretDialogDialog } from "@/components/dialogs/AlertDisclosureDialogService";
const { showAlertDisclosure } = useAlerDisclosuretDialogDialog();
// import AlertDisclosureDialog from "@/components/dialogs/AlertDisclosureDialog.vue";

import { useRoute, useRouter } from "vue-router";
import PartnerServive from "@/apis/PartnerServive";
import { useErrorHandlingDialog } from "@/components/dialogs/ExceptionHandleDialogService";
const route = useRoute();
const router = useRouter();
const formNumberOnUrl = ref(route.query.form_number);
const businessPartnerFormId = ref({});
const input_data = ref({
  radio: "0",
  select_title: null,
  company_name: "",
  more: "",
  taxpayer_id_number: "",
  firstname: "",
  items_contects: [],
  items_name: [],
  lastname: "",
});
let apiCompletedCount = 0;

watch(
  () => input_data.value.radio,
  () => {
    console.log("Partner Register : ", input_data.value.radio);
    if (input_data.value.radio == 1) {
      input_data.value.items_contects.push({
        firstname: "",
        select_title: "",
        lastname: "",
        position: "",
        agency: "",
        relevant: "",
      });
    } else {
      input_data.value.items_contects = [];
      input_data.value.more = "";
    }
  }
);

const formatDate = () => {
  const date = new Date(); // Current date and time
  const day = date.getDate().toString().padStart(2, "0"); // Day in dd format
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month in MM format
  const year = (date.getFullYear() % 100).toString().padStart(2, "0"); // Last two digits of the year in yy format
  const hours = date.getHours().toString().padStart(2, "0"); // Hours in hh format
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Minutes in mm format

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
const createDocumentBody = ref([]);

const handleRemoveContact = (index) => {
  const itemsCount = input_data.value.items_contects.length;

  if (itemsCount > 1) {
    input_data.value.items_contects.splice(index, 1);
  } else {
    alert("ไม่สามารถลบรายการสุดท้ายได้");
  }
};

const Disible = ref(false);

const name = ref(`${sessionStorage.getItem("auth_email")} ${formatDate()}`);

let current_view = ref(1);

const is_related = ref(
  ` ความสัมพันธ์กับพนักงานบริษัทฯ หรือความขัดแย้งทางผลประโยชน์ซึ่งเกี่ยวข้องหรืออาจเกี่ยวข้องกับบริษัทฯ`
);
const formDisclosure = ref(null);
const textRequired = [(v) => !!v || "กรุณากรอกข้อมูลให้ครบถ้วน"];
// const handleNext = (data) => {
//   console.log("handleNext", data);
// };
const handleBack = (data) => {
  console.log("handleBack", data);
};
// const handleSubmit = (data) => {
//   console.log("handleSubmit", data);
// };
// const handleAddNewContact = () => {
//   input_data.value.items_contects.push({
//     firstname: "",
//     select_title: "",
//     lastname: "",
//     position: "",
//     agency: "",
//     relevant: ""
//   });
// };
const handleAddNewContact = () => {
  if (input_data.value.items_contects.length == 5) return;
  input_data.value.items_contects.push({
    firstname: "",
    select_title: "",
    lastname: "",
    position: "",
    agency: "",
    relevant: "",
  });
};
const rules_valid = ref({
  require: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  role: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  team: [(v) => !!v || "กรุณากรอกข้อมูลให้ครบ"],
  radioRules: [(v) => !!v || "กรุณาเลือก 1 อัน"],
});
const handleNext = async () => {
  const is_valid = await formDisclosure.value.validate();
  if (is_valid && is_valid["valid"]) {
    current_view.value = 2;
    Disible.value = true;
  } else {
    console.log("Partner Register Invalid!!!");
  }
};

onMounted(async () => {
  await getBusinessPartnerRegisterFormById();
});

const getBusinessPartnerRegisterFormById = async () => {
  try {
    const response = await PartnerServive.getBusinessPartnerRegisterForm(
      formNumberOnUrl.value
    );
    if (response.data?.is_success) {
      businessPartnerFormId.value = response.data.data;

      // businessPartnerFormId.value.data.company.name_th
      input_data.value.taxpayer_id_number =
        businessPartnerFormId.value.taxpayer_number_id;
      input_data.value.company_name = businessPartnerFormId.value.name_th;

      console.log("businessPartnerFormId", businessPartnerFormId.value);
      // input_data.value.firstname = businessPartnerFormId.value.name_th
      // input_data.value.lastname = lastname
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

const dataBodySave = ref({
  form_number: null,
  company_name: null,
  taxpayer_id_number: null,
  title: null,
  firstname: null,
  lastname: null,
  is_related_employee: null,
  description: null,
  related_employee: [],
});
const handleForm = async (value) => {
  console.log("dddd", value);
  dataBodySave.value.form_number = route.query?.form_number ?? null;
  dataBodySave.value.company_name = input_data.value.company_name;
  dataBodySave.value.taxpayer_id_number = input_data.value.taxpayer_id_number;
  dataBodySave.value.title = input_data.value.select_title;
  dataBodySave.value.firstname = input_data.value.firstname;
  dataBodySave.value.lastname = input_data.value.lastname;
  dataBodySave.value.is_related_employee =
    input_data.value.radio == "1" ? true : false;
  dataBodySave.value.description = input_data.value.more;
  console.log("dddddd", dataBodySave.value);

  // dataBodySave.value.related_employee[0].title = input_data.value.items_contects[0].select_title;
  // dataBodySave.value.related_employee[0].firstname = input_data.value.items_contects[0].firstname;
  // dataBodySave.value.related_employee[0].lastname = input_data.value.items_contects[0].lastname;
  // dataBodySave.value.related_employee[0].position = input_data.value.items_contects.position;
  // dataBodySave.value.related_employee[0].department = input_data.value.items_contects[0].agency
  // dataBodySave.value.related_employee[0].relationship= input_data.value.items_contects[0].relevant

  dataBodySave.value.related_employee = input_data.value.items_contects.map(
    (item) => {
      return {
        title: item.select_title,
        firstname: item.firstname,
        lastname: item.lastname,
        position: item.position,
        department: item.agency,
        relationship: item.relevant,
      };
    }
  );
  // if (
  //   await showAlertDisclosure(
  //     "ลงทะเบียนสำเร็จเรียบร้อยเเล้ว",
  //     "ระบบทำการส่งการลงทะเบียนแล้ว \nหากพบปัญหากรุณาติดต่อทาง Frasers Property Thailand"
  //     // "หากพบปัญหากรุณาติดต่อทาง Frasers Property Thailand"
  //   )
  // )
  try {
      const response = await PartnerServive.createDisclosureForm(
        dataBodySave.value
      );
      apiCompletedCount++; 
      if (response.data?.is_success) {
        await onCreatePartnerDocumentUploads();
        apiCompletedCount++; 

        if(status_code_bp_number.value != 200){
          await PartnerServive.createNewRegisterAccountTask(
            formNumberOnUrl.value
          );
          apiCompletedCount++; 
        }

        if (apiCompletedCount > 0) {
          await showAlertDisclosure(
        "ลงทะเบียนเสร็จเรียบร้อยแล้ว",
        "ระบบทำการส่งการลงทะเบียนแล้ว \nหากพบปัญหากรุณาติดต่อทาง Frasers Property Thailand"
      );
    }
        if ( response.data?.is_success) {
          // console.log(
          //   "responsenewtask.data?.is_success",
          //   responsenewtask.data?.is_success
          // );
          // console.log("do_rsp_activity", do_rsp_activity.value);
          // console.log("do_rsp_activity", memberType.value);
          if (memberType.value == 2 && do_rsp_activity.value && store.sessionInfo.link_to !="ChaneInfoNon") {
            console.log("do_rsp_activity");
            router.push({
              path: "/SDTeamMangement/Survey/Document/1",
              query: {
                prev_completed: "completed",
                state: "created",
                bp_number: formNumberOnUrl.value,
              },
            });
          } else if(store.sessionInfo.link_to =="ChaneInfoNon"){
            router.push({
              path: "/change-info-non",
              query: {
                bp_number: formNumberOnUrl.value,
              },
            });
          } else{
            console.log("do_rsp_activity");
            router.push({
              path: "/VendorDashBoard",
            });
          }
        }
      }
    }catch (e) {
      if (e.response) {
        const val = e.response.data;
        handlingErrorsMessage(val.message, val?.data.error);
        return;
      }
      handlingErrorsMessage("unknown", e.message);
    }
  // console.warn(JSON.stringify(dataBodyEmployee.value));
};
const handleToLogOutProfile = () => {
  // console.warn(form_number);
  router.push({
    path: "/LogOut",
    // query: { form_number: form_number },
  });
};
const handleInputFiles = async (files) => {
  for (let index = 0; index < files.length; index++) {
    const el = files[index];
    const base64String = await encodeFile(el);
    createDocumentBody.value.push({
      document_name: el.name,
      data: base64String.split(",")[1],
    });
  }
  // emit("on-input-files", files);
};

const encodeFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsDataURL(file);
  });
};

const onCreatePartnerDocumentUploads = async () => {
  try {
    const response = await PartnerServive.createUploadDocuments(
      formNumberOnUrl.value,
      createDocumentBody.value
    );
    if (response.data.is_success) return true;
    return false;
  } catch (e) {
    if (e.response) {
      const val = e.response.data;
      handlingErrorsMessage(val.message, val?.data.error);
      return false;
    }
    handlingErrorsMessage("unknown", e.message);
    return false;
  }
};
// const handleNexttime = () => {
//   var currentDate = new Date();
//   var uptime = currentDate.getTime();
//   console.log("Uptime: ", uptime); // แสดงค่าเวลาปัจจุบันที่เก็บไว้ในตัวแปร uptime
// };
</script>
