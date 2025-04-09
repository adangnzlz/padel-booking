import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Transactions from './pages/Transactions'
import Users from './pages/Users'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 text-white p-4">
          <h1 className="text-xl font-bold mb-8">Finance App</h1>
          <nav className="space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block p-2 rounded-md ${isActive ? 'bg-slate-700 font-medium' : 'hover:bg-slate-700'}`
              }
            >
              Transactions
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `block p-2 rounded-md ${isActive ? 'bg-slate-700 font-medium' : 'hover:bg-slate-700'}`
              }
            >
              Users
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Transactions />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
