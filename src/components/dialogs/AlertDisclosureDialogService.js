import { reactive, ref, toRefs } from 'vue';

const state = reactive({
  isVisible: false,
  title: '',
  message: ''
});

const resolvePromise = ref(null);

function showAlertDisclosure(title, message) {
  state.title = title;
  state.message = message;
  state.isVisible = true;

  return new Promise((resolve) => {
    resolvePromise.value = resolve;
  });
}

function closeDialog() {
  state.isVisible = false;
}

function confirmDialog() {
  if (resolvePromise.value) {
    resolvePromise.value(true);
    resolvePromise.value = null;
  }
  closeDialog();
}


export function useAlerDisclosuretDialogDialog() {
  return {
    ...toRefs(state),
    showAlertDisclosure,
    confirmDialog,
  };
}
