<template>
  <div class="main">
    <!-- 页面标题 -->
    <div class="bg-bg_color p-4 mb-4">
      <h2 class="text-lg font-semibold">菜单树</h2>
      <p class="text-sm text-gray-600 mt-1">展示所有菜单的树状结构</p>
    </div>

    <!-- 菜单树内容 -->
    <div class="bg-bg_color p-4">
      <el-card v-loading="loading">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-base font-medium">菜单树结构</span>
            <el-button
              type="primary"
              :icon="useRenderIcon('ri/refresh-line')"
              @click="refreshTree"
            >
              刷新
            </el-button>
          </div>
        </template>

        <el-tree
          v-if="treeData.length > 0"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          class="menu-tree"
        >
          <template #default="{ data }">
            <div class="tree-node">
              <div class="node-info">
                <span class="node-id">ID: {{ data.id }}</span>
                <span class="node-title">{{ data.title }}</span>
              </div>
              <el-button
                type="primary"
                link
                size="small"
                @click="showDetail(data.id)"
              >
                详情
              </el-button>
            </div>
          </template>
        </el-tree>

        <el-empty v-else description="暂无菜单数据" />
      </el-card>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="菜单详情"
      width="600px"
      :before-close="handleClose"
    >
      <div v-loading="detailLoading">
        <el-descriptions
          v-if="currentMenu"
          :column="2"
          border
          class="menu-detail"
        >
          <el-descriptions-item label="菜单ID">
            {{ currentMenu.id }}
          </el-descriptions-item>
          <el-descriptions-item label="菜单名称">
            {{ currentMenu.name }}
          </el-descriptions-item>
          <el-descriptions-item label="菜单标题">
            {{ currentMenu.title }}
          </el-descriptions-item>
          <el-descriptions-item label="菜单路径">
            {{ currentMenu.path }}
          </el-descriptions-item>
          <el-descriptions-item label="菜单图标">
            <div class="flex items-center gap-2">
              <component
                :is="useRenderIcon(currentMenu.icon)"
                v-if="currentMenu.icon"
                class="w-4 h-4"
              />
              <span>{{ currentMenu.icon || "无" }}</span>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="菜单类型">
            <el-tag :type="getTypeTagType(currentMenu.type)">
              {{ getTypeText(currentMenu.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="父级ID">
            {{ currentMenu.parentId || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="父级标题">
            {{ currentMenu.parentTitle || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="排序">
            {{ currentMenu.sort }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentMenu.status === 1 ? 'success' : 'danger'">
              {{ currentMenu.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="显示父菜单">
            <el-tag :type="currentMenu.showParent ? 'success' : 'info'">
              {{ currentMenu.showParent ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="显示该菜单">
            <el-tag :type="currentMenu.showLink ? 'success' : 'info'">
              {{ currentMenu.showLink ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否缓存">
            <el-tag :type="currentMenu.keepAlive ? 'success' : 'info'">
              {{ currentMenu.keepAlive ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="重定向" :span="2">
            {{ currentMenu.redirect || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="组件路径" :span="2">
            {{ currentMenu.component || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="内嵌地址" :span="2">
            {{ currentMenu.frameSrc || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="外部链接" :span="2">
            {{ currentMenu.url || "无" }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(currentMenu.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(currentMenu.updatedAt) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  getMenuTree,
  getMenuOne,
  type MenuTreeModel,
  type MenuModel
} from "@/api/menu";

defineOptions({
  name: "MenuTree"
});

// 响应式数据
const loading = ref(false);
const detailLoading = ref(false);
const detailVisible = ref(false);
const treeData = ref<MenuTreeModel[]>([]);
const currentMenu = ref<MenuModel | null>(null);

// 树形控件配置
const defaultProps = {
  children: "children",
  label: "title"
};

// 获取菜单树数据
const loadMenuTree = async () => {
  loading.value = true;
  try {
    const response = await getMenuTree();
    if (response.success) {
      treeData.value = response.data.menuTree;
    } else {
      ElMessage.error(response.message || "获取菜单树失败");
    }
  } catch (error) {
    console.error("获取菜单树失败:", error);
    ElMessage.error("获取菜单树失败");
  } finally {
    loading.value = false;
  }
};

// 刷新树
const refreshTree = () => {
  loadMenuTree();
};

// 显示详情
const showDetail = async (id: number) => {
  detailVisible.value = true;
  detailLoading.value = true;

  try {
    const response = await getMenuOne({ id });
    if (response.success) {
      currentMenu.value = response.data;
    } else {
      ElMessage.error(response.message || "获取菜单详情失败");
    }
  } catch (error) {
    console.error("获取菜单详情失败:", error);
    ElMessage.error("获取菜单详情失败");
  } finally {
    detailLoading.value = false;
  }
};

// 关闭详情弹窗
const handleClose = () => {
  detailVisible.value = false;
  currentMenu.value = null;
};

// 获取类型文本
const getTypeText = (type: number) => {
  const typeMap = {
    0: "目录",
    1: "菜单",
    2: "外链"
  };
  return typeMap[type] || "未知";
};

// 获取类型标签类型
const getTypeTagType = (
  type: number
): "success" | "info" | "warning" | "danger" => {
  const typeMap: Record<number, "success" | "info" | "warning" | "danger"> = {
    0: "info",
    1: "success",
    2: "warning"
  };
  return typeMap[type] || "info";
};

// 格式化日期
const formatDate = (date: Date | string) => {
  if (!date) return "无";
  const d = new Date(date);
  return d.toLocaleString("zh-CN");
};

// 组件挂载时加载数据
onMounted(() => {
  loadMenuTree();
});
</script>

<style lang="scss" scoped>
.main {
  padding: 24px;

  .menu-tree {
    .tree-node {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-right: 20px;

      .node-info {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;

        .node-id {
          font-size: 12px;
          color: #909399;
          background: #f5f7fa;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .node-title {
          font-weight: 500;
          color: #303133;
        }
      }
    }
  }

  .menu-detail {
    :deep(.el-descriptions__body) {
      .el-descriptions__table {
        .el-descriptions__cell {
          vertical-align: top;
        }
      }
    }
  }
}

:deep(.el-tree-node__content) {
  height: auto !important;
  padding: 8px 0 !important;
}

:deep(.el-tree-node__expand-icon) {
  color: #409eff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
