// frontend/src/pages/Doctor/Reports.js
import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { BarChart3, FileText, Eye, XCircle, CheckCircle } from 'lucide-react';

const Reports = ({
  user, reports = [], setCurrentView, setUser, currentView, isSidebarOpen, setIsSidebarOpen
}) => {
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    petName: '',
    ownerName: '',
    date: '',
    summary: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  const openModal = () => {
    setShowModal(true);
    setSuccess(false);
    setForm({ petName: '', ownerName: '', date: '', summary: '', diagnosis: '', prescription: '', notes: '' });
  };
  const closeModal = () => {
    setShowModal(false);
    setSuccess(false);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setShowModal(false);
      setSuccess(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar
        user={user}
        setCurrentView={setCurrentView}
        setUser={setUser}
        currentView={currentView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-1 ml-0 p-6 overflow-auto">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center"
            onClick={openModal}
          >
            <FileText className="w-5 h-5 mr-2" /> Write Report
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Pet</th>
                  <th className="py-2">Owner</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Summary</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">No reports found</td>
                  </tr>
                ) : (
                  reports.map((report, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2">{report.petName}</td>
                      <td className="py-2">{report.ownerName}</td>
                      <td className="py-2">{report.date}</td>
                      <td className="py-2">{report.summary}</td>
                      <td className="py-2">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center" onClick={() => setCurrentView('report-details')}> <Eye className="w-4 h-4 mr-1" /> View </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Write Report Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative min-h-[340px] border-2 border-blue-200">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={closeModal}
                title="Close"
              >
                <XCircle className="w-7 h-7" />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                Write Medical Report
              </h2>
              {success ? (
                <div className="flex flex-col items-center justify-center h-48">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                  <p className="text-lg font-semibold text-green-700">Report submitted successfully!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pet Name</label>
                      <input type="text" name="petName" value={form.petName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                      <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input type="date" name="date" value={form.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Summary</label>
                      <input type="text" name="summary" value={form.summary} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                    <input type="text" name="diagnosis" value={form.diagnosis} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prescription</label>
                    <input type="text" name="prescription" value={form.prescription} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 font-semibold text-base transition">Submit Report</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;