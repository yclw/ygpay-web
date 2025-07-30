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
      label: "组件路径",
      prop: "component",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "父级ID",
      prop: "pid",
      width: 80
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
      const params = {
        page: pagination.currentPage,
        size: pagination.pageSize,
        ...toRaw(form)
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
          pid: row?.pid ?? 0,
          name: row?.name ?? "",
          path: row?.path ?? "",
          icon: row?.icon ?? "",
          title: row?.title ?? "",
          showParent: row?.showParent ?? true,
          component: row?.component ?? "",
          noShowingChildren: row?.noShowingChildren ?? false,
          value: row?.value ?? null,
          showTooltip: row?.showTooltip ?? false,
          parentId: row?.parentId ?? 0,
          redirect: row?.redirect ?? "",
          description: row?.description ?? "",
          sort: row?.sort ?? 0,
          status: row?.status ?? 1
        }
      },
      width: "50%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
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
