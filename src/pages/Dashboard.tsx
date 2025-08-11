import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

type RegisteredPerson = {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  isibo: string;
  isiboLeader: string;
  rpfMember: boolean;
  houseNumber: string;
  education: string;
  housingStatus: string;
};

export default function Dashboard() {
  const [people, setPeople] = useState<RegisteredPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      setError("");
      try {
        const snapshot = await getDocs(collection(db, 'registeredPeople'));
        const list: RegisteredPerson[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as RegisteredPerson),
        }));
        setPeople(list);
      } catch (err: any) {
        setError('Failed to load registered people');
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return people;
    const matches = (val?: any) => String(val ?? '').toLowerCase().includes(q);
    return people.filter((p) =>
      matches(p.fullName) ||
      matches(p.phone) ||
      matches(p.email) ||
      matches(p.idNumber) ||
      matches(p.district) ||
      matches(p.sector) ||
      matches(p.cell) ||
      matches(p.village) ||
      matches(p.isibo) ||
      matches(p.isiboLeader) ||
      matches(p.houseNumber) ||
      matches(p.education) ||
      matches(p.housingStatus)
    );
  }, [people, search]);

  const exportCsv = () => {
    const headers = [
      'Full Name','Phone','Email','ID Number','District','Sector','Cell','Village','Isibo','Isibo Leader','RPF Member','House Number','Education','Housing Status'
    ];
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map(p => [
      p.fullName, p.phone, p.email, p.idNumber, p.district, p.sector, p.cell, p.village, p.isibo, p.isiboLeader, p.rpfMember ? 'Yes' : 'No', p.houseNumber, p.education, p.housingStatus
    ]);
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
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded text-xs">Register a New Person</Link>
          <Link to="/registered-list" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-2 rounded text-xs">Open Full List</Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <h2 className="text-base font-semibold">Registered People</h2>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, ID, location, etc."
              className="w-full md:w-64 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
            />
            <button onClick={exportCsv} className="bg-gray-700 hover:bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">Export CSV</button>
        </div>
        </div>

        {loading && <div className="py-6 text-center text-sm">Loading...</div>}
        {error && <div className="py-3 text-red-600 text-sm">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-2 py-2 text-left">Full Name</th>
                  <th className="border px-2 py-2 text-left">Phone</th>
                  <th className="border px-2 py-2 text-left">Email</th>
                  <th className="border px-2 py-2 text-left">ID Number</th>
                  <th className="border px-2 py-2 text-left">District</th>
                  <th className="border px-2 py-2 text-left">Sector</th>
                  <th className="border px-2 py-2 text-left">Cell</th>
                  <th className="border px-2 py-2 text-left">Village</th>
                  <th className="border px-2 py-2 text-left">Isibo</th>
                  <th className="border px-2 py-2 text-left">Isibo Leader</th>
                  <th className="border px-2 py-2 text-left">RPF</th>
                  <th className="border px-2 py-2 text-left">House No.</th>
                  <th className="border px-2 py-2 text-left">Education</th>
                  <th className="border px-2 py-2 text-left">Housing</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={14}>No matching records</td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-2 py-2">{p.fullName}</td>
                    <td className="border px-2 py-2">{p.phone}</td>
                    <td className="border px-2 py-2">{p.email}</td>
                    <td className="border px-2 py-2">{p.idNumber}</td>
                    <td className="border px-2 py-2">{p.district}</td>
                    <td className="border px-2 py-2">{p.sector}</td>
                    <td className="border px-2 py-2">{p.cell}</td>
                    <td className="border px-2 py-2">{p.village}</td>
                    <td className="border px-2 py-2">{p.isibo}</td>
                    <td className="border px-2 py-2">{p.isiboLeader}</td>
                    <td className="border px-2 py-2">{p.rpfMember ? 'Yes' : 'No'}</td>
                    <td className="border px-2 py-2">{p.houseNumber}</td>
                    <td className="border px-2 py-2">{p.education}</td>
                    <td className="border px-2 py-2">{p.housingStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}