interface HexDetailsProps {
  hexId: string | null;
  onClose: () => void;
}

const HexDetails = ({ hexId, onClose }: HexDetailsProps) => {
  if (!hexId) return null;

  // Mock data - replace with actual data fetching
  const details = {
    paczkomaty: 5,
    populacja: 12500,
    obiekty: {
      sklepy: 23,
      parkingi: 8,
      stacjeBenzynowe: 3
    }
  }

  return (
    <div className="absolute top-4 right-4 bottom-4 w-80 bg-white/95 backdrop-blur-sm 
                    rounded-2xl shadow-xl border border-orange-200 p-6 z-10
                    transform transition-transform duration-300">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 
                     bg-clip-text text-transparent mb-6">
        Szczegóły Obszaru
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">ID Obszaru</h3>
          <p className="font-mono text-sm">{hexId}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Paczkomaty</h3>
          <div className="text-2xl font-semibold text-orange-600">
            {details.paczkomaty}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Populacja</h3>
          <div className="text-2xl font-semibold text-orange-600">
            {details.populacja.toLocaleString()}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Obiekty</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sklepy</span>
              <span className="font-semibold text-orange-600">{details.obiekty.sklepy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Parkingi</span>
              <span className="font-semibold text-orange-600">{details.obiekty.parkingi}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stacje benzynowe</span>
              <span className="font-semibold text-orange-600">{details.obiekty.stacjeBenzynowe}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HexDetails 