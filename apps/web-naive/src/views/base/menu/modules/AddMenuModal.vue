<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';
import {useVbenForm} from "#/adapter/form";
import {requestClient} from "#/api/request";
import {ref} from "vue";
import {useMessage} from 'naive-ui'
import type {MenuItemProps} from "#/views/base/menu/types";
import { omit } from 'lodash-es'

const emits = defineEmits<{
  ok: []
}>()

const message = useMessage()
const model = ref({} as MenuItemProps)
const menu = ref<MenuItemProps[]>([])

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择父级菜单',
        options: menu,
        'key-field': 'id',
        'label-field': 'name',
      },
      fieldName: 'parentId',
      label: '父级菜单',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入菜单名称',
      },
      fieldName: 'name',
      label: '菜单名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入菜单路径',
      },
      fieldName: 'path',
      label: '菜单路径',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请选择组件路径',
      },
      fieldName: 'component',
      label: '组件路径',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '',
        style: 'width: 100%;'
      },
      defaultValue: 0,
      fieldName: 'sort',
      label: '排序',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请选择图标',
      },
      fieldName: 'icon',
      label: '图标',
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
      getMenu()
      const values = modalApi.getData<MenuItemProps>();
      if (values.id) {
        formApi.setValues(values);
        model.value = omit(values, ['children']);
        modalApi.setState({ title: '编辑菜单' })
      } else {
        if (values.parentId) {
          formApi.setValues(values);
        }
        model.value = {} as MenuItemProps;
        modalApi.setState({ title: '添加菜单' })
      }
    }
  },
  title: '添加用户',
});

function onSubmit(values: MenuItemProps) {
  const isEdit = model.value.id;
  const url = isEdit ? '/menu/edit' : '/menu/add';
  const method = isEdit ? 'put' : 'post';
  const params = Object.assign({}, model.value, values)
  requestClient[method](url, params).then(() => {
    emits('ok')
    modalApi.close();
    message.success('操作成功');
  });
}

function getMenu() {
  requestClient.get('/menu/tree', {})
    .then(res => {
      menu.value = res || []
    })
}
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped>

</style>
