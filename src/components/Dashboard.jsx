import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTrips } from '../store/tripSlice'
import api from '../services/api'

export default function Dashboard() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [stats, setStats] = useState({
    totalDistance: 0,
    totalCO2Saved: 0,
    totalTrips: 0,
    currentMonth: [],
    electricityUsed: 0,
    electricityCO2: 0,
    treesNeeded: 0
  })
  const [loading, setLoading] = useState(true)

  // CONFIG: tweak these numbers for your model
  const KWH_PER_KM = 0.15          // 15 kWh / 100 km
  const GRID_CO2_PER_KWH = 0.7     // 0.7 kg CO2 per kWh
  const TREE_CO2_PER_YEAR = 20     // 20 kg CO2 absorbed per tree per year

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/trips')

        // Ensure trips is an array
        const trips = Array.isArray(response.data) ? response.data : []

        // Total distance (backend column: distance_km)
        const totalDistanceRaw = trips.reduce(
          (sum, trip) => sum + (trip.distance_km || 0),
          0
        )

        // CO2 saved vs petrol (grams → kg)
        const totalCO2Grams = trips.reduce(
          (sum, trip) => sum + (trip.co2_saved_vs_petrol_grams || 0),
          0
        )
        const totalCO2SavedKg = totalCO2Grams / 1000

        // Current month trips
        const currentMonthTrips = trips.filter(t => {
          const dateStr = t.created_at || t.started_at
          if (!dateStr) return false
          const tripDate = new Date(dateStr)
          const today = new Date()
          return (
            tripDate.getMonth() === today.getMonth() &&
            tripDate.getFullYear() === today.getFullYear()
          )
        })

        // NEW: electricity + pollution + plantation

        // 1) Electricity used (kWh)
        const electricityUsed = totalDistanceRaw * KWH_PER_KM

        // 2) CO2 from that electricity (kg)
        const electricityCO2 = electricityUsed * GRID_CO2_PER_KWH

        // 3) Trees needed to offset that CO2 (tree‑years)
        const treesNeeded =
          TREE_CO2_PER_YEAR > 0
            ? electricityCO2 / TREE_CO2_PER_YEAR
            : 0

        setStats({
          totalDistance: totalDistanceRaw.toFixed(2),
          totalCO2Saved: totalCO2SavedKg.toFixed(2),
          totalTrips: trips.length,
          currentMonth: currentMonthTrips,
          electricityUsed: electricityUsed.toFixed(2),
          electricityCO2: electricityCO2.toFixed(2),
          treesNeeded: treesNeeded.toFixed(1)
        })

        dispatch(setTrips(trips))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [dispatch])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800"> Eco Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">
          Your driving and environmental impact summary
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-xs text-gray-600">Total Trips</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {stats.totalTrips}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            This month: {stats.currentMonth.length}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-xs text-gray-600">Total Distance</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {stats.totalDistance} km
          </p>
          <p className="text-xs text-gray-600 mt-2">Eco‑friendly driving</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <p className="text-xs text-gray-600">CO₂ Saved vs Petrol</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {stats.totalCO2Saved} kg
          </p>
          <p className="text-xs text-gray-600 mt-2">Environmental impact</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <p className="text-xs text-gray-600">Trees Equivalent</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {Math.round(stats.totalCO2Saved / 20)}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Equivalent trees planted
          </p>
        </div>
      </div>

      {/* NEW: Electricity + Pollution + Plantation block */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
        <p className="text-sm font-bold text-gray-800 mb-4">
          ⚡ Energy & Plantation Impact (All Trips)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total electricity used */}
          <div className="bg-white border border-blue-100 p-4 rounded-lg">
            <p className="text-xs text-gray-600">Electricity Consumed</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.electricityUsed} kWh
            </p>
            <p className="text-xs text-gray-600 mt-2">
              To drive {stats.totalDistance} km
            </p>
          </div>

          {/* CO2 from electricity */}
          <div className="bg-white border border-red-100 p-4 rounded-lg">
            <p className="text-xs text-gray-600">
              CO₂ from Electricity Generation
            </p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {stats.electricityCO2} kg
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Based on grid factor {GRID_CO2_PER_KWH} kg/kWh
            </p>
          </div>

          {/* Trees needed to offset */}
          <div className="bg-white border border-green-100 p-4 rounded-lg">
            <p className="text-xs text-gray-600">
              Trees Needed to Offset (1 year)
            </p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.treesNeeded}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Assuming {TREE_CO2_PER_YEAR} kg CO₂ absorbed per tree/year
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder for your existing Monthly Trend / other sections */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <p className="text-sm font-bold text-gray-800 mb-2">
           Monthly Trend
        </p>
        <p className="text-xs text-gray-500">
          Chart visualization would go here
        </p>
      </div>
    </div>
  )
}
