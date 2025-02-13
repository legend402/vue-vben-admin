<script setup lang="ts">
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useMessage } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';
import useDictOption from '#/hooks/useDictOption';

const emits = defineEmits<{
  ok: [];
}>();

const message = useMessage();
const model = ref({});

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入姓名',
      },
      fieldName: 'username',
      label: '姓名',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入昵称',
      },
      fieldName: 'realName',
      label: '昵称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择性别',
        options: useDictOption('sex'),
      },
      fieldName: 'sex',
      label: '性别',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择角色',
        options: useDictOption('roles'),
        multiple: true,
      },
      fieldName: 'accessCodes',
      label: '角色',
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
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values.userId) {
        values.accessCodes = values.accessCodes.split(',');
        formApi.setValues(values);
        model.value = values;
        modalApi.setState({ title: '编辑用户' });
      } else {
        model.value = {};
        modalApi.setState({ title: '添加用户' });
      }
    }
  },
  title: '添加用户',
});

function onSubmit(values) {
  const isEdit = model.value.userId;
  const url = isEdit ? '/user/edit' : '/user/add';
  const method = isEdit ? 'put' : 'post';
  const params = Object.assign({}, model.value, values, {
    accessCodes: values.accessCodes.join(','),
  });
  requestClient[method](url, params).then(() => {
    emits('ok');
    modalApi.close();
    message.success('操作成功');
  });
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped></style>
