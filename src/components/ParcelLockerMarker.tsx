import { useState } from 'react';

interface ParcelLocker {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface ParcelLockerMarkerProps {
  locker: ParcelLocker;
}

const ParcelLockerMarker = ({ locker }: ParcelLockerMarkerProps) => {

  return (
    <div style={{ position: 'relative', zIndex: 999 }}>
      <div 
        className="cursor-pointer w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md
                   hover:bg-orange-600 transition-colors duration-200"
        style={{ pointerEvents: 'auto' }}
      />

    </div>
  );
};

export default ParcelLockerMarker; 