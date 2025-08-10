<script setup lang="ts">
import { ref, reactive, nextTick, watch, onMounted } from "vue";
import { getRoleMenu, updateRoleMenu, type RoleMenuModel } from "@/api/role";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Check from "~icons/ep/check";
import Close from "~icons/ep/close";

interface Props {
  roleId: number;
  roleName: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "close"): void;
}>();

const loading = ref(false);
const confirmLoading = ref(false);
const menuTreeData = ref<RoleMenuModel[]>([]);
const selectedMenuUids = ref<string[]>([]);
const searchKeyword = ref("");
const treeRef = ref();

// 树形配置
const treeProps = {
  label: "title",
  children: "children"
};

// 加载角色菜单权限数据
const loadRoleMenuData = async () => {
  try {
    loading.value = true;
    const { data } = await getRoleMenu({ id: props.roleId });
    menuTreeData.value = data.tree;

    // 获取已选中的菜单UID列表
    // 策略：只选择叶子节点（没有children的节点），避免Element Plus自动父子关联
    const selectedUids: string[] = [];
    const collectSelectedUids = (nodes: RoleMenuModel[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          // 有子节点，递归处理子节点，不选择父节点
          collectSelectedUids(node.children);
        } else {
          // 叶子节点，根据use状态决定是否选中
          if (node.use) {
            selectedUids.push(node.menuUid);
          }
        }
      });
    };
    collectSelectedUids(data.tree);
    selectedMenuUids.value = selectedUids;

    // 设置树的默认选中状态
    await nextTick();
    if (treeRef.value) {
      // 只设置真正应该被选中的节点，不包含父节点路径
      treeRef.value.setCheckedKeys(selectedUids);
    }
  } catch (error) {
    message("获取菜单权限数据失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

// 搜索菜单
const handleSearch = () => {
  if (treeRef.value) {
    treeRef.value.filter(searchKeyword.value);
  }
};

// 重置搜索
const resetSearch = () => {
  searchKeyword.value = "";
  if (treeRef.value) {
    treeRef.value.filter("");
  }
};

// 树形搜索过滤函数
const filterNode = (value: string, data: RoleMenuModel) => {
  if (!value) return true;
  return data.title.includes(value);
};

// 处理树节点选中变化
const handleCheckChange = () => {
  if (treeRef.value) {
    // 简单获取当前选中的节点，不做额外处理
    // 父节点路径的计算放在提交时进行
    const checkedKeys = treeRef.value.getCheckedKeys();
    selectedMenuUids.value = checkedKeys;
  }
};

// 全选所有菜单
const handleSelectAll = () => {
  const allNodeUids: string[] = [];
  const collectAllUids = (nodes: RoleMenuModel[]) => {
    nodes.forEach(node => {
      allNodeUids.push(node.menuUid);
      if (node.children && node.children.length > 0) {
        collectAllUids(node.children);
      }
    });
  };
  collectAllUids(menuTreeData.value);

  if (treeRef.value) {
    treeRef.value.setCheckedKeys(allNodeUids);
    selectedMenuUids.value = allNodeUids;
  }
};

// 取消全选
const handleClearAll = () => {
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([]);
    selectedMenuUids.value = [];
  }
};

// 计算需要包含父节点路径的完整菜单UID列表
const calculateCompleteMenuUids = (checkedUids: string[]): string[] => {
  const allRequiredKeys = new Set<string>();

  // 添加所有直接选中的节点
  checkedUids.forEach(key => allRequiredKeys.add(key));

  // 为每个选中的节点，向上查找并添加所有父节点
  const findParentPath = (
    nodeUid: string,
    nodes: RoleMenuModel[],
    parents: string[] = []
  ): string[] => {
    for (const node of nodes) {
      if (node.menuUid === nodeUid) {
        return [...parents, node.menuUid];
      }
      if (node.children) {
        const result = findParentPath(nodeUid, node.children, [
          ...parents,
          node.menuUid
        ]);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  };

  checkedUids.forEach(key => {
    const parentPath = findParentPath(key, menuTreeData.value);
    parentPath.forEach(parentUid => allRequiredKeys.add(parentUid));
  });

  return Array.from(allRequiredKeys);
};

// 确认保存
const handleConfirm = async () => {
  try {
    confirmLoading.value = true;

    // 获取当前选中的节点
    const currentCheckedKeys = treeRef.value
      ? treeRef.value.getCheckedKeys()
      : selectedMenuUids.value;

    // 计算包含父节点路径的完整菜单UID列表
    const completeMenuUids = calculateCompleteMenuUids(currentCheckedKeys);

    await updateRoleMenu({
      id: props.roleId,
      menuList: completeMenuUids
    });
    message("菜单权限更新成功", { type: "success" });
    emit("confirm");
    emit("close");
  } catch (error) {
    message("菜单权限更新失败", { type: "error" });
  } finally {
    confirmLoading.value = false;
  }
};

// 关闭对话框
const handleClose = () => {
  emit("close");
};

// 组件挂载时加载数据
onMounted(() => {
  if (props.roleId) {
    loadRoleMenuData();
  }
});

// 暴露方法给父组件调用
defineExpose({
  handleConfirm
});
</script>

<template>
  <div>
    <!-- 搜索和操作栏 -->
    <div class="mb-4 flex items-center gap-4 flex-wrap">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索菜单名称"
        class="w-[250px]"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button
            :icon="useRenderIcon('ri/search-line')"
            @click="handleSearch"
          />
        </template>
      </el-input>
      <el-button @click="resetSearch">重置</el-button>

      <div class="flex-1" />

      <div class="flex items-center gap-2">
        <el-button size="small" type="primary" @click="handleSelectAll"
          >全选</el-button
        >
        <el-button size="small" @click="handleClearAll">清空</el-button>
      </div>
    </div>

    <!-- 菜单树 -->
    <div v-loading="loading" class="border border-gray-200 rounded-lg p-4">
      <div
        v-if="menuTreeData.length === 0"
        class="text-center text-gray-500 py-8"
      >
        暂无菜单数据
      </div>

      <el-tree
        v-else
        ref="treeRef"
        :data="menuTreeData"
        :props="treeProps"
        :filter-node-method="filterNode"
        show-checkbox
        node-key="menuUid"
        default-expand-all
        class="menu-permission-tree"
        @check-change="handleCheckChange"
      >
        <template #default="{ data }">
          <div class="flex items-center w-full">
            <span class="text-sm">{{ data.title }}</span>
            <span class="ml-2 text-xs text-gray-400">#{{ data.menuUid }}</span>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 底部信息 -->
    <div class="mt-4 text-sm text-gray-500 text-center">
      已选择 {{ selectedMenuUids.length }} 个菜单权限
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.menu-permission-tree) {
  .el-tree-node__content {
    height: 36px;

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  .el-tree-node__label {
    font-size: 14px;
  }

  .el-checkbox {
    margin-right: 8px;
  }
}

:deep(.el-tree-node__expand-icon) {
  font-size: 16px;
}
</style>
