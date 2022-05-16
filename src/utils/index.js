import '@supermap/iclient-ol/dist/iclient-openlayers.css'
import {Vector as VectorSource} from 'ol/source'
import {GeoJSON} from 'ol/format'
import Feature from 'ol/Feature';
import {Circle, Point} from 'ol/geom';
import {Icon as IconStyle, Style, Text as TextStyle} from 'ol/style'
import api from '@/api'
import {POINT_STYLE} from "../config";

//最短路径分析
export async function routeAnalysis(start, end) {
    if (start && end) {
        let startCoord = start.split(',').map(Number)
        let endCoord = end.split(',').map(Number)
        let res = await api.getRoute({origin: start, destination: end})
        let steps = res.data.route.paths[0].steps
        let stepInstructions = []
        let coords = []
        steps.forEach(value => {
            let polyline = value.polyline.split(';')
            polyline = polyline.map(function (value) {
                return value.split(',').map(Number)
            })
            stepInstructions.push({instruction: value['instruction'], location: polyline[0]})
            coords = coords.concat(polyline)
        })
        let geoJSON = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coords
                }
            }]
        }
        let startFeature = new Feature({
            geometry: new Point(startCoord),
            properties: {}
        })
        startFeature.setStyle(new Style({
            image: new IconStyle({
                src: './起点.png',
                scale: 0.2
            })
        }))
        let endFeature = new Feature({
            geometry: new Point(endCoord)
        })
        endFeature.setStyle(new Style({
            image: new IconStyle({
                src: './终点.png',
                scale: 0.2
            })
        }))
        let source = new VectorSource({
            features: new GeoJSON().readFeatures(geoJSON)
        })
        source.addFeature(startFeature)
        source.addFeature(endFeature)
        source.set('geojson', geoJSON)
        source.set('start', start)
        source.set('end', end)
        source.set('distance', res.data.route.paths[0].distance / 1000)
        return [source, stepInstructions, coords]
    }
}

//返回周围distance公里的兴趣点
/***
 * @param point
 * @param distance 单位(m)
 * @param codes
 * @returns {Promise<void>}
 */
export async function aroundAnalysis(point, distance, codes, icon) {
    let source = new VectorSource({})
    let pois = [];
    let coord = point.split(',').map(Number)
    for (let i = 1; i < 40; i++) {
        let res = await api.getAround({
            location: point,
            radius: distance,
            types: codes,
            page: i
        })
        if (!res.data['pois'].length) {
            break
        } else {
            pois = pois.concat(res.data.pois)
        }
    }

    for (let i = 0; i < pois.length; i++) {
        let name = pois[i].name
        let location = pois[i].location.split(',').map(Number)
        let feature = new Feature({
            geometry: new Point(location),
            properties: pois[i]
        })
        feature.setProperties(pois[i])
        feature.setStyle(new Style({
            image: new IconStyle({
                src: './' + icon + '.png',
                scale: 0.2
            }),
            text: new TextStyle({
                text: name
            })
        }))
        source.addFeature(feature)
    }
    let circle = new Feature({
        geometry: new Circle(coord, distance / 111000)
    })
    source.addFeature(circle)
    return source
}

//热力图分析
export async function createHeatMapSource(city, codes) {
    let source = new VectorSource()
    let pois = []
    let tempHeatPoints = []
    for (let i = 1; i < 40; i++) {
        let res = await api.getPlace({types: codes, city: city, citylimit: true, page: i})
        if (!res.data['pois'].length) {
            break
        } else {
            pois = pois.concat(res.data.pois)
        }
    }
    for (let i = 0; i < pois.length; i++) {
        let location = pois[i].location.split(',').map(Number)
        let feature = new Feature({
            geometry: new Point(location)
        })
        tempHeatPoints.push(feature)
    }
    source.addFeatures(tempHeatPoints)
    return source
}

//某个区间随机数
export function RandomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

//生成点source
export function getPointSource(geojson, icon, scale) {
    let features = new GeoJSON().readFeatures(geojson);
    if (icon) {
        for (let i = 0; i < features.length; i++) {
            features[i].setStyle(
                new Style({
                    image: new IconStyle({
                        src: icon,
                        scale: scale
                    })
                })
            )
        }
    }
    features.forEach(item => {
        item.setStyle(POINT_STYLE)
    })
    return new VectorSource({
        features: features
    })
}

export function getGeojsonSource(geoJSON) {
    let features = new GeoJSON().readFeatures(geoJSON);
    return new VectorSource({
        features: features
    })
}

//fit layer
export function fitLayer(map, source) {
    map.getView().fit(source.getExtent())

}

//清空cookie
export function clearCookie() {
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
            document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
            document.cookie = keys[i] + '=0;path=/;domain=http://localhost;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
        }
    }
    console.log('已清除');
}
