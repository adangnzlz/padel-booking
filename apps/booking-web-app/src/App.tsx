import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Schedule from './pages/schedule/Schedule';
import AvailableSlotsAdmin from './pages/AvailableSlotsAdmin';
import AvailableSlotsUser from './pages/AvailableSlotsUser';
import { BookingProvider } from './contexts/BookingContext';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Schedule />} />
            <Route path="admin-slots" element={<AvailableSlotsAdmin />} />
            <Route path="user-slots" element={<AvailableSlotsUser />} />
          </Route>
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;
