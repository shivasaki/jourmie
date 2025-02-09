import { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import InfoWindow from "./InfoWindow";

const Marker = ({
  map,
  center,
  draggable = true,
}: {
  map: google.maps.Map;
  center: { lat: number; lng: number };
  draggable?: boolean;
}) => {
  const marker = useRef<google.maps.Marker | null>(null);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [position, setPosition] = useState(center); // マーカーの現在座標

  const updateInfoWindow = useCallback(
    (position: { lat: number; lng: number }) => {
      const infoWindowDiv = document.createElement("div");
      const root = createRoot(infoWindowDiv);
      root.render(<InfoWindow position={position} />);
      console.log(infoWindow.current);

      if (infoWindow.current) {
        infoWindow.current.setContent(infoWindowDiv);
      }

      if (!infoWindow.current?.isOpen) {
        infoWindow.current?.open({
          map,
          anchor: marker.current,
        });
      }
    },
    [map]
  );

  useEffect(() => {
    if (!map) return;

    marker.current = new google.maps.Marker({
      position: center,
      map,
      draggable,
    });

    infoWindow.current = new google.maps.InfoWindow();

    if (center) {
      infoWindow.current.open({
        map,
        anchor: marker.current,
      });
    }

    // マーカーのドラッグ終了時
    marker.current.addListener("dragend", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setPosition(newPos);
      }
    });

    return () => {
      if (marker.current) {
        marker.current.setMap(null);
        marker.current = null;
      }
      if (infoWindow.current) {
        infoWindow.current.close();
        infoWindow.current = null;
      }
    };
  }, [center, draggable, map]);

  // propsによる中心座標の変更時（検索ボックスでの検索など）
  useEffect(() => {
    if (marker.current) {
      marker.current.setPosition(center);
    }
    updateInfoWindow(center);
  }, [center, updateInfoWindow]);

  // ドラッグによる座標変更時
  useEffect(() => {
    map.panTo(position); // マップの中心をウィーンって移動
    updateInfoWindow(position);
  }, [map, position, updateInfoWindow]);

  return null;
};

export default Marker;
