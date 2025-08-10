<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getMenuList, type MenuModel } from "@/api/menu";
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
  placeholder: "请选择父级菜单",
  clearable: true,
  disabled: false
});

const emit = defineEmits<Emits>();

const selectRef = ref();
const loading = ref(false);
const menuOptions = ref<MenuModel[]>([]);
const searchKeyword = ref("");

// 递归查找当前选中的菜单
const findSelectedMenu = (
  menus: MenuModel[],
  targetUid: string
): MenuModel | undefined => {
  for (const menu of menus) {
    if (menu.menuUid === targetUid) {
      return menu;
    }
    if (menu.children) {
      const found = findSelectedMenu(menu.children, targetUid);
      if (found) return found;
    }
  }
  return undefined;
};

// 当前选中的菜单
const selectedMenu = computed(() => {
  if (!props.modelValue) return undefined;
  return findSelectedMenu(menuOptions.value, props.modelValue);
});

// 过滤后的菜单（保持树结构）
const filteredMenus = computed(() => {
  if (!searchKeyword.value.trim()) {
    return menuOptions.value;
  }

  const filterMenus = (menus: MenuModel[]): MenuModel[] => {
    return menus
      .filter(menu => {
        const matches =
          menu.title.includes(searchKeyword.value) ||
          menu.name.includes(searchKeyword.value) ||
          menu.path.includes(searchKeyword.value);

        if (matches) return true;

        // 如果子菜单匹配，也包含父菜单
        if (menu.children && menu.children.length > 0) {
          const filteredChildren = filterMenus(menu.children);
          if (filteredChildren.length > 0) {
            return true;
          }
        }

        return false;
      })
      .map(menu => ({
        ...menu,
        children: menu.children ? filterMenus(menu.children) : undefined
      }));
  };

  return filterMenus(menuOptions.value);
});

// 表格列定义
const columns: TableColumnList = [
  {
    label: "菜单标题",
    prop: "title",
    minWidth: 200
  },
  {
    label: "菜单名称",
    prop: "name",
    minWidth: 120
  },
  {
    label: "路径",
    prop: "path",
    minWidth: 150
  },
  {
    label: "类型",
    prop: "type",
    width: 80,
    cellRenderer: ({ row }) => {
      const typeMap = { 0: "目录", 1: "菜单", 2: "外链" };
      return typeMap[row.type] || "未知";
    }
  }
];

// 加载菜单数据
const loadMenuData = async () => {
  try {
    loading.value = true;
    const { data } = await getMenuList();
    menuOptions.value = data.tree || [];
  } catch (error) {
    message("获取菜单数据失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

// 行样式
const rowStyle = ({ row }) => {
  return {
    cursor: "pointer",
    background:
      row.menuUid === props.modelValue ? "var(--el-fill-color-light)" : ""
  };
};

// 行点击事件
const onRowClick = (row: MenuModel) => {
  emit("update:modelValue", row.menuUid);
  selectRef.value.blur();
};

// 清空选择
const handleClear = () => {
  emit("update:modelValue", undefined);
};

// 组件挂载时加载数据
onMounted(() => {
  loadMenuData();
});
</script>

<template>
  <el-select
    ref="selectRef"
    :model-value="selectedMenu?.title"
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
            placeholder="搜索菜单..."
            clearable
            size="small"
            prefix-icon="Search"
          />
        </div>

        <!-- 菜单表格 -->
        <div v-loading="loading" style="max-height: 300px; overflow-y: auto">
          <pure-table
            v-if="filteredMenus.length > 0"
            row-key="menuUid"
            align-whole="left"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            :row-style="rowStyle"
            :data="filteredMenus"
            :columns="columns"
            size="small"
            @row-click="onRowClick"
          />
          <div v-else class="text-center text-gray-500 py-4">
            {{ searchKeyword ? "暂无匹配的菜单" : "暂无菜单数据" }}
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
