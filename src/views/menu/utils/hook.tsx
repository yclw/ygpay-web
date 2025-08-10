import dayjs from "dayjs";
import editForm from "../components/form.vue";
import detailForm from "../components/detail.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "./hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "./types";
import IconifyIconOnline from "@/components/ReIcon/src/iconifyIconOnline";

import { deviceDetection } from "@pureadmin/utils";
// import { handleTree } from "@/utils/tree";
import {
  getMenuList,
  getMenuOne,
  createMenu,
  updateMenu,
  deleteMenu
} from "@/api/menu";
import { reactive, ref, onMounted, h } from "vue";

export function useMenu() {
  const form = reactive({
    title: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();

  const columns: TableColumnList = [
    {
      label: "菜单UID",
      prop: "menuUid",
      width: 120
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
          {scope.row.icon ? (
            <IconifyIconOnline
              icon={scope.row.icon}
              width="20px"
              height="20px"
            />
          ) : (
            <span class="text-gray-400">-</span>
          )}
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
      width: 200,
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
          await deleteMenu({ menuUid: row.menuUid });
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

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    try {
      const { data } = await getMenuList();
      let filteredList = data.tree;

      // 按标题筛选
      if (form.title) {
        filteredList = filteredList.filter(item =>
          item.title.toLowerCase().includes(form.title.toLowerCase())
        );
      }

      dataList.value = filteredList;
    } catch {
      message("获取菜单列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    // 手动重置表单数据到初始状态
    form.title = "";

    // 重置Element Plus表单验证状态
    formEl.resetFields();
    onSearch();
  };

  function openDetailDialog(row: any) {
    addDialog({
      title: "菜单详情",
      props: {
        menuUid: row.menuUid
      },
      width: "60%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => h(detailForm, { menuUid: row.menuUid })
    });
  }

  async function openDialog(title = "新增", row?: any) {
    let formData = {
      type: 1,
      name: "",
      path: "",
      title: "",
      icon: "",
      sort: 10,
      showParent: false,
      showLink: true,
      keepAlive: false,
      parentUid: undefined,
      parentTitle: "",
      redirect: "",
      component: "",
      frameSrc: "",
      url: "",
      status: 1
    };

    // 如果是编辑模式，通过getOne接口获取完整数据
    if (title !== "新增" && row?.menuUid) {
      try {
        const { data } = await getMenuOne({ menuUid: row.menuUid });
        formData = {
          type: data.type,
          name: data.name,
          path: data.path,
          title: data.title,
          icon: data.icon,
          sort: data.sort,
          showParent: data.showParent,
          showLink: data.showLink,
          keepAlive: data.keepAlive,
          parentUid: data.parentUid,
          parentTitle: data.parentTitle,
          redirect: data.redirect,
          component: data.component,
          frameSrc: data.frameSrc,
          url: data.url,
          status: data.status
        };
      } catch {
        message("获取菜单详情失败", { type: "error" });
        return;
      }
    }

    addDialog({
      title: `${title}菜单`,
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
                  menuUid: row?.menuUid,
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
    onSearch,
    resetForm,
    openDialog,
    openDetailDialog,
    handleDelete,
    handleSelectionChange
  };
}
