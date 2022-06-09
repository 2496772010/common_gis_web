<template>
  <div id="trafficPointApp">
    <base-map :params="mapParams" @mapCreated="onMapCreated"></base-map>
  
  </div>
</template>

<script>

  import BaseMap from "../../components/BaseMap";
  import {mapParams} from "../../config/mapConfig";
  import EditBar from 'ol-ext/control/EditBar'
  import 'ol-ext/control/EditBar.css'
  import Bar from 'ol-ext/control/Bar'
  import 'ol-ext/control/Bar.css'
  import Toggle from 'ol-ext/control/Toggle'
  import Button from 'ol-ext/control/Button'
  import {Vector as VectorLayer} from 'ol/layer'
  import {Vector as VectorSource} from 'ol/source'
  import Select from 'ol/interaction/Select'
  import {GeoJSON} from 'ol/format'
  import Draw from 'ol/interaction/Draw'
  import 'ol-ext/dist/ol-ext.css'

  export default {
    name: "trafficPointApp",
    components: {BaseMap},
    data() {
      return {
        mapParams,
        map: null,
        editBar: null,
        layer: null
      }
    },
    mounted() {
      mapParams.center = [103.705944, 29.568456]
    },
    methods: {
      onMapCreated(map) {
        this.map = map
        this.layer = new VectorLayer({
          source: new VectorSource()
        })
        this.map.addLayer(this.layer)
        this.initBar()
      },
      initBar() {
        var mainbar = new Bar();
        this.map.addControl(mainbar);

        this.editbar = new Bar({
          toggleOne: true,
          group: false
        });
        mainbar.addControl(this.editbar);

        // Add selection tool:
        //  1- a toggle control with a select interaction
        //  2- an option bar to delete / get information on the selected feature
        var sbar = new Bar();
        sbar.addControl(new Button({
          html: '<i class="fa fa-times"></i>',
          title: "Delete",
          handleClick: function () {
            let features = selectCtrl.getInteraction().getFeatures();
            for (let i = 0, f; f = features.item(i); i++) {
              this.layer.getSource().removeFeature(f);
            }
            selectCtrl.getInteraction().getFeatures().clear();
          }
        }));
        sbar.addControl(new Button({
          html: '<i class="fa fa-info"></i>',
          title: "Show informations",
        }));

        let selectCtrl = new Toggle({
          html: '<i class="fa fa-hand-pointer-o"></i>',
          title: "Select",
          interaction: new Select({hitTolerance: 2}),
          bar: sbar,
          autoActivate: true,
          active: true
        });

        editbar.addControl(selectCtrl);

        // Add editing tools
        var pedit = new Toggle({
          html: '<i class="fa fa-map-marker" ></i>',
          title: 'Point',
          interaction: new Draw({
            type: 'Point',
            source: this.layer.getSource()
          })
        });
        editbar.addControl(pedit);

        // Add a simple push button to save features
        var save = new Button({
          html: '<i class="fa fa-download"></i>',
          title: "Save",
          handleClick: function (e) {
            var json = new GeoJSON().writeFeatures(this.layer.getSource().getFeatures());
          }
        });
        mainbar.addControl(save);
      }
    }
  }
</script>

<style scoped>
  #trafficPointApp {
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 0;
    margin: 0;
    
  }
</style>

