"use client";

import { useRouter } from "next/navigation";

const experiments = [
  { name: "Alpha Node Sensor", active: true, route: "alpha-node" },
  { name: "Thermal Camera", active: true, route: "thermal-camera" },
  { name: "Battery Test", active: false, route: "battery-test" },
  { name: "Smart Greenhouse", active: true, route: "smart-greenhouse" },
  { name: "ML Edge", active: false, route: "ml-edge" },
  { name: "Distance Measurement", active: true, route: "distance" },
];
import { useRouter } from "next/navigation";

const experiments = [
  { name: "Alpha Node Sensor", active: true, route: "alpha-node" },
  { name: "Thermal Camera", active: true, route: "thermal-camera" },
  { name: "Battery Test", active: false, route: "battery-test" },
  { name: "Smart Greenhouse", active: true, route: "smart-greenhouse" },
  { name: "ML Edge", active: false, route: "ml-edge" },
  { name: "Distance Measurement", active: true, route: "distance" },
];

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExperiments(data);
        } else if (data.data) {
          setExperiments(data.data);
          setIsAdmin(!!data.isAdmin);
        } else {
          setExperiments([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setExperiments([]);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (e: React.MouseEvent, uuid: string) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this experiment?")) return;
    
    try {
      const res = await fetch(`/api/experiments/${uuid}`, { method: "DELETE" });
      if (res.ok) {
        setExperiments(prev => prev.filter(exp => exp.uuid !== uuid));
      } else {
        alert("Failed to delete experiment");
      }
    } catch (err) {
      alert("Error deleting experiment");
    }
  };

  return (
    <div className="flex h-full">

      {/* 🔷 LEFT SIDEBAR */}
      <div className="w-1/4 bg-[#d6eaf8] border-r-4 border-orange-400 p-4 flex flex-col">

        <h2 className="text-xl font-semibold mb-4 text-[#154360]">
          Experiments
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2">

          {experiments.map((exp, index) => (
            <div
              key={index}
              onClick={() => router.push(`/experiments/${exp.route}`)}
              className="p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm bg-white hover:bg-blue-50"
            >
              <p className="font-medium text-[#2c3e50]">{exp.name}</p>

              <span
                className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                  exp.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {exp.active ? "Active" : "Inactive"}
              </span>
    <div className="flex h-full">

      {/* 🔷 LEFT SIDEBAR */}
      <div className="w-1/4 bg-[#d6eaf8] border-r-4 border-orange-400 p-4 flex flex-col">

        <h2 className="text-xl font-semibold mb-4 text-[#154360]">
          Experiments
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2">

          {experiments.map((exp, index) => (
            <div
              key={index}
              onClick={() => router.push(`/experiments/${exp.route}`)}
              className="p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm bg-white hover:bg-blue-50"
            >
              <p className="font-medium text-[#2c3e50]">{exp.name}</p>

              <span
                className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                  exp.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {exp.active ? "Active" : "Inactive"}
              </span>
            </div>
          ) : (
            experiments.map((exp, idx) => (
              <Link key={exp.uuid || idx} href={`/experiments/${exp.uuid}`} className="group h-full">
                <div className="h-full flex flex-col bg-white border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors relative">
                  
                  {/* Top Color Bar */}
                  <div className="w-full h-1 bg-[#003366]"></div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2 py-1 bg-slate-100 border border-slate-200 text-[#003366] font-bold font-mono text-xs uppercase tracking-widest">
                        ID: {exp.uuid ? exp.uuid.substring(0, 4) : "NEW"}
                      </div>
                      
                      {isAdmin && (
                        <button 
                          onClick={(e) => handleDelete(e, exp.uuid)} 
                          className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold uppercase rounded border border-red-200 transition-colors z-10 relative"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:underline underline-offset-2 line-clamp-2">
                      {exp.name}
                    </h3>

                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                        Created By: <span className="text-[#003366]">{exp.created_by_name || "System"}</span>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {exp.description || "No official description recorded."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between text-[#003366] text-sm font-bold uppercase tracking-wide">
                      <span>Access Details</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}