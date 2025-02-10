<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from "#/adapter/form";
import {ref} from "vue";
import type {DictItemOption} from "#/views/base/dict/modules/types";
import {requestClient} from "#/api/request";
import {useMessage} from "naive-ui";

const model = ref({} as DictItemOption)
const message = useMessage();
const emits = defineEmits<{
  ok: []
}>()

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = drawerApi.getData<DictItemOption>();
      if (values) {
        formApi.setValues(values);
        model.value = values
      }
    }
  },
  title: '添加字典项',
});
const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典名称',
      },
      fieldName: 'label',
      label: '字典名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典值',
      },
      fieldName: 'value',
      label: '字典值',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请选择字典排序',
        style: {
          width: '100%',
        }
      },
      defaultValue: 0,
      fieldName: 'sort',
      label: '字典排序',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典描述',
      },
      fieldName: 'desc',
      label: '字典描述',
    },
    {
      component: 'Switch',
      componentProps: {
        placeholder: '请选择字典是否启用',
        checkedValue: 1,
        unCheckedValue: 0,
      },
      defaultValue: 1,
      fieldName: 'status',
      label: '状态',
    },
  ],
  showDefaultActions: false,
});

function onSubmit(values: Record<string, any>) {
  const isEdit = model.value.id;
  const url = isEdit ? '/dictItem/edit' : '/dictItem/add';
  const method = isEdit ? 'put' : 'post';
  const params = Object.assign({}, model.value, values)
  requestClient[method](url, params).then(() => {
    emits('ok')
    drawerApi.close();
    message.success('操作成功');
  });
}

</script>

<template>
  <Drawer>
    <Form />
  </Drawer>
</template>

<style scoped>

</style>
