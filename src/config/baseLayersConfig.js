import { XYZ } from 'ol/source'
import TileLayer from 'ol/layer/Tile'

export const TDT_KEY = 'b0811d4defb88fbf533bf90bb773c96e'
export const MAPBOX_KEY = 'pk.eyJ1IjoiZ2lzcmMiLCJhIjoiY2tldGttanBuMnA0aTJxbXNldW9kdDBmZyJ9.qFCuJIb5N4CiCec_4vuJzg'

export function tianditu() {
  // T=vec_c表示请求的是路网数据，x 表示切片的 x 轴坐标，y 表示切片的y轴坐标，z表示切片所在的缩放级别。
  // 使用 ol.source.XYZ 加载切片，并将获取的数据初始化一个切片图层 ol.layer.Tile：
  // 天地图底图
  const source = new XYZ({
    url: `http://t4.tianditu.com/DataServer?T=vec_w&tk=${TDT_KEY}&x={x}&y={y}&l={z}`
  })
  const tileLayer = new TileLayer({
    id: 'tileLayer',
    title: '天地图',
    layerName: 'baseMap',
    source: source
  })
  // 标注图层
  const sourceMark = new XYZ({
    url: `http://t3.tianditu.com/DataServer?T=cva_w&tk=${TDT_KEY}&x={x}&y={y}&l={z}`
  })
  const tileMark = new TileLayer({
    id: 'tileMark',
    title: '标注图层',
    layerName: 'baseMap',
    source: sourceMark

  })
  // 卫星图像
  const sourceSatellite = new XYZ({
    url: `http://t3.tianditu.com/DataServer?T=img_w&tk=${TDT_KEY}&x={x}&y={y}&l={z}`
  })
  const tileSatellite = new TileLayer({
    id: 'tileSatellite',
    title: '卫星图',
    layerName: 'baseMap',
    source: sourceSatellite

  })
  // 天地图地形地图
  const map_ter = new TileLayer({
    id: 'map_ter',
    title: '天地图地形',
    layerName: 'baseMap',
    source: new XYZ({
      url: `http://t4.tianditu.com/DataServer?T=ter_w&tk=${TDT_KEY}&x={x}&y={y}&l={z}`
    })
  })
  const map_cta = new TileLayer({
    id: 'map_cta',
    title: '天地图标注',
    layerName: 'baseMap',
    source: new XYZ({
      url: `http://t4.tianditu.com/DataServer?T=cva_w&tk=${TDT_KEY}&x={x}&y={y}&l={z}`
    })
  })

  return {
    'tileLayer': tileLayer,
    'tileMark': tileMark,
    'tileSatellite': tileSatellite,
    'map_ter': map_ter,
    'map_cta': map_cta
  }
}

export function mapboxLayers() {
  const streetsLayer = new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_KEY}`
    })
  })
  const satelliteLayer = new TileLayer({
    source: new XYZ({
      url: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=${MAPBOX_KEY}`
    })
  })

  return {
    streetsLayer,
    satelliteLayer

  }
}

export function gaodeLayers() {
  const gaodeVec = new TileLayer({
    source: new XYZ({
      url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
  })
  return {
    gaodeVec
  }
}
