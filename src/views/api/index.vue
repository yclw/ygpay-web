<script setup lang="ts">
import { useApi } from "./utils/hook";
import { ref, computed, nextTick, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { delay, deviceDetection, useResizeObserver } from "@pureadmin/utils";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import ArrowUp from "~icons/ep/arrow-up";
import ArrowDown from "~icons/ep/arrow-down";

defineOptions({
  name: "SystemApi"
});

const formRef = ref();
const tableRef = ref();
const contentRef = ref();

const iconClass = computed(() => {
  return [
    "text-black",
    "dark:text-white",
    "duration-100",
    "hover:text-primary!",
    "cursor-pointer",
    "outline-hidden"
  ];
});

// 渲染提示框属性
const rendTippyProps = (content: string) => {
  return {
    content, // 提示内容
    offset: [0, 18], // 偏移量
    duration: [300, 0], // 显示时间
    followCursor: true, // 跟随鼠标
    hideOnClick: "toggle" // 点击隐藏
  };
};

const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  sortField,
  sortDesc,
  onSearch,
  resetForm,
  toggleSortOrder,
  openDialog,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useApi();

onMounted(() => {
  useResizeObserver(contentRef, async () => {
    await nextTick();
    delay(60).then(() => {
      // treeHeight.value = parseFloat(
      //   subBefore(tableRef.value.getTableDoms().tableWrapper.style.height, "px")
      // );
    });
  });
});
</script>

<template>
  <div class="main">
    <!-- 查询 -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="API名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入API名称"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="API路径：" prop="path">
        <el-input
          v-model="form.path"
          placeholder="请输入API路径"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="请求方法：" prop="method">
        <el-select
          v-model="form.method"
          placeholder="请选择请求方法"
          clearable
          class="w-[180px]!"
        >
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
          <el-option label="PATCH" value="PATCH" />
        </el-select>
      </el-form-item>
      <el-form-item label="分组名称：" prop="groupName">
        <el-input
          v-model="form.groupName"
          placeholder="请输入分组名称"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="w-[180px]!"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          placeholder="开始日期"
          class="w-[150px]!"
          clearable
        />
        <span class="mx-2">至</span>
        <el-date-picker
          v-model="form.endDate"
          type="date"
          placeholder="结束日期"
          class="w-[150px]!"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri/search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 内容 -->
    <div
      ref="contentRef"
      :class="['flex', deviceDetection() ? 'flex-wrap' : '']"
    >
      <!-- 列表栏 -->
      <PureTableBar
        class="w-full"
        title="API管理"
        :columns="columns"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog()"
          >
            新增API
          </el-button>
          <div class="flex items-center gap-2 ml-4">
            <span class="text-sm text-gray-600">排序：</span>
            <el-select
              v-model="sortField"
              placeholder="排序字段"
              size="small"
              class="w-[120px]!"
              @change="onSearch"
            >
              <el-option label="API UID" value="apiUid" />
              <el-option label="API名称" value="name" />
              <el-option label="API路径" value="path" />
              <el-option label="请求方法" value="method" />
              <el-option label="分组名称" value="groupName" />
              <el-option label="排序" value="sort" />
              <el-option label="状态" value="status" />
              <el-option label="创建时间" value="createdAt" />
            </el-select>
            <component
              :is="sortDesc ? ArrowDown : ArrowUp"
              v-tippy="
                rendTippyProps(
                  sortDesc
                    ? '当前降序，点击切换为升序'
                    : '当前升序，点击切换为降序'
                )
              "
              :class="['w-[16px]', iconClass]"
              @click="toggleSortOrder"
            />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 108 }"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="{ ...pagination, size }"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(EditPen)"
                @click="openDialog('修改', row)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除API名称为${row.Name}的这条数据`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
