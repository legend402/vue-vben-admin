<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import {Page, useVbenDrawer, useVbenModal} from '@vben/common-ui';

import { NButton, NCard, NPopconfirm, useMessage } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';
import DictModal from "#/views/base/dict/modules/DictModal.vue";
import type { DictOption } from "#/views/base/dict/modules/types";

const message = useMessage();

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'title',
      label: '标题',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<DictOption> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  rowClassName: 'h-14',
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { title: '字典名称', field: 'dictName' },
    { title: '字典值', field: 'dictCode' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 'fit-content',
    },
  ],
  exportConfig: {},
  keepSource: true,
  pagerConfig: {
    pageSize: 10,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await requestClient.get('/dict/list', {
          params: {
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          },
        });
      },
    },
  },
};

const [Grid, listApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function onSubmit(values: DictOption) {
  requestClient.post('/dict/add', values).then(() => {
    modalApi.close();
    message.success('添加成功');
    listApi.reload();
  });
}

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
      const { values } = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
    }
  },
  title: '添加文章',
});

function handleAdd() {
  modalApi.open();
}
function handleDelete(id: string) {
  requestClient
    .delete('/dict/delete', {
      params: {
        id,
      },
    })
    .then(() => {
      listApi.reload();
      message.success('删除成功');
    });
}
async function handleEdit(row: DictOption) {
  drawApi.setData(row)
  drawApi.open()
}

const [DictDrawer, drawApi] = useVbenDrawer({
  connectedComponent: DictModal,
})

</script>

<template>
  <Page>
    <NCard>
      <Grid>
        <template #toolbar-actions>
          <NButton type="primary" @click="handleAdd">新增</NButton>
        </template>
        <template #action="{ row }">
          <NButton type="primary" quaternary @click="handleEdit(row)">
            编辑
          </NButton>
          <NPopconfirm @positive-click="handleDelete(row.id)">
            <template #trigger>
              <NButton type="primary" quaternary>删除</NButton>
            </template>
            确定删除吗？
          </NPopconfirm>
        </template>
      </Grid>
    </NCard>
    <Modal>
      <Form />
    </Modal>

    <DictDrawer />
  </Page>
</template>

<style scoped></style>
