
import mapboxgl from 'mapbox-gl';

export function addMapMarker(
  map: mapboxgl.Map,
  coordinates: [number, number],
  popupHtml?: string,
  color = '#0ea5e9'
) {
  const marker = new mapboxgl.Marker({ color })
    .setLngLat([coordinates[1], coordinates[0]]);
  
  if (popupHtml) {
    marker.setPopup(new mapboxgl.Popup().setHTML(popupHtml));
  }
  
  marker.addTo(map);
  return marker;
}

export function addMapNavigation(map: mapboxgl.Map, position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'bottom-right') {
  map.addControl(new mapboxgl.NavigationControl(), position);
}
