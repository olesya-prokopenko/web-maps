(function ($) {
  $(document).ready(function () {

    DG.then(function () {
      return DG.plugin('https://2gis.github.io/mapsapi/vendors/Leaflet.markerCluster/leaflet.markercluster-src.js');
    }).then(function() {

      var map,
          markers = DG.markerClusterGroup(),
          coordinates = [];

      map = DG.map('map', {
        center: [55.75, 37.62],
        zoom: 13,
        zoomControl: false
      });

      DG.control.zoom({position: 'bottomright'}).addTo(map);

      function search(e) {
        e.preventDefault();
        markers.removeFrom(map);
        markers = DG.markerClusterGroup();

        var searchValue = $('.search-panel__field').val();

        var result = 'http://catalog.api.2gis.ru/2.0/catalog/marker/search?q=' + searchValue + '&page_size=15000&region_id=32&key=ruhebf8058';

        $.ajax({
          url: result,
          success: function(data, textStatus){
            var result = data.result;

            if (result && result.items && result.items.length) {
              $.each(data.result.items, function(i, val) {
                coordinates[0] = val.lat;
                coordinates[1] = val.lon;
                var marker = DG.marker(coordinates);
                markers.addLayer(marker);
              });

              map.addLayer(markers);

              $('.search-panel__result').text('По Вашему запросу найдено результатов:  ' + data.result.total );

              markers.addTo(map);
              map.fitBounds(markers.getBounds());
            }
            else {
              $('.search-panel__result').text('По Вашему запросу ничего не найдено');
            }
          },
          error: function(data, textStatus){
            $('.search-panel__result').text('С Вашим запросом возникла проблема..');
          }
        });
      }

      $('.search-panel__button').on('click', function (event) {
        search(event);
      });

      $('.search-panel__field').on('keydown', function (event) {
        if (event.keyCode === 13) {
          search(event);
        }
      });
    });
  })
})(jQuery);