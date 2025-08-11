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

const KIGALI_PROVINCE = "Kigali City";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    idNumber: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    isibo: "",
    isiboLeader: "",
    rpfMember: false,
    houseNumber: "",
    education: "",
    housingStatus: "rent",
  });

  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [sectorOptions, setSectorOptions] = useState<string[]>([]);
  const [cellOptions, setCellOptions] = useState<string[]>([]);
  const [villageOptions, setVillageOptions] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [idError, setIdError] = useState("");

  useEffect(() => {
    console.log("Component mounted, fetching districts...");
    fetchDistricts().then((data) => {
      console.log("Districts data received:", data);
      const names = data.map((d: any) => d.name);
      console.log("District names:", names);
      setDistrictOptions(names);
    }).catch((error) => {
      console.error("Error fetching districts:", error);
    });
  }, []);

  useEffect(() => {
    if (form.district) {
      fetchSectors(form.district).then((data) => {
        setSectorOptions(data.map((s: any) => s.name));
      });
    } else {
      setSectorOptions([]);
    }
  }, [form.district]);

  useEffect(() => {
    if (form.sector) {
      fetchCells(form.sector).then((data) => {
        setCellOptions(data.map((c: any) => c.name));
      });
    } else {
      setCellOptions([]);
    }
  }, [form.sector]);

  useEffect(() => {
    if (form.cell) {
      fetchVillages(form.cell).then((data) => {
        setVillageOptions(data.map((v: any) => v.name));
      });
    } else {
      setVillageOptions([]);
    }
  }, [form.cell]);

  const validateIdNumber = (id: string) => {
    console.log("Validating ID:", id);
    if (id.length > 16) {
      console.log("ID too long");
      setIdError("ID number cannot exceed 16 digits");
      return false;
    }
    if (id.length > 0 && !id.startsWith('1') && !id.startsWith('2')) {
      console.log("ID doesn't start with 1 or 2");
      setIdError("ID number must start with 1 or 2");
      return false;
    }
    if (id.length > 0 && !/^\d+$/.test(id)) {
      console.log("ID contains non-digits");
      setIdError("ID number must contain only digits");
      return false;
    }
    console.log("ID validation passed");
    setIdError("");
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;

    if (name === "idNumber") {
      validateIdNumber(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateIdNumber(form.idNumber)) return;

    setLoading(true);
    setError("");

    // Fire-and-forget save to Firebase to avoid blocking navigation
    addDoc(collection(db, "registeredPeople"), form)
      .then((docRef) => {
        console.log("Document written with ID:", docRef.id);
      })
      .catch((err: any) => {
        console.error("Error during submission:", err);
      });

    // Navigate immediately to success page
    navigate('/registration-success');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-800">
        📝 People Registration
      </h2>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-green-500">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        

        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name (Amazina ye yose)
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ID Number
            </label>
            <input
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
              placeholder="Enter ID number (max 16 digits)"
              maxLength={16}
              className={`w-full border p-2 rounded focus:outline-none text-sm ${
                idError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              District (Akarere)
            </label>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
              required
            >
              <option value="">Select District</option>
              {districtOptions.map((district, idx) => (
                <option key={idx} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Sector (Umurenge)
            </label>
            <select
              name="sector"
              value={form.sector}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
              required
              disabled={!form.district}
            >
              <option value="">Select Sector</option>
              {sectorOptions.map((sector, idx) => (
                <option key={idx} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cell (Akagari)
            </label>
            <select
              name="cell"
              value={form.cell}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
              required
              disabled={!form.sector}
            >
              <option value="">Select Cell</option>
              {cellOptions.map((cell, idx) => (
                <option key={idx} value={cell}>{cell}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Village (Umudugudu)
            </label>
            <select
              name="village"
              value={form.village}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
              required
              disabled={!form.cell}
            >
              <option value="">Select Village</option>
              {villageOptions.map((village, idx) => (
                <option key={idx} value={village}>{village}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Isibo
            </label>
            <input
              name="isibo"
              value={form.isibo}
              onChange={handleChange}
              placeholder="Enter Isibo"
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Isibo Leader (Umuyobozi w'Isibo)
            </label>
            <input
              name="isiboLeader"
              value={form.isiboLeader}
              onChange={handleChange}
              placeholder="Enter Isibo Leader name"
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              House Number (Number y'Urugo)
            </label>
            <input
              name="houseNumber"
              value={form.houseNumber}
              onChange={handleChange}
              placeholder="Enter house number"
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Education Level (Amashuri wize)
            </label>
            <input
              name="education"
              value={form.education}
              onChange={handleChange}
              placeholder="Enter education level"
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Housing Status (Urakodesha/Inzu yawe)
            </label>
            <select
              name="housingStatus"
              value={form.housingStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="rent">Rent</option>
              <option value="own">Own</option>
            </select>
          </div>
        </div>

        {/* RPF Membership */}
        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded border border-yellow-200">
          <input
            type="checkbox"
            name="rpfMember"
            checked={form.rpfMember as boolean}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-xs font-semibold text-gray-700">
            Umunyamuryango wa RPF (RPF Member)
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors duration-200 shadow"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
