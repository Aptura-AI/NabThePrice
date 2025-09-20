import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Head from 'next/head'
import Settings from '../components/Settings'

export default function Admin() {
  const [stores, setStores] = useState([])
  const [newStore, setNewStore] = useState({ name: '', slug: '', logo_url: '', affiliate_link: '' })
  const [newDiscount, setNewDiscount] = useState({ store_id: '', code: '', description: '' })
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchStores()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
    }
  }

  const fetchStores = async () => {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('name')
    
    if (!error) setStores(data)
  }

  const addStore = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('stores')
      .insert([{ ...newStore, slug: newStore.slug.toLowerCase() }])
    
    if (!error) {
      setNewStore({ name: '', slug: '', logo_url: '', affiliate_link: '' })
      fetchStores()
      alert('Store added successfully!')
    }
  }

  const addDiscount = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('discount_codes')
      .insert([{ ...newDiscount, status: 'Active' }])
    
    if (!error) {
      setNewDiscount({ store_id: '', code: '', description: '' })
      alert('Discount code added successfully!')
    }
  }

  if (!user) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>

  return (
    <>
      <Head>
        <title>Admin Panel - NabThePrice</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-medium">{user.email}</span>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Add Store Form */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Add New Store</h2>
              <form onSubmit={addStore} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={newStore.slug}
                    onChange={(e) => setNewStore({ ...newStore, slug: e.target.value })}
                    className="input-field"
                    placeholder="nike, amazon, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={newStore.logo_url}
                    onChange={(e) => setNewStore({ ...newStore, logo_url: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate Link</label>
                  <input
                    type="url"
                    required
                    value={newStore.affiliate_link}
                    onChange={(e) => setNewStore({ ...newStore, affiliate_link: e.target.value })}
                    className="input-field"
                    placeholder="https://www.nike.com/?your_affiliate_code"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Add Store
                </button>
              </form>
            </div>

            {/* Add Discount Code Form */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Add Discount Code</h2>
              <form onSubmit={addDiscount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
                  <select
                    required
                    value={newDiscount.store_id}
                    onChange={(e) => setNewDiscount({ ...newDiscount, store_id: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select a store</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
                  <input
                    type="text"
                    required
                    value={newDiscount.code}
                    onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                    className="input-field"
                    placeholder="SAVE20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    required
                    value={newDiscount.description}
                    onChange={(e) => setNewDiscount({ ...newDiscount, description: e.target.value })}
                    className="input-field"
                    placeholder="20% off entire order"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Add Discount Code
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Settings />
        )}

        {/* Stores List */}
        {activeTab === 'dashboard' && (
          <div className="card mt-8">
            <h2 className="text-xl font-semibold mb-4">All Stores ({stores.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Slug</th>
                    <th className="text-left p-2">Affiliate Link</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map(store => (
                    <tr key={store.id}>
                      <td className="p-2">{store.name}</td>
                      <td className="p-2">{store.slug}</td>
                      <td className="p-2">
                        <a href={store.affiliate_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Link
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}