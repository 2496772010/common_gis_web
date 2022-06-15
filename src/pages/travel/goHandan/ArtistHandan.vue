<template>
    <div>
        <base-map @mapCreated="onMapCreated"></base-map>
        <el-button type="primary" style="position:absolute;z-index: 99;left: 50%;transform: translateX(-50%)"
                   @click="playRoute(source)">重播
        </el-button>
        <describe-pane :name="name" ref="describePane" id="describePane" :contentList="describe"></describe-pane>
    </div>
</template>

<script>
    import BaseMap from "../../../components/BaseMap";
    import {Vector as VectorLayer} from 'ol/layer'
    import {Vector as VectorSource} from 'ol/source'
    import {Point, LineString} from 'ol/geom'
    import Feature from 'ol/Feature'
    import DescribePane from "../components/DescribePane";
    import Popup from 'ol-ext/overlay/FixedPopup'
    import 'ol-ext/overlay/Popup.css'
    import 'ol-ext/overlay/Popup.anim.css'
    import {ref} from 'vue'
    import {Style, Text as TextStyle, Icon as IconStyle, Fill as FillStyle} from 'ol/style'
    import {Select} from 'ol/interaction'

    export default {
        name: "ArtistHandan",
        components: {BaseMap, DescribePane},
        data() {
            return {
                routeCoords: [
                    {
                        name: '丛台置酒',
                        center: [114.491085, 36.613869],
                        desc: [
                            {
                                content: '丛台置酒\n' +
                                    '\n' +
                                    '置酒在高台，由来糠慨悲歌地。\n' +
                                    '\n' +
                                    '平胡传袨胡，莫负风云际会身。',
                                img: 'https://inews.gtimg.com/newsapp_bt/0/13068890139/1000'
                            }, {
                                content: "这幅对联是著名书法家于右任老先生于1931年游丛台时即兴手书。汉武帝刘秀在丛台之上摆酒设宴结交了马武将军，奠定了东汉王朝的基业。\n" +
                                    "\n" +
                                    "公元23年，刘玄称帝，年号更始，刘秀被封为太常偏将军。公元23年9月，更始帝刘玄率军攻入长安，宣告新莽王朝覆灭。\n" +
                                    "\n" +
                                    "刘玄帝为尽快收复河北各州郡，派刘秀以破虏将军行大司马的名义，北渡黄河招抚河北各方势力。",
                                img: 'https://p0.itc.cn/images01/20210121/368c7e4bb29c472e83ef47ba4a9f326c.jpeg'
                            },
                            {
                                content: "公元24年，刘秀在谢尚书的协助下，率军攻破邯郸，打败了在邯郸称帝的王郎，当地豪强地主纷纷归附，刘秀乘势占据了黄河以北广大地区，声威显赫。",
                                img: "https://p4.itc.cn/images01/20210121/fd2477ee77b44ca3aba4dcf3ed770508.png"
                            }, {
                                content: "更始帝刘玄见刘秀羽翼丰满，为防备刘秀称帝，便封刘秀为萧王，令其回长安受封领赏，刘秀以河北未定为由，婉言拒绝了刘玄的命令。",
                                img: "https://p3.itc.cn/images01/20210121/3ee73cc9c756420294659e56ff0dd763.jpeg"
                            }, {
                                content: "刘玄令自己的心腹谢尚书率军屯驻邯郸，以便控制和监视刘秀，二人同城而居，各自为政，使刘秀如鲠在喉。\n" +
                                    "\n" +
                                    "马武为东汉著名将领。少年时为避仇家，客居江夏，投奔了绿林军，随谢尚书助刘秀攻打邯郸城，与刘秀曾有共赴沙场的生死之交。",
                                img: "https://p5.itc.cn/images01/20210121/e36def40eaa544868383356dda4592e1.jpeg"
                            }
                        ],
                        style: new Style({
                            text: new TextStyle({
                                text: '丛台置酒',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/ctzj.jpg',
                                scale: 0.1
                            })
                        })

                    },
                    {
                        name: '负荆请罪',
                        center: [114.486781, 36.618458],
                        desc: [
                            {
                                img: './handan/fjqzjpg.jpg',
                                content: '蔺相如因为“完璧归赵”有功而被封为上卿，位在廉颇之上。廉颇很不服气，扬言要当面羞辱蔺相如。蔺相如得知后，尽量回避、容让，不与廉颇发生冲突。\n' +
                                    '\n' +
                                    '蔺相如的门客以为他畏惧廉颇，然而蔺相如说：“秦国不敢侵略我们赵国，是因为有我和廉将军。我对廉将军容忍、退让，是把国家的危难放在前面，把个人的私仇放在后面啊！”\n' +
                                    '\n' +
                                    '这话传到了廉颇耳朵里，廉颇十分感动，便光着上身，背负荆杖，来到蔺相如家请罪。他羞愧地对商相如说：“我真是一个糊涂人，想不到你能这样地宽宏大量！”两个人终于结成誓同生死的朋友。'
                            }
                        ],
                        style: new Style({
                            text: new TextStyle({
                                text: '负荆请罪',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/fjqzjpg.jpg',
                                scale: 0.1
                            })
                        })
                    },
                    {
                        name: '邯郸学步',
                        center: [114.487278, 36.620348],
                        desc: [
                            {
                                img: './handan/hdxb.jpg',
                                content: '邯郸学步，也作“学步邯郸”。比喻一昧地模仿别人，不仅学不到本事，反而把原来的本事也丢了。故事讲的是，战国时期，一个燕国人听说赵国邯郸人走姿很漂亮，便来到邯郸学习邯郸人走路。未得其能，又忘记自己的走姿，最后爬着回到了燕国。李白诗曰： 寿陵失本步，笑煞邯郸人。但有学者研究认为，邯郸学步其实学的不是普通走路的步法，而是学的邯郸舞步。当时在赵国邯郸流行一种舞步叫踮屣，是一种类似于现代西方芭蕾舞的点着脚尖跳舞的舞步，非常优美。'

                            }
                        ],
                        style: new Style({
                            text: new TextStyle({
                                text: '邯郸学步',
                                offsetY: 30,
                            }),
                            image: new IconStyle({
                                src: './handan/hdxb.jpg',
                                scale: 0.1
                            })
                        })
                    },
                    {
                        name: '毛遂自荐',
                        center: [114.730269, 36.700889],
                        desc: [
                            {
                                img: './handan/mszj.jpg',
                                content: '据《史记．卷七六．平原君虞卿列传．平原君》记载，战国时，秦国出兵攻打赵国，包围了赵都邯郸，情况十分危急，于是赵王派平原君前往楚国，请求援救。平原君打算在其门下食客挑选出二十个文武人才一同前往，但只挑选出十九个，剩下的都不符合条件。\n' +
                                    '\n' +
                                    '这时，有一个名叫毛遂的人，主动向平原君自我推荐，请求加入前往楚国的行列。平原君问："你在我门下多久了？"毛遂回答：“三年了。”平原君说：“一个真正有才能的人，就好像一把放在袋子里的锥子一样，立刻就会显露出锋利的锥尖。\n' +
                                    '\n' +
                                    '而你在我门下三年了，我却没听说过你有什么表现，你还是留下吧！”毛遂说：“我现在自我推荐，就是请求你把我放进袋子里，如果早点有这样的机会，那我就不只是露出锥尖而已，而是早就显露出才能，锋芒毕露了！”平原君觉得毛遂说得有道理，就答应让他一同前往。\n' +
                                    '\n' +
                                    '到了楚国，平原君和楚王会谈，从早上到中午，都还没有结果。毛遂于是持剑走到楚王面前，极力说明赵、楚联合抗秦的利害关系。楚王终于被说服，答应赵国愿意出兵援救。于是两国当场歃血为盟，誓守联合抗秦的盟约。' + '毛遂这次不仅帮平原君完成任务，也为国家立下了功劳，让大家对他刮目相看，平原君因此待他为上宾。后来这个故事被浓缩成「毛遂自荐」这个成语，比喻自告奋勇，自我推荐。'
                            }
                        ],
                        style: new Style({
                            text: new TextStyle({
                                text: '毛遂自荐',
                                offsetY: 30,
                            }),
                            image: new IconStyle({
                                src: './handan/mszj.jpg',
                                scale: 0.1
                            })
                        })
                    },
                ],
                timeInterval: null,
                civilLayer: new VectorLayer({}),
                overLay: null,
                describe: [],
                source: null,
                name: '',
                select: null
            }
        },
        setup() {
            return {
                map: ref(null)
            }
        },
        methods: {
            onMapCreated(map) {
                this.map = map
                this.init(map)
                this.select = new Select({})
                this.map.addInteraction(this.select)
                this.initSelect()
            },
            init(map) {
                map.addLayer(this.civilLayer)
                this.source = new VectorSource()
                this.civilLayer.setSource(this.source)
                this.overLay = new Popup({
                    popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
                    closeBox: true,
                    onshow: function () {
                        console.log("You opened the box");
                    },
                    onclose: function () {
                        console.log("You close the box");
                    },
                    positioning: 'top-right',
                    autoPan: true,
                    autoPanAnimation: {duration: 250}
                })
                map.addOverlay(this.overLay)
                // this.playRoute(this.source)
            },
            change(desc, name) {
                return new Promise(resolve => {
                    this.describe = desc
                    this.name = name
                    resolve('ok')

                })
            },
            playRoute(source) {
                if (source) {
                    clearInterval(this.timeInterval)
                    this.timeInterval = null
                    let a = 0
                    this.timeInterval = setInterval(() => {
                        if (a >=this.routeCoords.length) {
                            clearInterval(this.timeInterval)
                            return
                        }
                        let center = this.routeCoords[a].center
                        let desc = this.routeCoords[a].desc
                        let name = this.routeCoords[a].name
                        let style = this.routeCoords[a].style
                        let point = new Feature({
                            geometry: new Point(center),
                            properties: {
                                desc: desc
                            }
                        })
                        point.setStyle(style)
                        point.setProperties({
                            titleName: name,
                            desc: desc
                        })
                        source.addFeature(point)
                        if (a < this.routeCoords.length - 1) {
                            let center1 = this.routeCoords[a + 1].center
                            let line = new Feature({
                                geometry: new LineString([center, center1])
                            })
                            source.addFeature(line)
                        }
                        this.change(desc, name).then(() => {
                            this.overLay.show(center, this.$refs.describePane.$el.outerHTML)
                            this.overLay.setPixelPosition([10, 10], 'top-right')
                            this.map.getView().setCenter(center)
                        })

                        a += 1
                    }, 4000)
                }
            },
            initSelect() {
                this.select.getFeatures().on(['add'], (e) => {
                    const feature = e.element;
                    if (feature.getGeometry() instanceof Point) {
                        let properties = feature.getProperties()
                        console.log(properties)
                        this.change(properties.desc, properties.titleName).then(() => {
                            let domContent = this.$refs.describePane.$el.outerHTML
                            this.overLay.show(feature.getGeometry().getFirstCoordinate(), domContent);
                        })

                    }

                });
                this.select.getFeatures().on(['remove'], function () {
                    this.overLay.hide();
                })
            }
        }
    }
</script>

<style scoped>

</style>