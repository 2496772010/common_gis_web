<template>
    <div>
        <base-map @mapCreated="onMapCreated">
        </base-map>
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
        name: "CivilizationHandan",
        components: {BaseMap, DescribePane},
        data() {
            return {
                routeCoords: [
                    {
                        name: '娲皇宫',
                        center: [113.618874, 36.639939],
                        style: new Style({
                            text: new TextStyle({
                                text: '娲皇宫',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/whg.png',
                                scale: 0.5
                            })
                        }),
                        desc: [{
                            img: './handan/whg1.jpg',
                            content: '河北省邯郸市娲皇宫景区，位于河北省邯郸市涉县中皇山上，为中国神话传说女娲娘娘炼石补天，抟土造人之地，娲皇宫始建于北齐时期，初为北齐文宣帝高洋所建离宫，初开三石室，雕数尊神像。后经历代修葺续建，娲皇宫现今占地面积达76万平方米。如今建筑多为明清时期，而北齐遗迹，仅留石窟与摩崖刻经，共6部，是中国现存摩崖刻经中最早、字数最多的一处。'
                        }]
                    },
                    {
                        name: '南北响堂山石窟',
                        center: [114.196564, 36.426963],
                        style: new Style({
                            text: new TextStyle({
                                text: '南北响堂山石窟',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/nbxtssk.jpg',
                                scale: 0.08
                            })
                        }),
                        desc: [{
                            img: './handan/nbxtssk.jpg',
                            content: '石窟大小佛像4300多尊并有大量经文，雕刻，是研究佛教、建筑、雕刻、美术、书法的宝库，在中国石窟艺术向唐代写实风格的演变中，起着承上启下作用。北响堂山石窟位于矿区和村东，北鼓山西腰，现存石窟9座，大小佛像72尊，其中南、中、北三大窟为北齐王朝开凿。三窟中以位于窟群北端的大佛洞规模最大，装饰最华丽。该窟进深11.8米，宽13米，高11.4米，置塔形柱三面开凿一大龛，正面龛内一佛两菩萨，正尊坐佛连座通高5米，佛背光浮雕塑火焰忍冬纹，七条火龙穿插期间，生动活泼。塔柱上窟壁共凿26个列龛，列龛由弓形楣梁、垂幔、龛柱、覆钵等组成，雕刻细致，钵顶雕塑华丽的大型火焰宝珠，窟的整体部局，装饰，显示北齐时期的高超雕刻艺术。\n' +
                                '南响堂山石窟，位于彭城滏阳河源头北侧山腰，现存七窟，均凿于北齐，大小造像3588尊，其中千佛洞最为华丽，窟外整体外观为覆钵塔形。窟前设四柱三开间前廊的仿木结构建筑,其斗拱窟檐以上凿大形覆钵，钵中央雕展翅欲飞的金翅鸟，上雕宝珠，钵两端饰卷云状山花蕉叶，这一保存完整华丽的装饰，十分罕见。窟内进深3.6米，宽3.9米，高3.7米。前壁满雕塑千佛，其它三壁又凿一大龛，内均一佛二弟子两菩萨。壁上部也各雕千佛，下设基坛，窟顶微隆，雕莲花和八尊伎乐天，形象生动形象美观，堪称时代佳作。石窟附近有古塔，靠山阁楼，寺院殿宇等附属建筑群。另有称作\'小响堂\'的水浴寺石窟，位于北鼓山东麓，与北响堂隔天宫峰东西相立。现存东西两座石崖，两处摩崖造像，两座北宋经幢，水浴寺的前殿等。响堂山石窟，规模宏伟，雕刻精致，可与三大石窟媲美。'

                        }]
                    },
                    {
                        name: '磁州窑',
                        center: [114.376404, 36.373486],
                        style: new Style({
                            text: new TextStyle({
                                text: '磁州窑',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/czy.jpg',
                                scale: 0.3
                            })
                        }),
                        desc: [{
                            img: './handan/czy.jpg',
                            content: '磁州窑博物馆占地7.8亩，建设总面积5000平方米。该馆由河北省建筑设计研究院设计，该设计结合了磁州窑的特点，在建筑形制上以“窑”为中心，以“弧”为展线，上下分两层，内设四个大展厅，并设有文物库房、学术报告厅，文物修复室、陶吧等。 [1] \n' +
                                '截至2019年8月，磁州窑博物馆展线总长度480米，展出文物400件，图片278张，其它辅助展品186件。该馆陈列由五部分构成：第一部分：序厅——黑与白的艺术；第二部分：窑火初燃——北朝隋唐时期；第三部分：化境黑白——宋金元时期；第四部分：余韵悠长——明清民国时期；第五部分：美器由来——烧造工艺。\n' +
                                '序厅——黑与白的艺术\n' +
                                '序厅外形为磁州窑典型的馒头窑形状，居于博物馆的中央位置。序厅圆形内墙以烧成色壁砖和匣钵为装饰，突出表现“窑”的氛围。正中墙体上有大幅“观台窑址”喷绘照片，照片上有馒头窑、漳河、黄土地和陈列标题“黑与白的艺术”。照片前面为黑白两块相互连接的落地长方体块石，分别镌刻着中英文前言。顶部装饰系两个层次构造的白地黑花大龙盆“龙纹”图案和龙凤罐“葵花纹”图案，外沿为放射状铝合金格栅吊顶，寓意磁州的泥土经过磁州窑的幻化，变为“黑与白的艺术”。悬挂于东壁的灯箱带和西壁的电视组合，与正面装饰共同构成序厅的第二层次。东壁灯箱带展示的是国际、国内各大馆的磁州窑藏品。西壁的电视组合滚动播放磁州窑博物馆简介。整个序厅采用深色陶砖地面。\n' +
                                '第一展厅——窑火初燃\n' +
                                '该展厅展览磁州窑北朝至隋朝的产品，展品多为以生产白瓷、黑瓷、青瓷为主的北方民窑。\n' +
                                '第二展厅——化境黑白\n' +
                                '该展厅是整个陈列的核心展厅，将各个时期的磁州窑文物，特别是宋金元鼎盛时期的器物集于一堂。该展厅展品有金代龙纹大盆、金代梅瓶、元代龙凤罐等。该展厅还包括瓷枕厅部分。该部分展出了宋金元不同时期的瓷枕百余方。\n' +
                                '该展厅在传统的器物展示基础上，在内容设计上深“挖”瓷器的内涵，分别提炼出诗词曲赋150篇，装饰图案206幅，历史故事20则，装饰技法60种四项内容。设置了专门的展架，配以四个电视播放器分别滚动播放上述四项内容，同时，由动态展示转入静态显示，即在展线上另设置电子触摸屏，将上述四块内容装置进去，供观众触摸检索；同时，该展厅设置了书架，将涉及上述内容的有关书籍固定在展线上。\n' +
                                '第三展厅——余韵悠长\n' +
                                '该展厅一方面展示了明代磁州窑中心转向彭城窑，彭城成为“北方瓷都”的历史过程，另一方面将田野考古和博物馆陈列这两个专业结合起来。该展厅有瓷片柜、瓷片架和一个可直接用手触摸的瓷片箱。大体量的瓷片墙则表现了观台窑址四个考古阶段的地层情况，反映窑址地层构造和地层风貌。与瓷片柜、架、箱和瓷片墙相连的是模拟遗址场景，场景面积12米×7.5米，现场为框架玻璃平面，高12厘米，玻璃板下面是布满瓷片和草丛的遗址原始地面。遗址背景片18米×3.2米，背景片前配置不同类型磁州窑的结构图和考古现场照片。\n' +
                                '第四展厅——美器由来\n' +
                                '该展厅占地726平方米，展示了磁州窑全场景生产工艺，采用1：1的比例，用实物、雕塑、模型、背景画、投影、灯光、拟声等手段，展现了取土、炼泥、成型、施工、装饰、入窑的制瓷全过程。'
                        }]
                    },
                    {
                        name: '峰峰陶巴',
                        center: [114.218101, 36.474334],
                        style: new Style({
                            text: new TextStyle({
                                text: '峰峰陶巴',
                                offsetY: 30,
                                fill: new FillStyle({
                                    color: '#000000'
                                })
                            }),
                            image: new IconStyle({
                                src: './handan/fftb.jpg',
                                scale: 0.2
                            })
                        }),
                        desc: [{
                            img: './handan/fftb.jpg',
                            content: '所谓淘吧是指按照个人的喜好，自己加工、制作陶器的休闲场所。陶是指制作陶器，吧是英文BAR的译文，专指小酒吧，现泛指休闲娱乐场所。陶器制作在我国历史悠久，形成了独特的陶器文化。陶器除了其实用功能外，更多的是作为艺术品，传达制陶人的思想与感情。人们沉浸在淘吧里，一方面是孩童时的天性，另一方面通过亲手制作陶器来释放平时生活、工作带来的压力，制作的陶器还可以作为礼品赠送给亲戚朋友。也是一种艺术的名称。'
                        }]
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
                this.select = new Select({})
                this.map.addInteraction(this.select)
                this.initSelect()
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
                        if (a >= this.routeCoords.length) {
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