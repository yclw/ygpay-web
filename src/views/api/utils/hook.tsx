import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "./hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import { getApiList, createApi, updateApi, deleteApi } from "@/api/api";
import { reactive, ref, onMounted, h, toRaw } from "vue";

export function useApi() {
  const form = reactive({
    name: "",
    path: "",
    method: "",
    groupName: "",
    status: undefined,
    startDate: undefined,
    endDate: undefined
  });

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
      label: "API名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "API路径",
      prop: "path",
      minWidth: 200
    },
    {
      label: "请求方法",
      prop: "method",
      width: 100,
      cellRenderer: scope => (
        <el-tag
          type={
            scope.row.method === "GET"
              ? "success"
              : scope.row.method === "POST"
                ? "primary"
                : scope.row.method === "PUT"
                  ? "warning"
                  : scope.row.method === "DELETE"
                    ? "danger"
                    : "info"
          }
          size="small"
        >
          {scope.row.method}
        </el-tag>
      )
    },
    {
      label: "分组名称",
      prop: "groupName",
      minWidth: 120
    },
    {
      label: "描述",
      prop: "description",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "认证",
      prop: "needAuth",
      width: 80,
      cellRenderer: scope => (
        <el-tag
          type={scope.row.needAuth === 1 ? "success" : "info"}
          size="small"
        >
          {scope.row.needAuth === 1 ? "需要" : "无需"}
        </el-tag>
      )
    },
    {
      label: "限流",
      prop: "rateLimit",
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
      `确认要删除API名称为<strong style='color:var(--el-color-primary)'>${row.Name}</strong>的这条数据吗？`,
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
          await deleteApi({ id: row.id });
          message(`已删除API名称为${row.name}的这条数据`, { type: "success" });
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
        ...toRaw(form),
        sortField: sortField.value,
        sortDesc: sortDesc.value
      };
      const { data } = await getApiList(params);
      dataList.value = data.list;
      pagination.total = data.total;
    } catch {
      message("获取API列表失败", { type: "error" });
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
      title: `${title}API`,
      props: {
        formInline: {
          name: row?.name ?? "",
          path: row?.path ?? "",
          method: row?.method ?? "",
          groupName: row?.groupName ?? "",
          description: row?.description ?? "",
          needAuth: row?.needAuth ?? 1,
          rateLimit: row?.rateLimit ?? 1000,
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
          message(`您${title}了API名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (title === "新增") {
                await createApi(curData);
              } else {
                await updateApi({
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
