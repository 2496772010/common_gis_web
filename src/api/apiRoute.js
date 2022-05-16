import axios from "axios";

let header = 'http://localhost:8288/'
export default {
    getLoginUser: () => axios({
        method: 'get',
        url: `/getLoginUser`
    }),
    getUserRoute: (data) => axios({
        method: 'get',
        url: `/getUserRouteByUserId`,
        params:{
            ...data
        }
    }),
    addUserRoute: (data) => axios({
        method: 'post',
        url: `/addUserRoute`,
        data: data,
        // params: data
    }),
    deleteUserRouteById:(data)=>axios({
        method:'get',
        url:'/deleteUserRouteById',
        params: {
            ...data
        }
    }),
    logout:()=>axios({
        method:'get',
        url:`/getLogout?log=-1`,
    })

}