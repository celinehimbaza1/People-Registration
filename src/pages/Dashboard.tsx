import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

// Define the type for our data
type RegisteredPerson = {
  id?: string;
  fullName: string; phone: string; email: string; idNumber: string;
  district: string; sector: string; cell: string; village: string;
  isibo: string; isiboLeader: string; rpfMember: boolean; houseNumber: string;
  education: string; housingStatus: string;
};

const PAGE_SIZE = 25;

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [people, setPeople] = useState<RegisteredPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // --- FULLY IMPLEMENTED LOGIC ---

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const fetchInitialPeople = async () => {
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, 'registeredPeople'), orderBy('fullName'), limit(PAGE_SIZE));
      const snapshot = await getDocs(q);
      const list: RegisteredPerson[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as RegisteredPerson),
      }));
      setPeople(list);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err: any) {
      console.error("Firestore read failed:", err);
      setError('Failed to load registered people. Check Firestore rules and internet connection.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMorePeople = async () => {
    if (!lastDoc || !hasMore) return;
    setLoadingMore(true);
    try {
      const q = query(collection(db, 'registeredPeople'), orderBy('fullName'), startAfter(lastDoc), limit(PAGE_SIZE));
      const snapshot = await getDocs(q);
      const newPeople: RegisteredPerson[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as RegisteredPerson)
      }));
      setPeople(prev => [...prev, ...newPeople]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      setError('Failed to load more people.');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchInitialPeople();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return people;
    const matches = (val?: any) => String(val ?? '').toLowerCase().includes(q);
    return people.filter((p) =>
      matches(p.fullName) || matches(p.phone) || matches(p.email) ||
      matches(p.idNumber) || matches(p.district) || matches(p.sector) ||
      matches(p.cell) || matches(p.village) || matches(p.isibo)
    );
  }, [people, search]);

  const exportCsv = () => {
    const headers = ['Full Name','Phone','Email','ID Number','District','Sector','Cell','Village','Isibo','Isibo Leader','RPF Member','House Number','Education','Housing Status'];
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map(p => [ p.fullName, p.phone, p.email, p.idNumber, p.district, p.sector, p.cell, p.village, p.isibo, p.isiboLeader, p.rpfMember ? 'Yes' : 'No', p.houseNumber, p.education, p.housingStatus ]);
    const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registered_people_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ===== HEADER / TOP NAVIGATION BAR ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-3">
            <Link 
              to="/register" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
              Register New Person
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 003 21m12-1a6 6 0 00-9 5.197" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Loaded Records</p>
              <p className="text-3xl font-bold text-slate-800">{people.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-semibold text-slate-800">All Registered People</h2>
              <div className="flex items-center gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search records..."
                  className="w-full sm:w-64 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={exportCsv} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg shadow-sm">Export CSV</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500">Loading data...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">Full Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">ID Number</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">District</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">Sector</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">Cell</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">Village</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">RPF Member</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-slate-500" colSpan={8}>
                        {search ? 'No matching records found.' : 'No people registered yet.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-blue-50">
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">{p.fullName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{p.phone}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{p.idNumber}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{p.district}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{p.sector}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{p.cell}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{p.village}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {p.rpfMember ? (
                            <span className="bg-green-100 text-green-800 font-semibold text-xs px-2 py-1 rounded-full">Yes</span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2 py-1 rounded-full">No</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="px-6 py-4 border-t border-slate-200 text-center">
            {hasMore ? (
              <button 
                onClick={fetchMorePeople} 
                disabled={loadingMore}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-semibold py-2 px-4 rounded-lg disabled:opacity-70"
              >
                {loadingMore ? 'Loading...' : 'Load More Records'}
              </button>
            ) : (
              people.length > 0 && <p className="text-sm text-slate-500">All records have been loaded.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}