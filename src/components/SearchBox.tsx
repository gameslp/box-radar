import { useState } from 'react'

interface SearchBoxProps {
  onSearch: (coordinates: { longitude: number; latitude: number }) => void;
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [coordinates, setCoordinates] = useState({
    longitude: '',
    latitude: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lon = parseFloat(coordinates.longitude)
    const lat = parseFloat(coordinates.latitude)
    
    if (isNaN(lon) || isNaN(lat)) return
    
    // Poland's bounds
    if (lon < 14.12 || lon > 24.15 || lat < 49.0 || lat > 54.9) {
      alert('Współrzędne muszą być w granicach Polski')
      return
    }

    onSearch({ longitude: lon, latitude: lat })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Allow only numbers, dots, and minus signs
    if (!/^-?\d*\.?\d*$/.test(value) && value !== '') return

    setCoordinates(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="absolute top-4 left-4 z-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white/95 p-4 rounded-2xl shadow-lg border border-orange-200">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 font-medium">Długość geograficzna</label>
          <input
            type="text"
            name="longitude"
            value={coordinates.longitude}
            onChange={handleInputChange}
            placeholder="np. 21.0122"
            className="px-3 py-1.5 rounded-lg bg-white border border-orange-200
                     focus:outline-none focus:ring-2 focus:ring-orange-500
                     placeholder:text-gray-400"
          />
          <span className="text-xs text-gray-400">Zakres: 14.12° - 24.15°</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 font-medium">Szerokość geograficzna</label>
          <input
            type="text"
            name="latitude"
            value={coordinates.latitude}
            onChange={handleInputChange}
            placeholder="np. 52.2297"
            className="px-3 py-1.5 rounded-lg bg-white border border-orange-200
                     focus:outline-none focus:ring-2 focus:ring-orange-500
                     placeholder:text-gray-400"
          />
          <span className="text-xs text-gray-400">Zakres: 49.0° - 54.9°</span>
        </div>

        <button
          type="submit"
          className="px-6 py-2 mt-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 
                   text-white font-medium shadow-lg
                   hover:from-orange-500 hover:to-red-500 
                   active:from-orange-700 active:to-red-700
                   transition-all duration-200"
        >
          Przejdź do lokalizacji
        </button>
      </form>
    </div>
  )
}

export default SearchBox 