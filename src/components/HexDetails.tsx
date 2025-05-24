import { useState, useEffect } from 'react';
import { cellToLatLng, getHexagonEdgeLengthAvg, getResolution } from 'h3-js';

interface HexDetailsProps {
  hexId: string | null;
  onClose: () => void;
}

interface AreaData {
  score: number;
  shopCount: number;
  building: number;
  parking: number;
  buissness: number;
  health: number;
  education: number;
  public_safety: number;
  goverment_institutions: number;
  catering: number;
  tourism: number;
  population: number;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-[400px]">
    <div className="relative w-16 h-16">
      {/* Mastercard-inspired overlapping circles */}
      <div className="absolute w-10 h-10 bg-[#EB001B] rounded-full left-0 animate-pulse"></div>
      <div className="absolute w-10 h-10 bg-[#F79E1B] rounded-full right-0 animate-pulse"></div>
      <div className="absolute w-10 h-10 bg-[#FF5F00] rounded-full left-3 animate-pulse mix-blend-overlay"></div>
    </div>
  </div>
);

const HexDetails = ({ hexId, onClose }: HexDetailsProps) => {
  const [areaData, setAreaData] = useState<AreaData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAreaData = async () => {
      if (!hexId) {
        setAreaData(null);
        return;
      }

      setLoading(true);
      try {
        const [lat, lon] = cellToLatLng(hexId);
        const resolution = getResolution(hexId);
        const radiusMeters = getHexagonEdgeLengthAvg(resolution, 'km') * 1000;

        const response = await fetch(
          `http://localhost:8000/api/obszar?lat=${lat}&lon=${lon}&radius=${radiusMeters.toFixed(0)}`
        );
        const data = await response.json();
        setAreaData(data);
      } catch (error) {
        console.error('Error fetching area data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreaData();
  }, [hexId]);

  if (!hexId) return null;

  const getScoreColor = (score: number) => {
    if (score > 7.5) return 'text-green-600';
    if (score > 5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score > 7.5) return 'Bardzo dobra lokalizacja';
    if (score > 5) return 'Dobra lokalizacja';
    return 'Słaba lokalizacja';
  };

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

      {loading ? (
        <LoadingSpinner />
      ) : areaData ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Ocena lokalizacji</h3>
            <div className={`text-3xl font-bold ${getScoreColor(areaData.score)}`}>
              {areaData.score.toFixed(2)}
            </div>
            <p className={`text-sm mt-1 ${getScoreColor(areaData.score)}`}>
              {getScoreLabel(areaData.score)}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">store</span>
                <span className="text-gray-600">Sklepy</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.shopCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">apartment</span>
                <span className="text-gray-600">Budynki</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.building}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">local_parking</span>
                <span className="text-gray-600">Parkingi</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.parking}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">business</span>
                <span className="text-gray-600">Firmy</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.buissness}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">local_hospital</span>
                <span className="text-gray-600">Placówki zdrowia</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.health}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">school</span>
                <span className="text-gray-600">Edukacja</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.education}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">local_police</span>
                <span className="text-gray-600">Bezpieczeństwo</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.public_safety}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">account_balance</span>
                <span className="text-gray-600">Instytucje</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.goverment_institutions}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">restaurant</span>
                <span className="text-gray-600">Gastronomia</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.catering}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">hotel</span>
                <span className="text-gray-600">Turystyka</span>
              </span>
              <span className="font-semibold text-orange-600">{areaData.tourism}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-icons text-gray-600">person</span>
                <span className="text-gray-600">Populacja</span>
              </span>
              <span className="font-semibold text-orange-600">{Math.round(areaData.population)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Nie udało się pobrać danych dla tego obszaru
        </div>
      )}
    </div>
  );
};

export default HexDetails; 