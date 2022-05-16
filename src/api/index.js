import axios from 'axios'

let key = 'd1f683551604b8eacec630924cba75f4'

export default {
    getRoute: (data) => axios({
        method: 'get', url: "https://restapi.amap.com/v3/direction/driving", params: {
            ...data,
            key: key
        }
    }),
    getInputTips: (data) => axios({
        method: 'get', url: "https://restapi.amap.com/v3/assistant/inputtips", params: {
            ...data,
            key: key
        }
    }),
    getAround: (data) => axios({
        method: 'get', url: "https://restapi.amap.com/v3/place/around", params: {
            ...data,
            key: key
        }
    }),
    getPlace: (data) => axios({
        method: 'get', url: "https://restapi.amap.com/v3/place/text", params: {
            ...data,
            key: key
        }
    }),
    getRegeo: (data) => axios({
        method: 'get', url: "https://restapi.amap.com/v3/geocode/regeo", params: {
            ...data,
            key: key
        }
    })

}