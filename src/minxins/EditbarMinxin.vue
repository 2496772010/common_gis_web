<script>
    import 'ol-ext/control/EditBar.css'
    import 'ol-ext/control/Notification.css'
    import 'ol-ext/control/Bar.css'
    import Notification from 'ol-ext/control/Notification'
    import EditBar from 'ol-ext/control/EditBar'
    import Select from 'ol/interaction/Select'
    import Tooltip from 'ol-ext/overlay/Tooltip'

    import {Vector as VectorLayer} from 'ol/layer'
    import {Vector as VectorSource} from 'ol/source'

    export default {
        name: "EditbarMinxin",
        data() {
            return {
                m_note: null,
                m_select: null,
                m_editBar: null,
                m_tooltip: null,
                m_vector: null
            }
        },
        methods: {
            initMyMap(map) {
                this.init(map)
            },
            init(map) {
                this.m_vector = new VectorLayer({
                    source: new VectorSource(),
                    zIndex: 99
                })
                map.addLayer(this.m_vector)
                this.m_note = new Notification()
                map.addControl(this.m_note)
                this.m_select = new Select({
                    title: '选择'
                })
                map.addInteraction(this.m_select)
                // this.m_tooltip = new Tooltip()
                // map.addOverlay(this.m_tooltip)
                let source = this.m_vector.getSource()
                let that = this
                this.m_editBar = new EditBar({
                    // Translate interaction title / label
                    interactions: {
                        // Use our own interaction > set the title inside
                        Select: that.m_select,
                        DrawPoint: '绘制点',
                        DrawLine: false,
                        DrawRegular: false,
                        DrawHole: false,
                        DrawPolygon: false,
                        Transform: false,
                        Split: false,
                        Offset: false,
                        Delete:'点击删除',
                        Info:'点击查看详细信息'
                    },
                    source: source
                })
                map.addControl(this.m_editBar)
                this.m_editBar.setMap(map)
                this.m_editBar.setActive(true)

            }
        }
    }
</script>

<style scoped>

</style>