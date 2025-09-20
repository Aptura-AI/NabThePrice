import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 via-white">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 NabThePrice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}