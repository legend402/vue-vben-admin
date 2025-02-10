<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { NButton, NCard, NPopconfirm, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';
import AddMenuModal from "#/views/base/menu/modules/AddMenuModal.vue";
import type {MenuItemProps} from "#/views/base/menu/types";

const message = useMessage();

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '菜单名称',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<MenuItemProps> = {
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    childrenField: 'children',
  },
  rowClassName: 'h-14',
  columns: [
    { title: '序号', type: 'seq', width: 60, treeNode: true  },
    { title: '菜单名称', field: 'name' },
    { title: '菜单路径', field: 'path' },
    { title: '组件路径', field: 'component' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
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
        return await requestClient.get('/menu/tree', {
          params: {
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          },
        });
      },
    },
    response: {
      result: params => {
        return params.data
      },
    }
  },
};

const [Grid, listApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [Modal, modalApi] = useVbenModal({
  connectedComponent: AddMenuModal,
});

function handleAdd() {
  modalApi.setData(null)
  modalApi.open();
}
function handleDelete(id: string) {
  requestClient
    .delete('/menu/delete', {
      params: {
        id,
      },
    })
    .then(() => {
      listApi.reload();
      message.success('删除成功');
    });
}
function handleEdit(row: MenuItemProps) {
  modalApi.setData(row)
  modalApi.open();
}
function handleAddChild(row: MenuItemProps) {
  modalApi.setData({ parentId: row.id })
  modalApi.open();
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
          <NButton type="primary" quaternary @click="handleAddChild(row)">
            添加下级
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

    <Modal @ok="listApi.reload" />
  </Page>
</template>

<style scoped></style>
