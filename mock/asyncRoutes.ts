// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */
const permissionRouter = {
  path: "/permission",
  meta: {
    title: "权限管理",
    icon: "ep:lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "路由返回按钮权限",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "登录接口返回按钮权限"
          }
        }
      ]
    }
  ]
};

// api管理
const apiRouter = {
  path: "/api",
  meta: {
    title: "API管理",
    icon: "ep:lollipop",
    rank: 10
  },
  children: [
    {
      path: "/api/index",
      name: "ApiIndex",
      meta: {
        title: "API管理"
        // showParent: true
      }
    }
  ]
};

// 菜单管理
const menuRouter = {
  path: "/menu",
  meta: {
    title: "菜单管理",
    icon: "ep:lollipop",
    rank: 20
  },
  children: [
    {
      path: "/menu/index",
      name: "MenuIndex",
      meta: {
        title: "菜单管理"
      }
    }
  ]
};

export default defineFakeRoute([
  {
    url: "/user/menu",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [permissionRouter, menuRouter, apiRouter]
      };
    }
  }
]);
