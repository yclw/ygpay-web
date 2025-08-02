<script setup lang="ts">
import { useMember } from "./utils/hook";
import { ref, computed, nextTick, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  delay,
  subBefore,
  deviceDetection,
  useResizeObserver
} from "@pureadmin/utils";

import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import ArrowUp from "~icons/ep/arrow-up";
import ArrowDown from "~icons/ep/arrow-down";

defineOptions({
  name: "SystemMember"
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

const rendTippyProps = (content: string) => {
  return {
    content,
    offset: [0, 18],
    duration: [300, 0],
    followCursor: true,
    hideOnClick: "toggle"
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
} = useMember();

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
      <el-form-item label="用户名：" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="请输入昵称"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input
          v-model="form.mobile"
          placeholder="请输入手机号"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="角色：" prop="roleId">
        <el-input-number
          v-model="form.roleId"
          placeholder="请输入角色ID"
          clearable
          class="w-[180px]!"
          :min="1"
        />
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-select
          v-model="form.sex"
          placeholder="请选择性别"
          clearable
          class="w-[180px]!"
        >
          <el-option label="保密" :value="0" />
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
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
        title="用户管理"
        :columns="columns"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button
            type="primary"
            :icon="useRenderIcon(AddFill)"
            @click="openDialog()"
          >
            新增用户
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
              <el-option label="UID" value="uid" />
              <el-option label="用户名" value="username" />
              <el-option label="昵称" value="nickname" />
              <el-option label="角色ID" value="roleId" />
              <el-option label="邮箱" value="email" />
              <el-option label="手机号" value="mobile" />
              <el-option label="性别" value="sex" />
              <el-option label="排序" value="sort" />
              <el-option label="状态" value="status" />
              <el-option label="最后活跃" value="lastActiveAt" />
              <el-option label="创建时间" value="createdAt" />
              <el-option label="更新时间" value="updatedAt" />
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
                :title="`是否确认删除用户名为${row.username}的这条数据`"
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
