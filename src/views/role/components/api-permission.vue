<script setup lang="ts">
import { ref, reactive, nextTick, watch, onMounted } from "vue";
import {
  getRoleApi,
  updateRoleApi,
  type ApiGroupModel,
  type RoleApiModel
} from "@/api/role";
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
const apiGroupList = ref<ApiGroupModel[]>([]);
const selectedApiUids = ref<string[]>([]);
const searchKeyword = ref("");

// 搜索过滤后的API组列表
const filteredApiGroups = ref<ApiGroupModel[]>([]);

// 加载角色API权限数据
const loadRoleApiData = async () => {
  try {
    loading.value = true;
    const { data } = await getRoleApi({ id: props.roleId });
    apiGroupList.value = data.apiList;

    // 获取已选中的API UID列表
    const selectedUids: string[] = [];
    data.apiList.forEach(group => {
      group.children.forEach(api => {
        if (api.use) {
          selectedUids.push(api.apiUid);
        }
      });
    });
    selectedApiUids.value = selectedUids;

    // 初始化过滤列表
    filteredApiGroups.value = [...apiGroupList.value];
  } catch (error) {
    message("获取API权限数据失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

// 搜索API
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    filteredApiGroups.value = [...apiGroupList.value];
    return;
  }

  const keyword = searchKeyword.value.toLowerCase();
  filteredApiGroups.value = apiGroupList.value
    .map(group => {
      const filteredChildren = group.children.filter(
        api =>
          api.path.toLowerCase().includes(keyword) ||
          api.method.toLowerCase().includes(keyword)
      );

      return {
        ...group,
        children: filteredChildren
      };
    })
    .filter(group => group.children.length > 0);
};

// 重置搜索
const resetSearch = () => {
  searchKeyword.value = "";
  filteredApiGroups.value = [...apiGroupList.value];
};

// 处理单个API的选择
const handleApiSelection = (apiUid: string, checked: boolean) => {
  if (checked) {
    if (!selectedApiUids.value.includes(apiUid)) {
      selectedApiUids.value.push(apiUid);
    }
  } else {
    const index = selectedApiUids.value.indexOf(apiUid);
    if (index > -1) {
      selectedApiUids.value.splice(index, 1);
    }
  }
};

// 处理组的全选/取消全选
const handleGroupSelection = (group: ApiGroupModel, checked: boolean) => {
  group.children.forEach(api => {
    handleApiSelection(api.apiUid, checked);
  });
};

// 检查API是否被选中
const isApiSelected = (apiUid: string) => {
  return selectedApiUids.value.includes(apiUid);
};

// 检查组是否全选
const isGroupFullySelected = (group: ApiGroupModel) => {
  return group.children.every(api =>
    selectedApiUids.value.includes(api.apiUid)
  );
};

// 检查组是否部分选中
const isGroupPartiallySelected = (group: ApiGroupModel) => {
  const selectedCount = group.children.filter(api =>
    selectedApiUids.value.includes(api.apiUid)
  ).length;
  return selectedCount > 0 && selectedCount < group.children.length;
};

// 全选/取消全选所有API
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    const allApiUids: string[] = [];
    filteredApiGroups.value.forEach(group => {
      group.children.forEach(api => {
        allApiUids.push(api.apiUid);
      });
    });
    selectedApiUids.value = [
      ...new Set([...selectedApiUids.value, ...allApiUids])
    ];
  } else {
    // 取消当前过滤结果中的所有选择
    const filteredApiUids: string[] = [];
    filteredApiGroups.value.forEach(group => {
      group.children.forEach(api => {
        filteredApiUids.push(api.apiUid);
      });
    });
    selectedApiUids.value = selectedApiUids.value.filter(
      uid => !filteredApiUids.includes(uid)
    );
  }
};

// 检查是否全选
const isAllSelected = () => {
  if (filteredApiGroups.value.length === 0) return false;
  return filteredApiGroups.value.every(group =>
    group.children.every(api => selectedApiUids.value.includes(api.apiUid))
  );
};

