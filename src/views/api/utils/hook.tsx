import dayjs from "dayjs";
import editForm from "../components/form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "./hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";
import {
  getApiList,
  getApiOne,
  createApi,
  updateApi,
  deleteApi
} from "@/api/api";
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
      label: "API UID",
      prop: "apiUid",
      width: 120
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
          await deleteApi({ apiUid: row.apiUid });
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
    // 手动重置表单数据到初始状态
    form.name = "";
    form.path = "";
    form.method = "";
    form.groupName = "";
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

  async function openDialog(title = "新增", row?: any) {
    let formData = {
      name: "",
      path: "",
      method: "",
      groupName: "",
      description: "",
      needAuth: 1,
      rateLimit: 1000,
      sort: 0,
      status: 1
    };

    // 如果是编辑模式，通过getOne接口获取完整数据
    if (title !== "新增" && row?.apiUid) {
      try {
        const { data } = await getApiOne({ apiUid: row.apiUid });
        formData = {
          name: data.name,
          path: data.path,
          method: data.method,
          groupName: data.groupName,
          description: data.description,
          needAuth: data.needAuth,
          rateLimit: data.rateLimit,
          sort: data.sort,
          status: data.status
        };
      } catch {
        message("获取API详情失败", { type: "error" });
        return;
      }
    }

    addDialog({
      title: `${title}API`,
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
                  apiUid: row?.apiUid,
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
