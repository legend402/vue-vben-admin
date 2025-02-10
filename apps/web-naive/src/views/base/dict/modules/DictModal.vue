<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from "#/adapter/form";
import type {DictItemOption, DictOption} from "#/views/base/dict/modules/types";
import {ref, nextTick} from "vue";
import {useVbenVxeGrid} from "#/adapter/vxe-table";
import {requestClient} from "#/api/request";
import {NButton, NPopconfirm, useMessage} from "naive-ui";
import DictItemModal from "#/views/base/dict/modules/DictItemModal.vue";

const model = ref({} as DictOption);

const message = useMessage();

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
      const values = drawerApi.getData<DictOption>();
      if (values) {
        formApi.setValues(values);
        model.value = values;
        setTimeout(() => {
          tableApi.reload()
        }, 100)
      }
    }
  },
  title: '编辑字典项',
});
const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典名称',
      },
      fieldName: 'dictName',
      label: '字典名称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典值',
      },
      fieldName: 'dictCode',
      label: '字典值',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典描述',
      },
      fieldName: 'dictDesc',
      label: '字典描述',
    },
  ],
  showDefaultActions: false,
});

function onSubmit(values: Record<string, any>) {
  const isEdit = model.value.id;
  const url = isEdit ? '/dict/edit' : '/dict/add';
  const method = isEdit ? 'post' : 'put';
  const params = Object.assign({}, model.value, values)
  requestClient[method](url, params).then(() => {
    drawerApi.close();
    message.success('操作成功');
  });
}

const [Table, tableApi] = useVbenVxeGrid({
  gridOptions: {
    checkboxConfig: {
      highlight: true,
      labelField: 'name',
    },
    columns: [
      { title: '序号', type: 'seq', width: 50 },
      { title: '字典名称', field: 'label' },
      { title: '字典值', field: 'value' },
      {
        field: 'action',
        fixed: 'right',
        slots: { default: 'action' },
        title: '操作',
        width: 'fit-content',
      },
    ],
    exportConfig: {},
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async ({ page }) => {
          return await requestClient.get(`/dict/getDictByCode`, {
            params: {
              pageNum: page.currentPage,
              pageSize: page.pageSize,
              dictCode: model.value.dictCode,
            },
          });
        },
      },
    },
  }
})

const [DictItemDrawer, drawApi] = useVbenDrawer({
  connectedComponent: DictItemModal,
})

function handleAddItem() {
  drawApi.setData({
    pid: model.value.id
  })
  drawApi.open()
}
function handleEditItem(row: DictItemOption) {
  drawApi.setData(row)
  drawApi.open()
}

function handleDelete(id: string) {
  requestClient
    .delete('/dictItem/delete', {
      params: {
        id,
      },
    })
    .then(() => {
      tableApi.reload();
      message.success('删除成功');
    });
}
</script>

<template>
  <Drawer>
    <Form />
    <Table>
      <template #toolbar-actions>
        <NButton type="primary" @click="handleAddItem">新增</NButton>
      </template>
      <template #action="{ row }">
        <NButton type="primary" quaternary @click="handleEditItem(row)">
          编辑
        </NButton>
        <NPopconfirm @positive-click="handleDelete(row.id)">
          <template #trigger>
            <NButton type="primary" quaternary>删除</NButton>
          </template>
          确定删除吗？
        </NPopconfirm>
      </template>
    </Table>
    <DictItemDrawer @ok="tableApi.reload" />
  </Drawer>
</template>

<style scoped>

</style>
