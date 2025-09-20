import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

export default function Home({ trendingStores }) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/store/${searchQuery.trim().toLowerCase()}`)
    }
  }

  return (
    <>
      <Head>
        <title>NabThePrice - Find the Best Discount Codes & Deals</title>
        <meta name="description" content="Find working discount codes for all your favorite stores. Save money on Nike, Amazon, Best Buy, and more." />
      </Head>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Never Pay Full Price
            <span className="text-gradient"> Again</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Find verified discount codes for thousands of stores. Working codes, updated daily.
          </p>

          <form onSubmit={handleSearch} className="mb-16">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter store name (e.g., Nike, Amazon)..."
                className="input-field text-lg"
              />
              <button type="submit" className="btn-primary text-lg">
                Find Codes
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Discount Codes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Popular Stores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Verified Daily</div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Trending Stores</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trendingStores.map((store) => (
              <a
                key={store.slug}
                href={`/store/${store.slug}`}
                className="card group text-center"
              >
                <div className="w-16 h-16 mb-4 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">{store.name[0]}</span>
                </div>
                <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                  {store.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: trendingStores, error } = await supabase
    .from('stores')
    .select('*')
    .limit(6)

  if (error) {
    console.error('Error fetching trending stores:', error)
    return { props: { trendingStores: [] } }
  }

  return { props: { trendingStores } }
}