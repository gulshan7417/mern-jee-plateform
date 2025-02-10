import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Sidebar = () => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  // Instead of absolute dropdown, we render a nested list that expands.
  const [showDashboardOptions, setShowDashboardOptions] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Fetch user role from localStorage or default to 'student'
    const storedUserRole = localStorage.getItem('role') || 'student'
    setUserRole(storedUserRole)
  }, [])

  // Helper function to check if the current route matches the link
  const isActive = (path) =>
    router.pathname === path ? 'bg-blue-700' : ''

  // Toggle the dashboard options dropdown
  const handleDashboardClick = () => {
    setShowDashboardOptions(!showDashboardOptions)
  }

  // Redirect to Student Dashboard
  const handleStudentDashboardClick = () => {
    setShowDashboardOptions(false)
    router.push('/dashboard/student')
  }

  // Redirect to Admin Dashboard
  const handleAdminDashboardClick = () => {
    setShowDashboardOptions(false)
    router.push('/dashboard/admin')
  }

  // Logout modal logic
  const handleLogoutClick = () => {
    setShowModal(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem('token') // Clear token (modify as needed)
    sessionStorage.clear() // Clear session storage if used
    setShowModal(false)
    router.push('/login')
  }

  const cancelLogout = () => {
    setShowModal(false)
  }

  return (
    <>
      <aside className="w-[250px] bg-blue-950 p-4 h-screen sticky top-0 flex flex-col text-white border-r border-gray-700">
        {/* Logo Section */}
        <div className="flex justify-center py-2 px-2 rounded-lg mb-6">
          <Link href="/" className="flex gap-4 justify-center items-center">
            <img
              src="/images/logo.webp"
              alt="NSS IIT Roorkee"
              className="w-12 rounded-md h-auto"
            />
            <h2 className="text-lg font-semibold">IIT/JEE</h2>
          </Link>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col gap-2 flex-grow">
          {/* Dashboard with inline nested options */}
          <div>
            <button
              onClick={handleDashboardClick}
              className={`block w-full px-4 py-2 rounded-3xl text-center text-lg transition-colors duration-200 ${isActive('/dashboard')}`}
            >
              Dashboard
            </button>
            {showDashboardOptions && (
              <ul className="mt-2 ml-4 space-y-1">
                <li>
                  <button
                    onClick={handleStudentDashboardClick}
                    className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Student
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleAdminDashboardClick}
                    className="w-full text-left px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Admin
                  </button>
                </li>
              </ul>
            )}
          </div>

          <Link
            href="/test"
            className={`block px-4 py-2 rounded-3xl text-center text-lg transition-colors duration-200 ${isActive('/test')}`}
          >
            Give a Test
          </Link>
          <Link
            href="/admin/create_test"
            className={`block px-4 py-2 rounded-3xl text-center text-lg transition-colors duration-200 ${isActive('/admin/create_test')}`}
          >
            Create a Test
          </Link>
          <Link
            href="/analysis"
            className={`block px-4 py-2 rounded-3xl text-center text-lg transition-colors duration-200 ${isActive('/analysis')}`}
          >
            Test Analysis
          </Link>
          <Link
            href="/login"
            className={`block px-4 py-2 rounded-3xl text-center text-lg transition-colors duration-200 ${isActive('/login')}`}
          >
            Login
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-3xl text-lg w-full text-center transition-colors duration-200"
        >
          Logout
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Logout
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelLogout}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
