import {Icon as IconStyle, Style, Fill,Circle,Stroke} from 'ol/style'

export const ICON_STYLE = new Style({
    image: new IconStyle({
        src: './小车.png',
        scale: 0.2
    })
})
export const POINT_STYLE = new Style({
    image:new Circle({
        radius:5,
        fill:new Fill({
            color:'#ff0000',
        }),
        stroke:new Stroke({
            width:1,
            color:'#000000'
        })
    })

})
