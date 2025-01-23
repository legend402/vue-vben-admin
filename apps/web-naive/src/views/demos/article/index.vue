<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { nextTick } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { NButton, NCard, NPopconfirm, useMessage } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

const message = useMessage();

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

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

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  rowClassName: 'h-14',
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { title: '标题', field: 'title' },
    { title: '内容', field: 'content' },
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
        return await requestClient.get('/article/list', {
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

function onSubmit() {
  // requestClient.post('/article/add', values)
  // .then(() => {
  //   modalApi.close();
  //   message.success('添加成功');
  //   listApi.reload();
  // })
}

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
function handlePositiveClick({ id }: { id: string }) {
  requestClient
    .delete('/article/delete', {
      params: {
        id,
      },
    })
    .then(() => {
      listApi.reload();
      message.success('删除成功');
    });
}
async function handleEdit(row: any) {
  modalApi.open();
  await nextTick();
  formApi.setValues(row);
}
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
          <NPopconfirm @positive-click="handlePositiveClick(row)">
            <template #trigger>
              <NButton type="primary" quaternary>删除</NButton>
            </template>
            确定删除吗？
          </NPopconfirm>
        </template>
      </Grid>
    </NCard>
  </Page>
  <Modal>
    <Form />
  </Modal>
</template>

<style scoped></style>
