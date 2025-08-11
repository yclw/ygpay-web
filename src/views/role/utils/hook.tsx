import dayjs from "dayjs";
import editForm from "../components/form.vue";
import apiPermissionForm from "../components/api-permission.vue";
import menuPermissionForm from "../components/menu-permission.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "./hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";

import { deviceDetection } from "@pureadmin/utils";
import {
  getRoleList,
  getRoleOne,
  createRole,
  updateRole,
  deleteRole
} from "@/api/role";
import { syncRoleApi, refreshEnforcer } from "@/api/casbin";
import { reactive, ref, onMounted, h } from "vue";

export function useRole() {
  const form = reactive({
    name: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();

  // API权限对话框相关状态
  const apiPermissionDialogVisible = ref(false);
  const currentRoleForApiPermission = ref<{ roleUid: string; name: string }>({
    roleUid: "",
    name: ""
  });

  // 菜单权限对话框相关状态
  const menuPermissionDialogVisible = ref(false);
  const currentRoleForMenuPermission = ref<{ roleUid: string; name: string }>({
    roleUid: "",
    name: ""
  });

  const columns: TableColumnList = [
    {
      label: "角色UID",
      prop: "roleUid",
      width: 120
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 120
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
      label: "父级角色名称",
      prop: "parentName",
      minWidth: 120
    },
    {
      label: "排序",
      prop: "sort",
      width: 80
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: scope => (
        <el-tag style={tagStyle.value(scope.row.status)} size="small">
          {scope.row.status === 1 ? "启用" : "禁用"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      prop: "createdAt",
      minWidth: 160,
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "更新时间",
      prop: "updatedAt",
      minWidth: 160,
      formatter: ({ updatedAt }) =>
        dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    ElMessageBox.confirm(
      `确认要删除角色名称为<strong style='color:var(--el-color-primary)'>${row.name}</strong>的这条数据吗？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        try {
          await deleteRole({ roleUid: row.roleUid });
          message(`已删除角色名称为${row.name}的这条数据`, { type: "success" });
          onSearch();
        } catch {
          message("删除失败", { type: "error" });
        }
      })
      .catch(() => {
        // 用户取消删除
      });
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getRoleList();
      let filteredList = data.tree;

      // 按名称筛选
      if (form.name) {
        filteredList = filteredList.filter(item =>
          item.name.toLowerCase().includes(form.name.toLowerCase())
        );
      }

      dataList.value = filteredList;
    } catch {
      message("获取角色列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    // 手动重置表单数据到初始状态
    form.name = "";

    // 重置Element Plus表单验证状态
    formEl.resetFields();
    onSearch();
  };

  async function openDialog(title = "新增", row?: any) {
    let formData = {
      name: "",
      key: "",
      remark: "",
      parentUid: undefined,
      sort: 0,
      status: 1
    };

    // 如果是编辑模式，通过getOne接口获取完整数据
    if (title !== "新增" && row?.roleUid) {
      try {
        const { data } = await getRoleOne({ roleUid: row.roleUid });
        formData = {
          name: data.name,
          key: data.key,
          remark: data.remark,
          parentUid: data.parentUid,
          sort: data.sort,
          status: data.status
        };
      } catch {
        message("获取角色详情失败", { type: "error" });
        return;
      }
    }

    addDialog({
      title: `${title}角色`,
      props: {
        formInline: formData
      },
      width: "50%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(`您${title}了角色名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (title === "新增") {
                await createRole(curData);
              } else {
                await updateRole({
                  roleUid: row?.roleUid,
                  ...curData
                });
              }
              chores();
            } catch {
              message(`${title}失败`, { type: "error" });
            }
          }
        });
      }
    });
  }

  // 打开API权限对话框
  function openApiPermissionDialog(row: any) {
    let apiFormRef: any = null;

    addDialog({
      title: `设置 ${row.name} 的API权限`,
      props: {
        roleUid: row.roleUid,
        roleName: row.name
      },
      width: "70%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(apiPermissionForm, {
          roleUid: options.props.roleUid,
          roleName: options.props.roleName,
          ref: (el: any) => {
            apiFormRef = el;
          },
          onConfirm: () => {
            // API权限更新成功后的回调
          },
          onClose: () => {
            // 对话框关闭回调
          }
        }),
      beforeSure: async done => {
        // 调用API权限组件的确认方法
        if (apiFormRef && apiFormRef.handleConfirm) {
          await apiFormRef.handleConfirm();
        }
        done();
      }
    });
  }

  // 打开菜单权限对话框
  function openMenuPermissionDialog(row: any) {
    let menuFormRef: any = null;

    addDialog({
      title: `设置 ${row.name} 的菜单权限`,
      props: {
        roleUid: row.roleUid,
        roleName: row.name
      },
      width: "60%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(menuPermissionForm, {
          roleUid: options.props.roleUid,
          roleName: options.props.roleName,
          ref: (el: any) => {
            menuFormRef = el;
          },
          onConfirm: () => {
            // 菜单权限更新成功后的回调
          },
          onClose: () => {
            // 对话框关闭回调
          }
        }),
      beforeSure: async done => {
        // 调用菜单权限组件的确认方法
        if (menuFormRef && menuFormRef.handleConfirm) {
          await menuFormRef.handleConfirm();
        }
        done();
      }
    });
  }

  // 旧的函数保持兼容性（暂时保留）
  function closeApiPermissionDialog() {
    apiPermissionDialogVisible.value = false;
    currentRoleForApiPermission.value = { roleUid: "", name: "" };
  }

  function onApiPermissionUpdated() {
    closeApiPermissionDialog();
  }

  function closeMenuPermissionDialog() {
    menuPermissionDialogVisible.value = false;
    currentRoleForMenuPermission.value = { roleUid: "", name: "" };
  }

  function onMenuPermissionUpdated() {
    closeMenuPermissionDialog();
  }

  // 同步角色API到Casbin
  async function handleSyncCasbin() {
    try {
      loading.value = true;
      await syncRoleApi();
      message("同步Casbin成功", { type: "success" });
    } catch {
      message("同步Casbin失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  // 刷新Casbin Enforcer
  async function handleRefreshCasbin() {
    try {
      loading.value = true;
      await refreshEnforcer();
      message("刷新Casbin成功", { type: "success" });
    } catch {
      message("刷新Casbin失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSelectionChange,
    // API权限相关
    apiPermissionDialogVisible,
    currentRoleForApiPermission,
    openApiPermissionDialog,
    closeApiPermissionDialog,
    onApiPermissionUpdated,
    // 菜单权限相关
    menuPermissionDialogVisible,
    currentRoleForMenuPermission,
    openMenuPermissionDialog,
    closeMenuPermissionDialog,
    onMenuPermissionUpdated,
    // Casbin相关
    handleSyncCasbin,
    handleRefreshCasbin
  };
}
