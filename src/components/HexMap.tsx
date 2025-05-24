import DeckGL from "@deck.gl/react"
import { Map, MapRef, ViewState, Marker } from "react-map-gl/maplibre"
import type { StyleSpecification } from 'maplibre-gl'
import { H3HexagonLayer } from "@deck.gl/geo-layers"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import ParcelLockerMarker from './ParcelLockerMarker'

import { bboxFromViewport, getH3IndicesForBB } from "../utils/hex"

import MAP_STYLE from "../styles/mapStyle"

const MIN_ZOOM = 14
const MAX_ZOOM = 18

// Calculate radius based on zoom level
const getRadiusFromZoom = (zoom: number): number => {
  if (zoom >= 17) return 1;
  if (zoom >= 15) return 2;
  return 3;
};

// Poland's bounding box
const BOUNDS = {
  north: 54.9,  // Northern limit
  south: 49.0,  // Southern limit
  west: 14.12,  // Western limit
  east: 24.15   // Eastern limit
}

const INITIAL_VIEW_STATE = {
  longitude: 21.0122,
  latitude: 52.2297,
  zoom: 14,
  width: 1000,
  height: 1000
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Map zoom levels to h3 resolutions
const getResolutionFromZoom = (zoom: number): number => {
      if (zoom >= 15) return 10
      if (zoom >= 14.5) return 9
      return 8
}

interface ParcelLocker {
  id: string;
  name: string;
  lat: number;
  lon: number;
  status: string;
  location_type: string;
  opening_hours: string;
}

interface HexMapProps {
  selectedH3Indice: string | null;
  onHexClick: (selectedH3Indice: string | null) => void;
  viewport: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  onViewportChange: (viewport: { longitude: number; latitude: number; zoom: number }) => void;
}

const HexMap = ({ selectedH3Indice, onHexClick, viewport, onViewportChange }: HexMapProps) => {
  const [viewState, setViewState] = useState({
    ...viewport,
    width: 1000,
    height: 1000
  })
  const [parcelLockers, setParcelLockers] = useState<ParcelLocker[]>([])
  const [showParcelLockers, setShowParcelLockers] = useState(false)

  // Update local viewState when viewport prop changes
  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      ...viewport
    }))
  }, [viewport])

  const fetchParcelLockers = async () => {
    const radius = getRadiusFromZoom(viewState.zoom);
    try {
      const response = await fetch(
        `http://localhost:8000/api/paczkomaty?lat=${viewState.latitude}&lon=${viewState.longitude}&radius=${radius}`
      );
      const data = await response.json();
      setParcelLockers(data);
      setShowParcelLockers(true);
    } catch (error) {
      console.error('Error fetching parcel lockers:', error);
      alert('Nie udało się pobrać danych o paczkomatach');
    }
  };

  const mapRef = useRef<MapRef>(null)

  const debouncedZoom = useDebounce(viewState.zoom, 150)
  
  const boundingBox = bboxFromViewport(viewState)
  const resolution = getResolutionFromZoom(debouncedZoom)
  const h3Indices = useMemo(() => getH3IndicesForBB(boundingBox, resolution), [boundingBox, resolution])

  // Constrain the coordinates to Poland's bounds
  const constrainCoordinates = (longitude: number, latitude: number) => {
    return {
      longitude: Math.min(Math.max(longitude, BOUNDS.west), BOUNDS.east),
      latitude: Math.min(Math.max(latitude, BOUNDS.south), BOUNDS.north)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setViewState(prev => ({
        ...prev,
        width: window.innerWidth,
        height: window.innerHeight
      }))
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const newZoom = viewState.zoom - (e.deltaY * 0.01);
        if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
          setViewState(prev => ({
            ...prev,
            zoom: newZoom
          }));
          onViewportChange({
            longitude: viewState.longitude,
            latitude: viewState.latitude,
            zoom: newZoom
          });
        }
      }
    };

    window.addEventListener('resize', handleResize)
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [viewState.zoom, onViewportChange])

  const layers = [
    new H3HexagonLayer({
      id: "h3-hexagon-layer",
      data: h3Indices,
      pickable: true,
      wireframe: true,
      filled: true,
      extruded: true,
      elevationScale: 0,
      getHexagon: (d) => d,
      autoHighlight: true,
      getLineColor: [0, 0, 0],
      getFillColor: (d) => {
        const isSelected = selectedH3Indice === d
        return isSelected ? [242, 141, 59, 100] : [0, 0, 0, 1]
      },
      opacity: 1,
      onClick: (info) => {
        const isAlreadySelected = selectedH3Indice === info.object

        if (isAlreadySelected) {
          onHexClick(null)
        } else {
          onHexClick(info.object)
        }
      },
    }),
  ]

  return (
    <>
      <DeckGL
        style={{ position: "absolute", width: '100%', height: '100%' }}
        initialViewState={viewState}
        onViewStateChange={({viewState}) => {
          const vs = viewState as { longitude: number; latitude: number; zoom: number };
          const newZoom = Math.min(Math.max(vs.zoom, MIN_ZOOM), MAX_ZOOM);
          const constrained = constrainCoordinates(vs.longitude, vs.latitude);
          
          const newViewport = {
            ...constrained,
            zoom: newZoom,
          };

          onViewportChange(newViewport);
          setViewState({
            ...newViewport,
            width: window.innerWidth,
            height: window.innerHeight
          });
        }}
        controller={true}
        layers={layers}
      >
        <Map
          ref={mapRef}
          initialViewState={viewState}
          mapStyle={MAP_STYLE as any}
          style={{ width: '100%', height: '100%' }}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          maxBounds={[[BOUNDS.west, BOUNDS.south], [BOUNDS.east, BOUNDS.north]]}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {showParcelLockers && parcelLockers.map(locker => (
              <Marker
                key={locker.id}
                longitude={locker.lon}
                latitude={locker.lat}
                anchor="center"
                style={{ zIndex: 999 }}
              >
                <ParcelLockerMarker locker={locker} />
              </Marker>
            ))}
          </div>
        </Map>
      </DeckGL>

      <button
        onClick={fetchParcelLockers}
        className="absolute bottom-4 left-4 px-6 py-2 rounded-lg 
                   bg-gradient-to-r from-orange-600 to-red-600 
                   text-white font-medium shadow-lg
                   hover:from-orange-500 hover:to-red-500 
                   active:from-orange-700 active:to-red-700
                   transition-all duration-200 z-10"
      >
        Pokaż paczkomaty
      </button>
    </>
  )
}

export default HexMap
