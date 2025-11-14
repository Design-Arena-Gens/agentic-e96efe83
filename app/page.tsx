'use client'

import { useState } from 'react'
import { Download, Search, MapPin, Phone, Building2, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'

interface Business {
  name: string
  phone: string
  address: string
  rating?: number
  reviews?: number
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateMockData = (query: string, loc: string): Business[] => {
    const businessTypes = ['Restaurant', 'Cafe', 'Store', 'Salon', 'Gym', 'Pharmacy', 'Bakery', 'Hotel']
    const names = ['Golden', 'Royal', 'Prime', 'Elite', 'Modern', 'Classic', 'Fresh', 'Urban', 'Cozy', 'Grand']
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln', 'Elm St', 'Park Ave', 'Lake Rd']

    const data: Business[] = []
    const numResults = Math.floor(Math.random() * 15) + 10

    for (let i = 0; i < numResults; i++) {
      const bizType = businessTypes[Math.floor(Math.random() * businessTypes.length)]
      const bizName = names[Math.floor(Math.random() * names.length)]
      const street = streets[Math.floor(Math.random() * streets.length)]
      const streetNum = Math.floor(Math.random() * 999) + 1

      data.push({
        name: `${bizName} ${query || bizType}`,
        phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        address: `${streetNum} ${street}, ${loc || 'New York'}, NY ${Math.floor(Math.random() * 90000) + 10000}`,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        reviews: Math.floor(Math.random() * 500) + 10
      })
    }

    return data
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query')
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      const mockData = generateMockData(searchQuery, location)
      setBusinesses(mockData)
      setLoading(false)
    }, 1500)
  }

  const exportToExcel = () => {
    if (businesses.length === 0) {
      setError('No data to export')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(
      businesses.map((business) => ({
        'Business Name': business.name,
        'Phone Number': business.phone,
        'Location': business.address,
        'Rating': business.rating || 'N/A',
        'Reviews': business.reviews || 'N/A'
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Businesses')

    const fileName = `businesses_${searchQuery.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Google Maps Business Extractor
            </h1>
          </div>

          <p className="text-gray-600 mb-8">
            Search for businesses and export their information to Excel spreadsheets
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Coffee shops, Restaurants, Gyms"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, Los Angeles, Chicago"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search Businesses
                </>
              )}
            </button>

            {businesses.length > 0 && (
              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export to Excel
              </button>
            )}
          </div>
        </div>

        {businesses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Found {businesses.length} Businesses
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Business Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone Number</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{business.name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {business.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{business.address}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          ⭐ {business.rating}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{business.reviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This demo uses simulated data. To extract real Google Maps data, you would need to integrate with the Google Places API or use web scraping techniques. Always comply with Google's Terms of Service when collecting data.
          </p>
        </div>
      </div>
    </main>
  )
}
