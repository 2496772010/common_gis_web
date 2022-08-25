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
    tileset.readyPromise.then(function (palaceTileset) {
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

    let aper = new Cesium.MaterialAppearance({
        material: new Cesium.Material({
            fabric: {
                uniforms: {
                    iTime: 0,
                },
                source: `
        const int NUM_STEPS = 8;
      const float PI     = 3.141592;
      const float EPSILON  = 1e-3;
      //#define EPSILON_NRM (0.1 / iResolution.x)
      #define EPSILON_NRM (0.1 / 200.0)
      // sea
      const int ITER_GEOMETRY = 3;
      const int ITER_FRAGMENT = 5;
      const float SEA_HEIGHT = 0.6;
      const float SEA_CHOPPY = 4.0;
      const float SEA_SPEED = 1.8;
      const float SEA_FREQ = 0.16;
      const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
      const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6);
      //#define SEA_TIME (1.0 + iTime * SEA_SPEED)
      const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);
      // math
      mat3 fromEuler(vec3 ang) {
        vec2 a1 = vec2(sin(ang.x),cos(ang.x));
        vec2 a2 = vec2(sin(ang.y),cos(ang.y));
        vec2 a3 = vec2(sin(ang.z),cos(ang.z));
        mat3 m;
        m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
        m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
        m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
        return m;
      }
      float hash( vec2 p ) {
        float h = dot(p,vec2(127.1,311.7));
        return fract(sin(h)*43758.5453123);
      }
      float noise( in vec2 p ) {
        vec2 i = floor( p );
        vec2 f = fract( p );
        vec2 u = f*f*(3.0-2.0*f);
        return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ),
                 hash( i + vec2(1.0,0.0) ), u.x),
              mix( hash( i + vec2(0.0,1.0) ),
                 hash( i + vec2(1.0,1.0) ), u.x), u.y);
      }
      // lighting
      float diffuse(vec3 n,vec3 l,float p) {
        return pow(dot(n,l) * 0.4 + 0.6,p);
      }
      float specular(vec3 n,vec3 l,vec3 e,float s) {
        float nrm = (s + 8.0) / (PI * 8.0);
        return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
      }
      // sky
      vec3 getSkyColor(vec3 e) {
        e.y = max(e.y,0.0);
        return vec3(pow(1.0-e.y,2.0), 1.0-e.y, 0.6+(1.0-e.y)*0.4);
      }
      // sea
      float sea_octave(vec2 uv, float choppy) {
        uv += noise(uv);
        vec2 wv = 1.0-abs(sin(uv));
        vec2 swv = abs(cos(uv));
        wv = mix(wv,swv,wv);
        return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
      }
      float map(vec3 p) {
        float freq = SEA_FREQ;
        float amp = SEA_HEIGHT;
        float choppy = SEA_CHOPPY;
        vec2 uv = p.xz; uv.x *= 0.75;
        float d, h = 0.0;
        float SEA_TIME = 1.0 + iTime * SEA_SPEED;
        for(int i = 0; i < ITER_GEOMETRY; i++) {
          d = sea_octave((uv+SEA_TIME)*freq,choppy);
          d += sea_octave((uv-SEA_TIME)*freq,choppy);
          h += d * amp;
          uv *= octave_m; freq *= 1.9; amp *= 0.22;
          choppy = mix(choppy,1.0,0.2);
        }
        return p.y - h;
      }
      float map_detailed(vec3 p) {
        float freq = SEA_FREQ;
        float amp = SEA_HEIGHT;
        float choppy = SEA_CHOPPY;
        vec2 uv = p.xz; uv.x *= 0.75;
        float SEA_TIME = 1.0 + iTime * SEA_SPEED;
        float d, h = 0.0;
        for(int i = 0; i < ITER_FRAGMENT; i++) {
          d = sea_octave((uv+SEA_TIME)*freq,choppy);
          d += sea_octave((uv-SEA_TIME)*freq,choppy);
          h += d * amp;
          uv *= octave_m; freq *= 1.9; amp *= 0.22;
          choppy = mix(choppy,1.0,0.2);
        }
        return p.y - h;
      }
      vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {
        float fresnel = clamp(1.0 - dot(n,-eye), 0.0, 1.0);
        fresnel = pow(fresnel,3.0) * 0.65;
        vec3 reflected = getSkyColor(reflect(eye,n));
        vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12;
        vec3 color = mix(refracted,reflected,fresnel);
        float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
        color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
        color += vec3(specular(n,l,eye,60.0));
        return color;
      }
      // tracing
      vec3 getNormal(vec3 p, float eps) {
        vec3 n;
        n.y = map_detailed(p);
        n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
        n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
        n.y = eps;
        return normalize(n);
      }
      float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
        float tm = 0.0;
        float tx = 1000.0;
        float hx = map(ori + dir * tx);
        if(hx > 0.0) return tx;
        float hm = map(ori + dir * tm);
        float tmid = 0.0;
        for(int i = 0; i < NUM_STEPS; i++) {
          tmid = mix(tm,tx, hm/(hm-hx));
          p = ori + dir * tmid;
          float hmid = map(p);
          if(hmid < 0.0) {
            tx = tmid;
            hx = hmid;
          } else {
            tm = tmid;
            hm = hmid;
          }
        }
        return tmid;
      }
           vec4 czm_getMaterial(vec2 vUv)
           {
            vec2 uv = vUv;
            uv = vUv * 2.0 - 1.0;
            float time = iTime * 0.3 + 0.0*0.01;
            // ray
            vec3 ang = vec3(0, 1.2, 0.0);
              vec3 ori = vec3(0.0,3.5,0);
            vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.15;
            dir = normalize(dir) * fromEuler(ang);
            // tracing
            vec3 p;
            heightMapTracing(ori,dir,p);
            vec3 dist = p - ori;
            vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
            vec3 light = normalize(vec3(0.0,1.0,0.8));
            // color
            vec3 color = mix(
              getSkyColor(dir),
              getSeaColor(p,n,light,dir,dist),
              pow(smoothstep(0.0,-0.05,dir.y),0.3));
               return vec4( pow(color,vec3(0.75)), 1.0 );
           }
        `,
            }
        }),
        translucent: true,
        vertexShaderSource: `
        attribute vec3 position3DHigh;
        attribute vec3 position3DLow;
        attribute float batchId;
        attribute vec2 st;
        attribute vec3 normal;
        varying vec2 v_st;
        varying vec3 v_positionEC;
        varying vec3 v_normalEC;
        void main() {
            v_st = st;
            vec4 p = czm_computePosition();
            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
            v_normalEC = czm_normal * normal;                         // normal in eye coordinates
            gl_Position = czm_modelViewProjectionRelativeToEye * p;
        }
                    `,
        fragmentShaderSource: `
      varying vec2 v_st;
      varying vec3 v_positionEC;
      varying vec3 v_normalEC;
      void main()  {
        vec3 positionToEyeEC = -v_positionEC;
        vec3 normalEC = normalize(v_normalEC);
        czm_materialInput materialInput;
        materialInput.normalEC = normalEC;
        materialInput.positionToEyeEC = positionToEyeEC;
        materialInput.st = v_st;
        vec4 color = czm_getMaterial(v_st);
        gl_FragColor = color;
      }
                `
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
        let appearance = new Cesium.MaterialAppearance({
            material: m_matrial_0,
        })
        const primitive = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: Cesium.PolygonGeometry.createGeometry(polygon)
            }),
            releaseGeometryInstances: false,
            compressVertices: false,
            appearance: aper
        })
        console.log(appearance.getFragmentShaderSource())
        viewer.scene.primitives.add(primitive)
    }
    function renderLoop(timestamp){
        aper.material.uniforms.iTime = timestamp/1000;
        requestAnimationFrame(renderLoop);
    }
    renderLoop()
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
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({alpha: 0.7}))
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
        val = {0.0: 'blue', 0.1: 'cyan', 0.37: 'lime', 0.54: 'yellow', 1: 'red'}
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
