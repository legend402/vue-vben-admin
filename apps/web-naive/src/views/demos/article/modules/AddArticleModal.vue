<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import { useMessage } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from "#/api/request";
import { ref } from "vue";

const emits = defineEmits<{
  ok: [];
}>();

const message = useMessage();
const model = ref();

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入标题',
      },
      fieldName: 'title',
      label: '标题',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入内容',
        type: 'textarea',
      },
      fieldName: 'content',
      label: '内容',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values.id) {
        formApi.setValues(values);
        model.value = values;
        modalApi.setState({ title: '编辑文章' });
      } else {
        model.value = {};
        modalApi.setState({ title: '添加文章' });
      }
    }
  },
  title: '添加文章',
});

function onSubmit(values: any) {
  const isEdit = model.value.id;
  const url = isEdit ? '/article/edit' : '/article/add';
  const method = isEdit ? 'put' : 'post';
  const params = Object.assign({}, model.value, values);
  requestClient[method](url, params).then(() => {
    modalApi.close();
    message.success('添加成功');
    emits('ok');
  });
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped></style>
