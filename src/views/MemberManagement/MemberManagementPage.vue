<template>
  <v-container>
    <h2>Member Mangement</h2>
    <div class="text-center mt-5">
      <h2>{{ isTitle }}</h2>
    </div>

    <component
      :is="currentComponent"
         :item="isItem"
         :index="1"

        @is-title="toggleTitle"
        @is-view="toggleView"
    />
  </v-container>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import ListMember from "@/views/MemberManagement/ListMember.vue";
import MemberForm from "@/components/forms/MemberForm.vue";
import PartnerServive from "@/apis/PartnerServive";
import TabsUser from '@/views/MemberManagement/TabsMember';


import { useRouter } from "vue-router";
const router = useRouter();
const currentComponent = ref(null);
const isTitle = ref(null);
const isIndex = ref(-1);

const id = ref(null);

const bp_num = ref("");
const isItem = ref({});

onBeforeMount(() => {
  currentComponent.value = ListMember;
  bp_num.value = sessionStorage.getItem("bp_numbers");
  console.log("bp_number_dashbaord", bp_num.value);
});

const toggleTitle =(e)=> { console.log(e); isTitle.value = e}


const toggleView = (view, payload = {}) => {
  switch (view) {
    case "user-main":
      currentComponent.value = ListMember;
      break;
    case "user-add":
      {
        isIndex.value = -1;
        currentComponent.value = MemberForm;
        currentComponent.value = TabsUser;


        // currentComponent.value = TabsUser;
      }
      break;
    case "user-edit":
      {
        currentComponent.value = MemberForm;
        isIndex.value = 0;

        isItem.value =  {... payload}
      }
      break;
    default:
      currentComponent.value = ListMember;
      break;
  }
};
</script>
