import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchDistricts,
  fetchSectors,
  fetchCells,
  fetchVillages,
} from "../services/locationService";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", idNumber: "",
    district: "", sector: "", cell: "", village: "",
    isibo: "", isiboLeader: "", rpfMember: false,
    houseNumber: "", education: "", housingStatus: "rent",
  });

  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [sectorOptions, setSectorOptions] = useState<string[]>([]);
  const [cellOptions, setCellOptions] = useState<string[]>([]);
  const [villageOptions, setVillageOptions] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [idError, setIdError] = useState("");

  useEffect(() => {
    fetchDistricts().then(data => setDistrictOptions(data || []));
  }, []);

  useEffect(() => {
    setSectorOptions([]); setCellOptions([]); setVillageOptions([]);
    if (form.district) {
      fetchSectors(form.district).then(data => setSectorOptions(data || []));
    }
    setForm(prev => ({ ...prev, sector: '', cell: '', village: '' }));
  }, [form.district]);

  useEffect(() => {
    setCellOptions([]); setVillageOptions([]);
    if (form.district && form.sector) {
      fetchCells(form.district, form.sector).then(data => setCellOptions(data || []));
    }
    setForm(prev => ({ ...prev, cell: '', village: '' }));
  }, [form.district, form.sector]);

  useEffect(() => {
    setVillageOptions([]);
    if (form.district && form.sector && form.cell) {
      fetchVillages(form.district, form.sector, form.cell).then(data => setVillageOptions(data || []));
    }
    setForm(prev => ({ ...prev, village: '' }));
  }, [form.district, form.sector, form.cell]);

  const validateIdNumber = (id: string) => {
    if (id.length > 16) { setIdError("ID number cannot exceed 16 digits"); return false; }
    if (id.length > 0 && !id.startsWith('1') && !id.startsWith('2')) { setIdError("ID number must start with 1 or 2"); return false; }
    if (id.length > 0 && !/^\d+$/.test(id)) { setIdError("ID number must contain only digits"); return false; }
    setIdError(""); return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;
    if (name === "idNumber") { validateIdNumber(value); }
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // --- THIS IS THE MODIFIED FUNCTION ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateIdNumber(form.idNumber)) return;

    // We don't need to set loading or error states anymore because we navigate away instantly.

    // "Fire-and-forget": Start the database save but DON'T wait for it.
    // This happens in the background. We add a .catch to log any errors.
    addDoc(collection(db, "registeredPeople"), form)
      .then(() => {
        console.log("✅ Data submission to Firebase started in the background.");
      })
      .catch((err) => {
        // This error will only be visible in the developer console.
        // The user will already be on the success page.
        console.error("🔴 Background Firebase submission failed:", err);
      });

    // Navigate IMMEDIATELY to the success page.
    navigate('/registration-success');
  };
  
  // --- YOUR JSX REMAINS UNCHANGED ---
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-800">
        📝 People Registration
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-lg border border-green-500">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-center text-sm text-red-800">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name (Amazina ye yose)</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter full name" className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email address" className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ID Number</label>
              <input name="idNumber" value={form.idNumber} onChange={handleChange} placeholder="Enter ID number (max 16 digits)" maxLength={16} className={`w-full border p-2 rounded focus:outline-none text-sm ${idError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} />
              {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">District (Akarere)</label>
              <select name="district" value={form.district} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" required>
                <option value="">Select District</option>
                {districtOptions.map((district, idx) => (<option key={idx} value={district}>{district}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sector (Umurenge)</label>
              <select name="sector" value={form.sector} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" required disabled={!form.district}>
                <option value="">Select Sector</option>
                {sectorOptions.map((sector, idx) => (<option key={idx} value={sector}>{sector}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cell (Akagari)</label>
              <select name="cell" value={form.cell} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" required disabled={!form.sector}>
                <option value="">Select Cell</option>
                {cellOptions.map((cell, idx) => (<option key={idx} value={cell}>{cell}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Village (Umudugudu)</label>
              <select name="village" value={form.village} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" required disabled={!form.cell}>
                <option value="">Select Village</option>
                {villageOptions.map((village, idx) => (<option key={idx} value={village}>{village}</option>))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-700 mb-1">Isibo</label><input name="isibo" value={form.isibo} onChange={handleChange} placeholder="Enter Isibo" className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-2">Isibo Leader (Umuyobozi w'Isibo)</label><input name="isiboLeader" value={form.isiboLeader} onChange={handleChange} placeholder="Enter Isibo Leader name" className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1">House Number (Number y'Urugo)</label><input name="houseNumber" value={form.houseNumber} onChange={handleChange} placeholder="Enter house number" className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1">Education Level (Amashuri wize)</label><input name="education" value={form.education} onChange={handleChange} placeholder="Enter education level" className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" /></div>
            <div><label className="block text-xs font-semibold text-gray-700 mb-1">Housing Status (Urakodesha/Inzu yawe)</label><select name="housingStatus" value={form.housingStatus} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm" ><option value="rent">Rent</option><option value="own">Own</option></select></div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded border border-yellow-200"><input type="checkbox" name="rpfMember" checked={form.rpfMember as boolean} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label className="text-xs font-semibold text-gray-700">Umunyamuryango wa RPF (RPF Member)</label></div>
          <div className="text-center"><button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors duration-200 shadow" disabled={loading}>{loading ? "Submitting..." : "Submit Registration"}</button></div>
        </form>
      </div>
    </div>
  );
}