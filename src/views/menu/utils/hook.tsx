import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "./hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { getMenuList, createMenu, updateMenu, deleteMenu } from "@/api/menu";
import { reactive, ref, onMounted, h, toRaw } from "vue";

export function useMenu() {
  const form = reactive({
    name: "",
    title: "",
    path: "",
    type: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined
  });

  // 排序状态独立管理
  const sortField = ref("sort");
  const sortDesc = ref(false);
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      width: 80
    },
    {
      label: "菜单名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "菜单标题",
      prop: "title",
      minWidth: 120
    },
    {
      label: "菜单路径",
      prop: "path",
      minWidth: 200
    },
    {
      label: "图标",
      prop: "icon",
      width: 100,
      cellRenderer: scope => (
        <div class="flex items-center justify-center">
          {scope.row.icon && <i class={scope.row.icon} />}
        </div>
      )
    },
    {
      label: "菜单类型",
      prop: "type",
      width: 100,
      cellRenderer: scope => (
        <el-tag size="small">
          {scope.row.type === 0
            ? "目录"
            : scope.row.type === 1
              ? "菜单"
              : "外链"}
        </el-tag>
      )
    },
    {
      label: "组件路径",
      prop: "component",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "父级ID",
      prop: "parentId",
      width: 80
    },
    {
      label: "父级菜单标题",
      prop: "parentTitle",
      minWidth: 120
    },
    {
      label: "显示菜单",
      prop: "showLink",
      width: 100,
      cellRenderer: scope => (
        <el-tag style={tagStyle.value(scope.row.showLink ? 1 : 0)} size="small">
          {scope.row.showLink ? "显示" : "隐藏"}
        </el-tag>
      )
    },
    {
      label: "缓存",
      prop: "keepAlive",
      width: 80,
      cellRenderer: scope => (
        <el-tag
          style={tagStyle.value(scope.row.keepAlive ? 1 : 0)}
          size="small"
        >
          {scope.row.keepAlive ? "是" : "否"}
        </el-tag>
      )
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
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    ElMessageBox.confirm(
      `确认要删除菜单名称为<strong style='color:var(--el-color-primary)'>${row.name}</strong>的这条数据吗？`,
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
          await deleteMenu({ id: row.id });
          message(`已删除菜单名称为${row.name}的这条数据`, { type: "success" });
          onSearch();
        } catch {
          message("删除失败", { type: "error" });
        }
      })
      .catch(() => {
        // 用户取消删除
      });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    try {
      // 过滤掉空值的表单数据
      const formData = toRaw(form);
      const filteredFormData = {};
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== undefined && value !== null && value !== "") {
          filteredFormData[key] = value;
        }
      });

      const params = {
        page: pagination.currentPage,
        size: pagination.pageSize,
        sortField: sortField.value,
        sortDesc: sortDesc.value,
        ...filteredFormData
      };
      const { data } = await getMenuList(params);
      dataList.value = data.list;
      pagination.total = data.total;
    } catch {
      message("获取菜单列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    // 手动重置表单数据到初始状态
    form.name = "";
    form.title = "";
    form.path = "";
    form.type = undefined;
    form.status = undefined;
    form.startDate = undefined;
    form.endDate = undefined;

    // 重置Element Plus表单验证状态
    formEl.resetFields();
    onSearch();
  };

  function toggleSortOrder() {
    sortDesc.value = !sortDesc.value;
    onSearch();
  }

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          type: row?.type ?? 1,
          name: row?.name ?? "",
          path: row?.path ?? "",
          title: row?.title ?? "",
          icon: row?.icon ?? "",
          sort: row?.sort ?? 10,
          showParent: row?.showParent ?? false,
          showLink: row?.showLink ?? true,
          keepAlive: row?.keepAlive ?? false,
          parentId: row?.parentId ?? 0,
          parentTitle: row?.parentTitle ?? "",
          redirect: row?.redirect ?? "",
          component: row?.component ?? "",
          frameSrc: row?.frameSrc ?? "",
          url: row?.url ?? "",
          status: row?.status ?? 1
        }
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
          message(`您${title}了菜单名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (title === "新增") {
                await createMenu(curData);
              } else {
                await updateMenu({
                  id: row?.id,
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

  onMounted(() => {
    onSearch();
  });

  return {
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
  };
}
