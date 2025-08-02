// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

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
        title: "API管理",
        showParent: true
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
    },
    {
      path: "/menu/tree",
      name: "MenuTree",
      meta: {
        title: "菜单树"
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
        code: 0,
        message: "OK",
        level: "info",
        data: {
          menu: [menuRouter, apiRouter]
        }
      };
    }
  }
]);