// 检查是否部分选中
const isPartiallySelected = () => {
  if (filteredApiGroups.value.length === 0) return false;
  const totalApis = filteredApiGroups.value.reduce(
    (acc, group) => acc + group.children.length,
    0
  );
  const selectedCount = filteredApiGroups.value.reduce(
    (acc, group) =>
      acc +
      group.children.filter(api => selectedApiUids.value.includes(api.apiUid))
        .length,
    0
  );
  return selectedCount > 0 && selectedCount < totalApis;
};

// 确认保存
const handleConfirm = async () => {
  try {
    confirmLoading.value = true;
    await updateRoleApi({
      id: props.roleId,
      apiList: selectedApiUids.value
    });
    message("API权限更新成功", { type: "success" });
    emit("confirm");
    emit("close");
  } catch (error) {
    message("API权限更新失败", { type: "error" });
  } finally {
    confirmLoading.value = false;
  }
};

// 关闭对话框
const handleClose = () => {
  emit("close");
};

// 获取方法标签的颜色
const getMethodTagType = (
  method: string
): "success" | "primary" | "warning" | "danger" | "info" => {
  const methodMap: Record<
    string,
    "success" | "primary" | "warning" | "danger" | "info"
  > = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    DELETE: "danger",
    PATCH: "info"
  };
  return methodMap[method.toUpperCase()] || "info";
};

// 组件挂载时加载数据
onMounted(() => {
  if (props.roleId) {
    loadRoleApiData();
  }
});

// 暴露方法给父组件调用
defineExpose({
  handleConfirm
});
</script>

<template>
  <div>
    <!-- 搜索栏 -->
    <div class="mb-4 flex items-center gap-4">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索API路径或方法"
        class="w-[300px]"
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
      <el-checkbox
        :model-value="isAllSelected()"
        :indeterminate="isPartiallySelected()"
        @change="handleSelectAll"
      >
        全选
      </el-checkbox>
    </div>

    <!-- API权限列表 -->
    <div v-loading="loading" class="max-h-[500px] overflow-y-auto">
      <div
        v-if="filteredApiGroups.length === 0"
        class="text-center text-gray-500 py-8"
      >
        暂无数据
      </div>

      <div
        v-for="group in filteredApiGroups"
        :key="group.groupName"
        class="mb-6"
      >
        <!-- 组标题 -->
        <div class="flex items-center mb-3 p-3 bg-gray-50 rounded-lg">
          <el-checkbox
            :model-value="isGroupFullySelected(group)"
            :indeterminate="isGroupPartiallySelected(group)"
            @change="(checked: boolean) => handleGroupSelection(group, checked)"
          />
          <span class="ml-2 font-medium text-lg">{{ group.groupName }}</span>
          <span class="ml-2 text-sm text-gray-500">
            ({{
              group.children.filter(api => selectedApiUids.includes(api.apiUid))
                .length
            }}/{{ group.children.length }})
          </span>
        </div>

        <!-- API列表 -->
        <div class="grid grid-cols-1 gap-2 pl-6">
          <div
            v-for="api in group.children"
            :key="api.apiUid"
            class="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <el-checkbox
              :model-value="isApiSelected(api.apiUid)"
              @change="
                (checked: boolean) => handleApiSelection(api.apiUid, checked)
              "
            />
            <div class="ml-3 flex-1">
              <div class="flex items-center gap-2">
                <el-tag
                  :type="getMethodTagType(api.method)"
                  size="small"
                  class="w-[60px] text-center"
                >
                  {{ api.method }}
                </el-tag>
                <span class="font-mono text-sm">{{ api.path }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="mt-4 text-sm text-gray-500 text-center">
      已选择 {{ selectedApiUids.length }} 个API权限
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-checkbox__label) {
  font-weight: normal;
}

.grid {
  grid-template-columns: 1fr;
}
</style>
