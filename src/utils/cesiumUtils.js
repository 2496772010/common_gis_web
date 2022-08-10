import axios from 'axios'

/**
 * 添加人工构建的三维模型3dTiles
 * @param Cesium
 * @param lon
 * @param lat
 * @param height
 * @param url
 */
export function addManMade3DTiles(Cesium, lon, lat, height, url) {
  const tileset = window.cesiumViewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: url,
    baseScreenSpaceError: 1024,
    // 【重要】数值加大，能让最终成像变模糊
    skipScreenSpaceErrorFactor: 16,
    skipLevels: 1,
    immediatelyLoadDesiredLevelOfDetail: false,
    loadSiblings: false,
    cullWithChildrenBounds: true,
    skipLevelOfDetail: true, // 开启跳级加载
    // 这个参数默认是false，同等条件下，叶子节点会优先加载。但是Cesium的tile加载优先级有很多考虑条件，
    // 这个只是其中之一，如果skipLevelOfDetail=false，这个参数几乎无意义。所以要配合skipLevelOfDetail=true来使用，
    // 此时设置preferLeaves=true。这样我们就能最快的看见符合当前视觉精度的块，对于提升大数据以及网络环境不好的前提下有一点点改善意义。
    preferLeaves: true,
    // 【重要】内存建议显存大小的50%左右，内存分配变小有利于倾斜摄影数据回收，提升性能体验
    maximumMemoryUsage: 1024
    // maximumScreenSpaceError: 2,//最大的屏幕空间误差
    // maximumNumberOfLoadedTiles: 100000, //最大加载瓦片个数
  }))
  tileset.readyPromise.then(function(palaceTileset) {
    // 获取3Dtlies的bounds范围
    const boundingSphere = palaceTileset.boundingSphere
    // 获取3Dtlies的范围中心点的弧度
    const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center)
    // 定义3Dtlies改变之后中心点的弧度
    const offsetvalue = Cesium.Cartographic.fromDegrees(lon, lat, height)
    // 模型本身的位置
    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
    // 模型改变的位置
    const offset = Cesium.Cartesian3.fromRadians(offsetvalue.longitude, offsetvalue.latitude, height)
    // 定义模型的改变状态
    const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
    // 修改模型的位置
    palaceTileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
  })
  return tileset
}

/**
 * 加载面geojson并拉伸高度
 * @param {Cesium.Viewer} viewer ：Cesium的Viewer
 * @param {String} url ：geojson文件的地址
 * @param {String} exHeightFieldName ：拉伸高度字段名称
 */

export async function addExtrudedGeoJson(viewer, url, exHeightFieldName, muiltply) {
  const datasource = await Cesium.GeoJsonDataSource.load(url)
  viewer.dataSources.add(datasource) // 加载这个geojson资源
  const entities = datasource.entities.values
  const rgba = Cesium.Color.fromCssColorString('#146cd4')
  const material = new Cesium.ImageMaterialProperty({
    transparent: 0.3,
    image: getColorRamp({
      0.0: rgba.withAlpha(1.0).toCssColorString().replace(')', ',1.0)'),
      0.045: rgba.withAlpha(0.8).toCssColorString(),
      0.1: rgba.withAlpha(0.6).toCssColorString(),
      0.15: rgba.withAlpha(0.4).toCssColorString(),
      0.37: rgba.withAlpha(0.2).toCssColorString(),
      0.54: rgba.withAlpha(0.1).toCssColorString(),
      1.0: rgba.withAlpha(0).toCssColorString()
    })
  })
  for (let index = 0; index < entities.length; index++) {
    const entity = entities[index]
    entity.polygon.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND // 贴地
    entity.polygon.height = 0 // 距地高度0米
    entity.polygon.extrudedHeightReference = Cesium.HeightReference.RELATIVE_TO_GROUND // 拉伸
    entity.polygon.extrudedHeight = entity.properties[exHeightFieldName] * muiltply // 拉伸高度
    entity.polygon.outline = true
    entity.polygon.outlineColor = Cesium.Color.BLACK
    entity.polygon.material = material
  }
  return datasource
}

/**
 * 通过primitive的方式加载geojson面
 * @param viewer
 * @param url
 * @param exHeightFieldName
 * @param multiply
 * @returns {Promise<void>}
 */
export async function addExtrudedGeoJsonAsPrimitive(viewer, url, exHeightFieldName, multiply) {
  const m_matrial_0 = new Cesium.Material({
    fabric: {
      uniforms: {
        my_opacity: 0.5
      },
      source: `czm_material czm_getMaterial(czm_materialInput materialInput)
    {
        czm_material material = czm_getDefaultMaterial(materialInput);
        material.diffuse = vec3(materialInput.st, 0.0);
        material.alpha = my_opacity;
        return material;
    }`
    }
  })
  const geojson = await axios.get(url)
  const features = geojson.data.features
  for (let i = 0; i < features.length; i++) {
    const flatCoords = features[i].geometry.coordinates[0].flat(Infinity)
    const polygon = new Cesium.PolygonGeometry({
      extrudedHeight: features[i]['properties'][exHeightFieldName] * multiply,
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray(flatCoords.slice(0, flatCoords.length - 2))
      )
    })
    const primitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: Cesium.PolygonGeometry.createGeometry(polygon)
      }),
      releaseGeometryInstances: false,
      compressVertices: false,
      appearance: new Cesium.MaterialAppearance({
        material: m_matrial_0
      })
    })
    viewer.scene.primitives.add(primitive)
  }
}

export async function addDataToGlobe(viewer, url, exHeightFieldName, multiply) {
  const geojson = await axios.get(url)
  const features = geojson.data.features
  const instances = []
  for (let i = 0; i < features.length; i++) {
    for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
      const polygonArr = features[i].geometry.coordinates[j].toString().split(',')
      const polygon = new Cesium.PolygonGeometry({
        extrudedHeight: features[i]['properties'][exHeightFieldName] * multiply,
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(polygonArr)
        ),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      })
      const geometry = Cesium.PolygonGeometry.createGeometry(polygon)
      instances.push(new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 0.7 }))
        }
      }))
    }
  }

  const primitive = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PerInstanceColorAppearance({ // 为每个instance着色
      translucent: true,
      closed: false
    }),
    asynchronous: false // 确定基元是异步创建还是阻塞直到准备就绪
  })

  viewer.scene.primitives.add(primitive)
}
export function getColorRamp(val) {
  if (val == null) {
    val = { 0.0: 'blue', 0.1: 'cyan', 0.37: 'lime', 0.54: 'yellow', 1: 'red' }
  }
  const ramp = document.createElement('canvas')
  ramp.width = 1
  ramp.height = 100
  const ctx = ramp.getContext('2d')
  const grd = ctx.createLinearGradient(0, 0, 0, 100)
  for (const key in val) {
    grd.addColorStop(1 - Number(key), val[key])
  }
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 1, 50)
  return ramp
}
