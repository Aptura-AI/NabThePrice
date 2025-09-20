import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'

export default function StorePage({ store, discountCodes }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Store not found</h1>
        <p className="text-gray-600 mb-8">We couldn't find this store in our database.</p>
        <button onClick={() => router.push('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    )
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You can add a toast notification here later
    alert('Code copied to clipboard!')
  }

  return (
    <>
      <Head>
        <title>{store.name} Discount Codes - NabThePrice</title>
        <meta name="description" content={`Find working ${store.name} discount codes and save money on your purchase.`} />
      </Head>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">{store.name[0]}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{store.name} Discount Codes</h1>
            <p className="text-gray-600">Verified and updated daily</p>
          </div>

          {discountCodes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No active discount codes found for {store.name}.</p>
              <p className="text-sm text-gray-500">Check back later or try another store.</p>
            </div>
          ) : (
            <div className="space-y-4 mb-12">
              {discountCodes.map((code) => (
                <div key={code.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{code.code}</h3>
                      <p className="text-gray-600">{code.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(code.code)}
                      className="btn-primary text-sm"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <a
              href={store.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg"
            >
              Shop at {store.name}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { slug } = params

  // Get store data
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single()

  if (storeError || !store) {
    return { props: { store: null, discountCodes: [] } }
  }

  // Get discount codes for this store
  const { data: discountCodes, error: codesError } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('store_id', store.id)
    .eq('status', 'Active')
    .order('created_at', { ascending: false })

  if (codesError) {
    console.error('Error fetching discount codes:', codesError)
    return { props: { store, discountCodes: [] } }
  }

  return { props: { store, discountCodes } }
}