"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateExperiment() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [components, setComponents] = useState("");
  const [dataValues, setDataValues] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, components, dataValues, isPrivate }),
      });
const data = await res.json();
console.log("API RESPONSE:", data);

      if (data.success) {
        router.push("/experiments");
      }
    } catch (error) {
      console.error("Error creating experiment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-8 text-slate-900">
      
      <div className="mb-6 border-b-2 border-slate-300 pb-4">
        <Link href="/experiments" className="inline-flex items-center text-sm font-bold text-[#003366] hover:underline mb-4 uppercase tracking-wider">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Directory
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#003366] tracking-tight">
          Register New Experiment
        </h1>
        <p className="text-slate-700 mt-2 text-lg font-medium">
          Complete the form below to register a new laboratory setup for monitoring. Fields marked with <span className="text-red-700 font-bold">*</span> are required.
        </p>
      </div>

      <div className="bg-white border text-left border-slate-300 shadow-sm relative w-full">
        <div className="h-2 w-full bg-[#003366]"></div>
        
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
          
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-bold text-slate-900">
              Experiment Name <span className="text-red-700">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Temperature Analysis Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full px-4 py-3 border border-slate-400 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] rounded-xl shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-bold text-slate-900">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe the objective and parameters of this experiment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="block w-full px-4 py-3 border border-slate-400 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] rounded-xl shadow-sm resize-y"
            />
          </div>

          <div className="space-y-2">
             <label htmlFor="components" className="block text-sm font-bold text-slate-900">
              Hardware Components
            </label>
            <p className="text-xs text-slate-600 mb-2 font-medium">
              Optional: Comma-separated list of primary devices used in this setup.
            </p>
            <input
              id="components"
              type="text"
              placeholder="e.g. Raspberry Pi, DHT11 Sensor, ESP32"
              value={components}
              onChange={(e) => setComponents(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-400 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] rounded-xl shadow-sm"
            />
          </div>

          <div className="space-y-2">
             <label htmlFor="dataValues" className="block text-sm font-bold text-slate-900">
              Data Values (Metrics)
            </label>
            <p className="text-xs text-slate-600 mb-2 font-medium">
              Optional: Comma-separated list of metrics this experiment should receive via the websocket stream. Leave blank to receive all.
            </p>
            <input
              id="dataValues"
              type="text"
              placeholder="e.g. temperature, humidity, voc"
              value={dataValues}
              onChange={(e) => setDataValues(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-400 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] rounded-xl shadow-sm"
            />
          </div>

          <div className="space-y-2 flex items-center gap-3">
             <input
              id="isPrivate"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-5 h-5 text-[#003366] rounded-xl focus:ring-[#003366] border-slate-400"
            />
            <label htmlFor="isPrivate" className="block text-sm font-bold text-slate-900">
              Make this experiment private
            </label>
            <p className="text-xs text-slate-600 font-medium ml-2">
              (Only visible to you and administrators)
            </p>
          </div>

          <div className="pt-6 border-t border-slate-300 flex items-center justify-end gap-6 bg-slate-50 -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 px-8 sm:px-10 py-6 border-t-4 border-[#003366]">
             <Link 
              href="/experiments"
              className="px-6 py-3 font-semibold text-[#003366] hover:underline uppercase tracking-wide"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={`relative flex items-center justify-center gap-2 px-8 py-3 font-bold uppercase tracking-wide text-white border-2 transition-colors ${
                isSubmitting || !name.trim() 
                  ? "bg-slate-400 border-slate-400 cursor-not-allowed" 
                  : "bg-[#003366] border-[#003366] hover:bg-slate-900 shadow-sm"
              }`}
            >
              {isSubmitting ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Processing...
                 </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Submit Registration
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}