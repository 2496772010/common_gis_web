import {createRouter, createWebHashHistory} from "vue-router";

const travel = () => import("../TravelApp.vue")
const home = () => import('../HomePage')


const routes = [
  {path: "/", name: 'index', component: home},
  {
    path: "/travel",
    name: "travel",
    component: travel,
    children: [
      //景点导航
      {
        path: '/jdNav',
        name: 'jdNav',
        component: () => import('../navigation/jdNav')
      },
      //酒店导航
      {
        path: 'jiuDNav',
        name: 'jiuDNav',
        component: () => import('../navigation/JiuDNav')
      },
      //车站导航
      {
        path: 'staNav',
        name: 'staNav',
        component: () => import('../navigation/StationNav')
      },
      //景点热力图
      {
        path: 'jdHeat',
        name: 'jdHeat',
        component: () => import('../analysis/JdHeatmap')
      },
      //自驾可视化
      {
        name: 'zjVision',
        path: 'zjVision',
        component: () => import('../analysis/ZjVisualization')
      },
      //艺术邯郸
      {
        name: 'artHandan',
        path: 'artHandan',
        component: () => import('../goHandan/ArtistHandan')
      },
      //文博邯郸
      {
        name: 'civilHandan',
        path: 'civilHandan',
        component: () => import('../goHandan/CivilizationHandan')
      },
      //山水邯郸
      {
        name: 'waterHandan',
        path: 'waterHandan',
        component: () => import('../goHandan/WaterHandan')
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    children: [
      {
        path: '/jdNav',
        name: 'jdNav',
        component: () => import('../navigation/jdNav')
      }
    ]

  },
  {
    path: '/jdNav',
    name: 'jdNav',
    component: () => import('../navigation/jdNav')
  },

]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
