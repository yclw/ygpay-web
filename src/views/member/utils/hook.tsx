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
  getMemberList,
  getMemberOne,
  createMember,
  updateMember,
  deleteMember
} from "@/api/member";
import { AesECBEncrypt, getDefaultEncryptKey } from "@/utils/crypto";
import { reactive, ref, onMounted, h, toRaw } from "vue";

export function useMember() {
  const form = reactive({
    username: "",
    nickname: "",
    email: "",
    mobile: "",
    roleId: undefined,
    sex: undefined,
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
      label: "UID",
      prop: "uid",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 120
    },
    {
      label: "昵称",
      prop: "nickname",
      minWidth: 120
    },
    {
      label: "角色",
      prop: "roleName",
      minWidth: 100
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 160,
      showOverflowTooltip: true
    },
    {
      label: "手机号",
      prop: "mobile",
      width: 120
    },
    {
      label: "性别",
      prop: "sex",
      width: 80,
      cellRenderer: scope => (
        <span>
          {scope.row.sex === 1 ? "男" : scope.row.sex === 2 ? "女" : "保密"}
        </span>
      )
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
      label: "最后活跃",
      prop: "lastActiveAt",
      minWidth: 160,
      formatter: ({ lastActiveAt }) =>
        lastActiveAt ? dayjs(lastActiveAt).format("YYYY-MM-DD HH:mm:ss") : "-"
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
      `确认要删除用户名为<strong style='color:var(--el-color-primary)'>${row.username}</strong>的这条数据吗？`,
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
          await deleteMember({ uid: row.uid });
          message(`已删除用户名为${row.username}的这条数据`, {
            type: "success"
          });
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
      const { data } = await getMemberList(params);
      dataList.value = data.list;
      pagination.total = data.total;
    } catch {
      message("获取用户列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    // 手动重置表单数据到初始状态
    form.username = "";
    form.nickname = "";
    form.email = "";
    form.mobile = "";
    form.roleId = undefined;
    form.sex = undefined;
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
      uid: "",
      username: "",
      nickname: "",
      password: "", // 新增时为空，修改时也为空表示不更改
      roleId: undefined,
      avatar: "",
      sex: undefined,
      email: "",
      mobile: "",
      address: "",
      remark: "",
      sort: 0,
      status: 1
    };

    // 如果是编辑模式，通过getOne接口获取完整数据
    if (title !== "新增" && row?.uid) {
      try {
        const { data } = await getMemberOne({ uid: row.uid });
        formData = {
          uid: data.uid,
          username: data.username,
          nickname: data.nickname,
          password: "", // 修改时密码为空表示不更改
          roleId: data.roleId,
          avatar: data.avatar,
          sex: data.sex,
          email: data.email,
          mobile: data.mobile,
          address: data.address,
          remark: data.remark,
          sort: data.sort,
          status: data.status
        };
      } catch {
        message("获取用户详情失败", { type: "error" });
        return;
      }
    }

    addDialog({
      title: `${title}用户`,
      props: {
        formInline: formData
      },
      width: "60%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: async (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(`您${title}了用户名为${curData.username}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (title === "新增") {
                // 新增用户时密码必须加密
                if (!curData.password) {
                  message("新增用户时密码不能为空", { type: "error" });
                  return;
                }
                const encryptedPassword = AesECBEncrypt(
                  curData.password,
                  getDefaultEncryptKey()
                );
                await createMember({
                  ...curData,
                  password: encryptedPassword
                });
              } else {
                // 修改用户
                const updateData: any = {
                  uid: row?.uid,
                  username: curData.username,
                  nickname: curData.nickname,
                  roleId: curData.roleId,
                  avatar: curData.avatar,
                  sex: curData.sex,
                  email: curData.email,
                  mobile: curData.mobile,
                  address: curData.address,
                  remark: curData.remark,
                  sort: curData.sort,
                  status: curData.status
                };

                // 只有当用户输入了新密码时才加密并发送
                if (curData.password && curData.password.trim() !== "") {
                  updateData.password = AesECBEncrypt(
                    curData.password,
                    getDefaultEncryptKey()
                  );
                }

                await updateMember(updateData);
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
