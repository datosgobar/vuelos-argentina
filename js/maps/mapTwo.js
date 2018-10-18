let lon = -26.603722
let lat = -65.381592

var map = new L.Map('map', {
  center: [lon, lat],
  zoom: 3,
})

L.tileLayer(
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png'
).addTo(map)

var layerSource = {
  https: true,
  user_name: 'modernizacion',
  type: 'cartodb',
  url: 'https://{username}.carto.com/api/v1/map',
  sublayers: [
    {
      sql: 'SELECT * FROM modernizacion.volar_aeropuertos_geocode',
      cartocss: `
        #layer {
          marker-width: 6;
          marker-fill: ramp([iso_country], (#1b9ae5, #835ecd,#1b9ae5), (null, "AR"), "=");
          marker-fill-opacity: 0.9;
          marker-allow-overlap: true;
          marker-line-width: 0;
          marker-line-color: #FFFFFF;
          marker-line-opacity: 1;
        }`,
      interactivity: ['cartodb_id', 'pais', 'name', 'partidas', 'arribos'],
    },
    {
      sql:
        "WITH lines as( SELECT a.clasificacion_vuelo, a.origen_oaci, a.destino_oaci, a.cartodb_id, a.origen_oaci || '-' || a.destino_oaci as route, ST_Segmentize( ST_Makeline( cdb_latlng(a.origen_lat,a.origen_lon), cdb_latlng(a.destino_lat,a.destino_lon))::geography, 100000 )::geometry as the_geom FROM modernizacion.volar_rutas2017_regulares a WHERE clasificacion_vuelo = 'Internacional' ) SELECT *, case when ST_XMax(the_geom) - ST_XMin(the_geom) <= 180 then ST_Transform(the_geom,3857) when ST_XMax(the_geom) - ST_XMin(the_geom) > 180 then ST_Transform(ST_Difference(ST_Shift_Longitude(the_geom), ST_Buffer(ST_GeomFromText('LINESTRING(180 90, 180 -90)',4326), 0.00001)),3857) end as the_geom_webmercator FROM lines",
      cartocss: `
      #layer {
        line-width: 2.5;
        line-color: ramp([clasificacion_vuelo], (#835ecd, #1b9ae5), ("Cabotaje", "Internacional"), "=");
        line-opacity: 0.22;
      }`,
    },
    {
      sql:
        "WITH lines as( SELECT a.clasificacion_vuelo, a.origen_oaci, a.destino_oaci, a.cartodb_id, a.origen_oaci || '-' || a.destino_oaci as route, ST_Segmentize( ST_Makeline( cdb_latlng(a.origen_lat,a.origen_lon), cdb_latlng(a.destino_lat,a.destino_lon))::geography, 100000 )::geometry as the_geom FROM modernizacion.volar_rutas2017_regulares a WHERE clasificacion_vuelo = 'Cabotaje' ) SELECT *, case when ST_XMax(the_geom) - ST_XMin(the_geom) <= 180 then ST_Transform(the_geom,3857) when ST_XMax(the_geom) - ST_XMin(the_geom) > 180 then ST_Transform(ST_Difference(ST_Shift_Longitude(the_geom), ST_Buffer(ST_GeomFromText('LINESTRING(180 90, 180 -90)',4326), 0.00001)),3857) end as the_geom_webmercator FROM lines",
      cartocss: `
      #layer {
        line-width: 2.5;
        line-color: ramp([clasificacion_vuelo], (#835ecd, #1b9ae5), ("Cabotaje", "Internacional"), "=");
        line-opacity: 0.22;
      }`,
    },
  ],
  extra_params: {
    map_key: 'bd0f2377f89fab680d1b5db0df8bb3e4a7fac691',
  },
}

var sublayers = []

cartodb
  .createLayer(map, layerSource, {
    https: true,
  })
  .addTo(map)
  .done(function(layer) {
    let aeropuertos = layer.getSubLayer(0)
    let internacional = layer.getSubLayer(1)
    let cabotaje = layer.getSubLayer(2)

    // Layers toggle
    $('#cabotaje').on('click', function(e, sublayers) {
      cabotaje.show()
      internacional.hide()
    })
    $('#internacional').on('click', function(e, sublayers) {
      cabotaje.hide()
      internacional.show()
    })
    $('#todos').on('click', function(e, sublayers) {
      cabotaje.show()
      internacional.show()
    })

    // Layer interactions
    aeropuertos.setInteraction(true)
    addCursorInteraction(aeropuertos)

    var tooltip = layer.leafletMap.viz.addOverlay({
      type: 'tooltip',
      layer: layer,
      template: `
          <div class="cartodb-tooltip-content-wrapper">
              <p class="title-popup"><strong>{{pais}}</strong></p>
              <p><span class="categoria-popup">Aeropuerto /</span> {{name}}</p>
              <hr />
              <p><span class="categoria-popup">Partidas /</span> {{partidas}}</p>
              <hr />
              <p><span class="categoria-popup">Arribos /</span> {{arribos}}</p>
          </div>
      `,
      width: 400,
      position: 'bottom|right',
      fields: [{ name: 'pais' }],
    })

    $('body').append(tooltip.render().el)

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      layer.on('featureClick', function(e, latlng, pos, data) {
        let arribos = data.arribos
        let partidas = data.partidas
        let pais = data.pais
        let name = data.name
        // 3- Add coordinates of the selected geometry in the div element
        //  with id = "box"
        // $('#popup-custom').offset({ left: e.pageX, top: e.pageY })
        $('#popup-custom').html(`
          <div class="cartodb-tooltip-content-wrapper">
            <img id="closePopup" class="close-popup" src="./assets/cruz.svg" />
            <p class="title-popup"><strong>${pais}</strong></p>
            <p><span class="categoria-popup"></span> ${name}</p>
            <div class="popup-row">
              <p><span class="categoria-popup">Partidas</span> ${partidas}</p>
              <p class="arribos-popup"><span class="categoria-popup">Arribos</span> ${arribos}</p>
            </div>
          </div>
        `)
        $('#popup-custom').css({ display: 'block' })

        console.log(document.getElementById('closePopup'))
        document.getElementById('closePopup').addEventListener('click', () => {
          $('#popup-custom').css({ display: 'none' })
        })
      })
    }
  })
  .error(function(err) {
    console.log('An error occurred: ' + err)
  })

function addCursorInteraction(layer) {
  var hovers = []
  layer.bind('featureOver', function(e, latlon, pxPos, data, layer) {
    hovers[layer] = 1
    if (_.any(hovers)) {
      $('#map').css('cursor', 'pointer')
    }
  })
  layer.bind('featureOut', function(m, layer) {
    hovers[layer] = 0
    if (!_.any(hovers)) {
      $('#map').css('cursor', 'auto')
    }
  })
}
