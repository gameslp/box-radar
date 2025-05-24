'use client';

import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState } from 'react';
import { cellsToMultiPolygon } from 'h3-js';
import HexMap from '@/components/HexMap';
import SearchBox from '@/components/SearchBox';
import HexDetails from '@/components/HexDetails';

export default function HomePage() {
  const [selectedH3Indice, setSelectedH3Indice] = useState<string | null>(null)
  const [viewport, setViewport] = useState({
    longitude: 21.0122,
    latitude: 52.2297,
    zoom: 14
  })

  const handleSearch = ({ longitude, latitude }: { longitude: number; latitude: number }) => {
    setViewport(prev => ({
      ...prev,
      longitude,
      latitude,
      zoom: 14 // Zoom in when searching for a specific location
    }))
  }

  return (
    <main className="fixed inset-0 w-full h-full">
      <HexMap 
        selectedH3Indice={selectedH3Indice} 
        onHexClick={setSelectedH3Indice}
        viewport={viewport}
        onViewportChange={setViewport}
      />
      <SearchBox onSearch={handleSearch} />
      <HexDetails hexId={selectedH3Indice} onClose={() => setSelectedH3Indice(null)} />
    </main>
  );
}
