import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function RegisteredListPage() {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      setError("");
      try {
        const querySnapshot = await getDocs(collection(db, 'registeredPeople'));
        const list: any[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPeople(list);
      } catch (err: any) {
        setError('Failed to fetch registered people.');
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return people;
    const match = (v: any) => String(v ?? '').toLowerCase().includes(q);
    return people.filter((p) =>
      match(p.fullName) || match(p.phone) || match(p.email) || match(p.idNumber) ||
      match(p.district) || match(p.sector) || match(p.cell) || match(p.village) ||
      match(p.isibo) || match(p.isiboLeader) || match(p.houseNumber) ||
      match(p.education) || match(p.housingStatus)
    );
  }, [people, search]);

  const exportCsv = () => {
    const headers = [
      'Full Name','Phone','Email','ID Number','District','Sector','Cell','Village','Isibo','Isibo Leader','RPF Member','House Number','Education','Housing Status'
    ];
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filtered.map((p: any) => [
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
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">List of Registered People</h1>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, ID, location, etc."
            className="w-full md:w-72 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
          />
          <button onClick={exportCsv} className="bg-gray-700 hover:bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">Export CSV</button>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!loading && !error && filtered.length === 0 && <div>No people found.</div>}
      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-2 py-1">Full Name</th>
                <th className="border px-2 py-1">Phone</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">ID Number</th>
                <th className="border px-2 py-1">District</th>
                <th className="border px-2 py-1">Sector</th>
                <th className="border px-2 py-1">Cell</th>
                <th className="border px-2 py-1">Village</th>
                <th className="border px-2 py-1">Isibo</th>
                <th className="border px-2 py-1">Isibo Leader</th>
                <th className="border px-2 py-1">RPF Member</th>
                <th className="border px-2 py-1">House Number</th>
                <th className="border px-2 py-1">Education</th>
                <th className="border px-2 py-1">Housing Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((person) => (
                <tr key={person.id}>
                  <td className="border px-2 py-1">{person.fullName}</td>
                  <td className="border px-2 py-1">{person.phone}</td>
                  <td className="border px-2 py-1">{person.email}</td>
                  <td className="border px-2 py-1">{person.idNumber}</td>
                  <td className="border px-2 py-1">{person.district}</td>
                  <td className="border px-2 py-1">{person.sector}</td>
                  <td className="border px-2 py-1">{person.cell}</td>
                  <td className="border px-2 py-1">{person.village}</td>
                  <td className="border px-2 py-1">{person.isibo}</td>
                  <td className="border px-2 py-1">{person.isiboLeader}</td>
                  <td className="border px-2 py-1">{person.rpfMember ? 'Yes' : 'No'}</td>
                  <td className="border px-2 py-1">{person.houseNumber}</td>
                  <td className="border px-2 py-1">{person.education}</td>
                  <td className="border px-2 py-1">{person.housingStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}