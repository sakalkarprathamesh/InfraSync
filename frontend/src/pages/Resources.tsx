import React, { useState, useEffect } from 'react';
import {
  Boxes,
  PlusCircle,
  Building2,
  Calendar,
  Phone,
  HardHat,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/client';
import { SharedResource, Department } from '../types';
import { useAuth } from '../context/AuthContext';

export const Resources: React.FC = () => {
  const { user, isDepartmentUser } = useAuth();
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter
  const [selectedType, setSelectedType] = useState('All');

  // Add Resource Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState('Machinery');
  const [quantity, setQuantity] = useState('1 Unit');
  const [contactPerson, setContactPerson] = useState(user?.name || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedType !== 'All') params.resource_type = selectedType;
      const data = await api.getResources(params);
      setResources(data);
    } catch (err) {
      console.error('Failed to load shared resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadMeta() {
      try {
        const depts = await api.getDepartments();
        setDepartments(depts);
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    }
    loadMeta();
    fetchResources();
  }, [selectedType]);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createResource({
        department_id: user?.department_id || 1,
        resource_name: resourceName,
        resource_type: resourceType,
        quantity,
        availability_window_start: startDate,
        availability_window_end: endDate,
        contact_person: contactPerson,
        notes,
      });
      setShowAddModal(false);
      setResourceName('');
      setNotes('');
      await fetchResources();
    } catch (err: any) {
      alert(`Error creating shared resource: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Shared Inter-Agency Resources
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded uppercase">
              Resource Consolidation
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Voluntarily pooled machinery, sludge pumps, radar locators, and asphalt crews for shared trenching operations.
          </p>
        </div>

        {isDepartmentUser && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Pool Equipment / Crew
          </button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center space-x-3">
          <label className="font-semibold text-slate-600">Resource Category:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
          >
            <option value="All">All Categories</option>
            <option value="Machinery">Machinery & Excavators</option>
            <option value="Technical Personnel">Technical Personnel & Utility Radar</option>
            <option value="Restoration Team">Restoration & Asphalt Teams</option>
            <option value="Inspection Support">Inspection Support</option>
            <option value="Work Crew">Work Crew</option>
          </select>
        </div>
        <span className="text-slate-500">
          Showing <strong>{resources.length}</strong> available resources
        </span>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Boxes className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Resources Registered</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <div
              key={r.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                    {r.resource_type}
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-600">
                    {r.quantity}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {r.resource_name}
                </h3>

                <p className="text-xs text-slate-600 flex items-center space-x-1.5 font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: r.department_color || '#2563EB' }}
                  />
                  <span>{r.department_name}</span>
                </p>

                {r.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 leading-relaxed">
                    {r.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] space-y-1 text-slate-500">
                <div className="flex items-center justify-between font-mono">
                  <span>Available:</span>
                  <span>{r.availability_window_start} to {r.availability_window_end}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contact:</span>
                  <span className="font-semibold text-slate-800">{r.contact_person}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Register Shared Equipment or Crew</h3>
            <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Penetrating Radar (GPR) Utility Locator"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Machinery">Machinery</option>
                    <option value="Technical Personnel">Technical Personnel</option>
                    <option value="Restoration Team">Restoration Team</option>
                    <option value="Work Crew">Work Crew</option>
                    <option value="Inspection Support">Inspection Support</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Unit / 4 Persons"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available From</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Till</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Site Contact Person</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Technical Specs & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes on operator availability, fuel, or compatibility..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {submitting ? 'Registering...' : 'Register Shared Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
