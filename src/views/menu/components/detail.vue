<template>
  <div v-loading="loading">
    <el-descriptions v-if="menuData" :column="2" border class="menu-detail">
      <el-descriptions-item label="菜单UID">
        {{ menuData.menuUid }}
      </el-descriptions-item>
      <el-descriptions-item label="菜单名称">
        {{ menuData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="菜单标题">
        {{ menuData.title }}
      </el-descriptions-item>
      <el-descriptions-item label="菜单路径">
        {{ menuData.path }}
      </el-descriptions-item>
      <el-descriptions-item label="菜单图标">
        <div class="flex items-center gap-2">
          <component
            :is="useRenderIcon(menuData.icon)"
            v-if="menuData.icon"
            class="w-4 h-4"
          />
          <span>{{ menuData.icon || "无" }}</span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="菜单类型">
        <el-tag :type="getTypeTagType(menuData.type)">
          {{ getTypeText(menuData.type) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="父级UID">
        {{ menuData.parentUid || "无" }}
      </el-descriptions-item>
      <el-descriptions-item label="父级标题">
        {{ menuData.parentTitle || "无" }}
      </el-descriptions-item>
      <el-descriptions-item label="排序">
        {{ menuData.sort }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="menuData.status === 1 ? 'success' : 'danger'">
          {{ menuData.status === 1 ? "启用" : "禁用" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="显示父菜单">
        <el-tag :type="menuData.showParent ? 'success' : 'info'">
          {{ menuData.showParent ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="显示该菜单">
        <el-tag :type="menuData.showLink ? 'success' : 'info'">
          {{ menuData.showLink ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="是否缓存">
        <el-tag :type="menuData.keepAlive ? 'success' : 'info'">
          {{ menuData.keepAlive ? "是" : "否" }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="重定向" :span="2">
        {{ menuData.redirect || "无" }}
      </el-descriptions-item>
      <el-descriptions-item label="组件路径" :span="2">
        {{ menuData.component || "无" }}
      </el-descriptions-item>
      <el-descriptions-item label="内嵌地址" :span="2">
        {{ menuData.frameSrc || "无" }}
      </el-descriptions-item>
      <el-descriptions-item label="外部链接" :span="2">
        {{ menuData.url || "无" }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ formatDate(menuData.createdAt) }}
      </el-descriptions-item>
      <el-descriptions-item label="更新时间">
        {{ formatDate(menuData.updatedAt) }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getMenuOne, type MenuModel } from "@/api/menu";

interface Props {
  menuUid?: string;
}

const props = withDefaults(defineProps<Props>(), {
  menuUid: undefined
});

// 响应式数据
const loading = ref(false);
const menuData = ref<MenuModel | null>(null);

// 加载菜单详情
const loadMenuDetail = async () => {
  if (!props.menuUid) return;

  loading.value = true;
  try {
    const response = await getMenuOne({ menuUid: props.menuUid });
    if (response.success) {
      menuData.value = response.data;
    } else {
      ElMessage.error(response.message || "获取菜单详情失败");
    }
  } catch (error) {
    console.error("获取菜单详情失败:", error);
    ElMessage.error("获取菜单详情失败");
  } finally {
    loading.value = false;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadMenuDetail();
});

// 获取类型文本
const getTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
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
</script>

<style lang="scss" scoped>
.menu-detail {
  :deep(.el-descriptions__body) {
    .el-descriptions__table {
      .el-descriptions__cell {
        vertical-align: top;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
