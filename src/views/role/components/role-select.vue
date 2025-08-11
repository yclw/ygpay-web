<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getRoleList, type RoleModel } from "@/api/role";
import { message } from "@/utils/message";

interface Props {
  modelValue?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

interface Emits {
  (e: "update:modelValue", value?: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  placeholder: "请选择父级角色",
  clearable: true,
  disabled: false
});

const emit = defineEmits<Emits>();

const selectRef = ref();
const loading = ref(false);
const roleOptions = ref<RoleModel[]>([]);
const searchKeyword = ref("");

// 递归查找当前选中的角色
const findSelectedRole = (
  roles: RoleModel[],
  targetUid: string
): RoleModel | undefined => {
  for (const role of roles) {
    if (role.roleUid === targetUid) {
      return role;
    }
    if (role.children) {
      const found = findSelectedRole(role.children, targetUid);
      if (found) return found;
    }
  }
  return undefined;
};

// 当前选中的角色
const selectedRole = computed(() => {
  if (!props.modelValue) return undefined;
  return findSelectedRole(roleOptions.value, props.modelValue);
});

// 过滤后的角色（保持树结构）
const filteredRoles = computed(() => {
  if (!searchKeyword.value.trim()) {
    return roleOptions.value;
  }

  const filterRoles = (roles: RoleModel[]): RoleModel[] => {
    return roles
      .filter(role => {
        const matches =
          role.name.includes(searchKeyword.value) ||
          role.key.includes(searchKeyword.value) ||
          (role.remark && role.remark.includes(searchKeyword.value));

        if (matches) return true;

        // 如果子角色匹配，也包含父角色
        if (role.children && role.children.length > 0) {
          const filteredChildren = filterRoles(role.children);
          if (filteredChildren.length > 0) {
            return true;
          }
        }

        return false;
      })
      .map(role => ({
        ...role,
        children: role.children ? filterRoles(role.children) : undefined
      }));
  };

  return filterRoles(roleOptions.value);
});

// 表格列定义
const columns: TableColumnList = [
  {
    label: "角色名称",
    prop: "name",
    minWidth: 150
  },
  {
    label: "角色标识",
    prop: "key",
    minWidth: 120
  },
  {
    label: "备注",
    prop: "remark",
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    label: "状态",
    prop: "status",
    width: 80,
    cellRenderer: ({ row }) => {
      return row.status === 1 ? "启用" : "禁用";
    }
  }
];

// 加载角色数据
const loadRoleData = async () => {
  try {
    loading.value = true;
    const { data } = await getRoleList();
    roleOptions.value = data.tree || [];
  } catch (error) {
    message("获取角色数据失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

// 行样式
const rowStyle = ({ row }) => {
  return {
    cursor: "pointer",
    background:
      row.roleUid === props.modelValue ? "var(--el-fill-color-light)" : ""
  };
};

// 行点击事件
const onRowClick = (row: RoleModel) => {
  emit("update:modelValue", row.roleUid);
  selectRef.value.blur();
};

// 清空选择
const handleClear = () => {
  emit("update:modelValue", undefined);
};

// 组件挂载时加载数据
onMounted(() => {
  loadRoleData();
});
</script>

<template>
  <el-select
    ref="selectRef"
    :model-value="selectedRole?.name"
    class="w-full"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    @clear="handleClear"
  >
    <template #empty>
      <div class="p-4">
        <!-- 搜索框 -->
        <div class="mb-3">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索角色..."
            clearable
            size="small"
            prefix-icon="Search"
          />
        </div>

        <!-- 角色表格 -->
        <div v-loading="loading" style="max-height: 300px; overflow-y: auto">
          <pure-table
            v-if="filteredRoles.length > 0"
            row-key="roleUid"
            align-whole="left"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            :row-style="rowStyle"
            :data="filteredRoles"
            :columns="columns"
            size="small"
            @row-click="onRowClick"
          />
          <div v-else class="text-center text-gray-500 py-4">
            {{ searchKeyword ? "暂无匹配的角色" : "暂无角色数据" }}
          </div>
        </div>
      </div>
    </template>
  </el-select>
</template>

<style lang="scss" scoped>
:deep(.el-select-dropdown__empty) {
  padding: 0;
}

:deep(.pure-table .el-table__row) {
  &:hover {
    background-color: var(--el-table-row-hover-bg-color);
  }
}
</style>
