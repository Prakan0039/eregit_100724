<template>
  <v-container fluid>
    <h2>User Mangement</h2>
    <div class="text-center mt-5">
      <h2>{{isTitle}}</h2>
    </div>

    <component
        :is="currentComponent"
        :index="1"
        :item="isItem"
        @is-title="toggleTitle"
        @is-view="toggleView"
         />
  </v-container>
</template>
<script setup>
/*eslint-disable no-unused-vars  */
import { ref, onBeforeMount  } from 'vue';
import ListUser from '@/views/UserMangement/ListUser';
import TabsUser from '@/views/UserMangement/TabsUser';
import UserForm from '@/components/forms/UserForm.vue';



const currentComponent = ref(null);
const isTitle = ref(null);
const isIndex = ref(-1);
const isItem = ref({});

onBeforeMount(() => {
  currentComponent.value = ListUser;

});

const toggleTitle =(e)=> { console.log(e); isTitle.value = e}

const toggleView =(view, payload = {})=> {
  switch (view) {
    case "user-main":
        currentComponent.value = ListUser;
      break;
    case "user-add":{
        isIndex.value = -1;
        currentComponent.value = TabsUser;
    }
    break;
    case "user-edit":{
        currentComponent.value = UserForm;
        isIndex.value = 0;
        isItem.value =  {... payload}
    }
    break;
    default:
       currentComponent.value = ListUser;
    break;
  }
}


</script>

