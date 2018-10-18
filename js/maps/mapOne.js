var mapOne = new L.map('mapOne', {
  doubleClickZoom: false,
  dragging: false,
  scrollWheelZoom: false,
  attributionControl: false,
  center: [-34.603722, -59.381592],
  zoom: 5,
})

L.tileLayer(
  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png'
).addTo(mapOne)

var layerSource = {
  https: true,
  user_name: 'modernizacion',
  type: 'cartodb',
  sublayers: [
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
          line-width: 1.5;
          line-color: ramp([clasificacion_vuelo], (#7189f1, #1941b0), ("Cabotaje", "Internacional"), "=");
          line-opacity: 0.12;
        }`,
    },
  ],
  extra_params: {
    map_key: 'bd0f2377f89fab680d1b5db0df8bb3e4a7fac691',
  },
}

var sublayers = []

cartodb
  .createLayer(mapOne, layerSource, {
    https: true,
  })
  .addTo(mapOne)
  .done(function(layer) {})
  .error(function(err) {
    console.log('An error occurred: ' + err)
  })
