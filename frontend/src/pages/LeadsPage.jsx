import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  useGetLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useAssignLeadMutation,
  useUpdateLeadStatusMutation,
} from '../features/api/leadsApi';
import { useGetTeamMembersQuery } from '../features/api/usersApi';
import { selectIsAdmin } from '../features/auth/authSlice';
import { getApiErrorMessage } from '../utils/apiError';
import StatusBadge from '../components/StatusBadge';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';

const STATUSES = ['new', 'contacted', 'qualified', 'closed'];
const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  status: 'new',
  assignedTo: '',
};

export default function LeadsPage() {
  const isAdmin = useSelector(selectIsAdmin);
  const { data: leads = [], isLoading, isError } = useGetLeadsQuery();
  const { data: team = [] } = useGetTeamMembersQuery(undefined, { skip: !isAdmin });
  const [createLead, { isLoading: creating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: updating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const [assignLead] = useAssignLeadMutation();
  const [updateLeadStatus] = useUpdateLeadStatusMutation();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (lead) => {
    setEditingId(lead._id);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      notes: lead.notes || '',
      status: lead.status,
      assignedTo: lead.assignedTo?._id || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      notes: form.notes,
      status: form.status,
      ...(form.assignedTo ? { assignedTo: form.assignedTo } : {}),
      ...(!form.assignedTo && editingId ? { assignedTo: null } : {}),
    };

    const promise = editingId
      ? updateLead({ id: editingId, ...payload }).unwrap()
      : createLead(payload).unwrap();

    toast.promise(promise, {
      loading: editingId ? 'Saving lead...' : 'Creating lead...',
      success: editingId ? 'Lead updated successfully' : 'Lead created successfully',
      error: (err) => getApiErrorMessage(err, 'Operation failed'),
    });

    try {
      await promise;
      resetForm();
    } catch {
      /* toast handles error */
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await toast.promise(deleteLead(deleteTarget.id).unwrap(), {
        loading: 'Deleting lead...',
        success: 'Lead deleted successfully',
        error: (err) => getApiErrorMessage(err, 'Delete failed'),
      });
      setDeleteTarget(null);
    } catch {
      /* toast handles error; keep dialog open */
    }
  };

  const handleQuickAssign = async (leadId, assignedTo, leadName) => {
    toast.promise(assignLead({ id: leadId, assignedTo: assignedTo || null }).unwrap(), {
      loading: 'Updating assignment...',
      success: assignedTo
        ? `Lead "${leadName}" assigned`
        : `Lead "${leadName}" unassigned`,
      error: (err) => getApiErrorMessage(err, 'Assign failed'),
    });
  };

  const handleStatusChange = async (leadId, status, leadName) => {
    toast.promise(updateLeadStatus({ id: leadId, status }).unwrap(), {
      loading: 'Updating status...',
      success: `"${leadName}" marked as ${status}`,
      error: (err) => getApiErrorMessage(err, 'Failed to update status'),
    });
  };

  const salesAgents = team.filter((u) => u.role === 'sales_agent' || u.role === 'admin');
  const colSpan = isAdmin ? 5 : 4;

  if (isError) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-4">Leads</h2>
        <p className="text-slate-400">Unable to load leads. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Leads</h2>
          {!isAdmin && (
            <p className="text-slate-500 text-sm mt-1">
              You can update the status of your assigned leads only
            </p>
          )}
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            + Add Lead
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="mb-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingId ? 'Edit Lead' : 'New Lead'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Unassigned</option>
              {salesAgents.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="md:col-span-2 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
            />
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={creating || updating}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl"
              >
                {editingId ? 'Save Changes' : 'Create Lead'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-white px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 overflow-x-auto">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-700/50 rounded-lg" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700/50">
                <th className="pb-4 font-semibold px-3">Lead</th>
                <th className="pb-4 font-semibold px-3">Status</th>
                <th className="pb-4 font-semibold px-3">Assigned</th>
                {isAdmin && <th className="pb-4 font-semibold px-3">Assign</th>}
                {isAdmin && <th className="pb-4 font-semibold px-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20"
                >
                  <td className="py-4 px-3">
                    <div className="font-medium text-white">{lead.name}</div>
                    <div className="text-sm text-slate-500">{lead.email}</div>
                    {lead.company && (
                      <div className="text-xs text-slate-600 mt-0.5">{lead.company}</div>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    {isAdmin ? (
                      <StatusBadge status={lead.status} />
                    ) : (
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead._id, e.target.value, lead.name)
                        }
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white capitalize focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-4 px-3 text-slate-300 text-sm">
                    {lead.assignedTo?.name || '—'}
                  </td>
                  {isAdmin && (
                    <td className="py-4 px-3">
                      <select
                        value={lead.assignedTo?._id || ''}
                        onChange={(e) =>
                          handleQuickAssign(lead._id, e.target.value || null, lead.name)
                        }
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white"
                      >
                        <option value="">Unassigned</option>
                        {salesAgents.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  {isAdmin && (
                    <td className="py-4 px-3 space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(lead)}
                        className="text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ id: lead._id, name: lead.name })}
                        className="text-red-400/80 hover:text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={colSpan} className="py-8 text-center text-slate-500">
                    {isAdmin
                      ? 'No leads yet. Add your first lead.'
                      : 'No leads assigned to you yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
