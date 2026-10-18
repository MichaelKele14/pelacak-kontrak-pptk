import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Calendar, 
  Coins, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const POSISI_OPTIONS = [
  { value: 'Draft / PPTK', label: 'Draft / PPTK', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'Review Pejabat Pengadaan', label: 'Review Pejabat Pengadaan', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'Penandatanganan PPK', label: 'Penandatanganan PPK', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { value: 'Verifikasi Bendahara', label: 'Verifikasi Bendahara', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'Penerbitan SPM / SP2D', label: 'Penerbitan SPM / SP2D', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { value: 'Selesai / Diarsipkan', label: 'Selesai / Diarsipkan', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
];

export default function App() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentId, setCurrentId] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nomor_kontrak: '',
    judul_kontrak: '',
    rekanan: '',
    nilai_kontrak: '',
    posisi_berkas: 'Draft / PPTK',
    tanggal_kontrak: new Date().toISOString().split('T')[0],
    keterangan: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Contracts
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daftar_kontrak')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      showToast('Gagal mengambil data dari Supabase: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Handle Form Submit (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nomor_kontrak || !formData.judul_kontrak) {
      showToast('Nomor dan Judul Kontrak wajib diisi', 'error');
      return;
    }

    const payload = {
      ...formData,
      nilai_kontrak: Number(formData.nilai_kontrak) || 0,
      updated_at: new Date().toISOString()
    };

    try {
      if (modalMode === 'create') {
        const { error } = await supabase.from('daftar_kontrak').insert([payload]);
        if (error) throw error;
        showToast('Kontrak baru berhasil disimpan ke Supabase!');
      } else {
        const { error } = await supabase.from('daftar_kontrak').update(payload).eq('id', currentId);
        if (error) throw error;
        showToast('Data kontrak berhasil diperbarui!');
      }

      setIsModalOpen(false);
      resetForm();
      fetchContracts();
    } catch (err) {
      console.error('Error saving contract:', err);
      showToast('Gagal menyimpan: ' + err.message, 'error');
    }
  };

  // Quick Status Update
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('daftar_kontrak')
        .update({ posisi_berkas: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setContracts(contracts.map(c => c.id === id ? { ...c, posisi_berkas: newStatus } : c));
      showToast(`Posisi berkas diubah ke: ${newStatus}`);
    } catch (err) {
      showToast('Gagal memperbarui status: ' + err.message, 'error');
    }
  };

  // Handle Delete
  const handleDelete = async (id, nomor) => {
    if (!window.confirm(`Yakin ingin menghapus kontrak nomor ${nomor}?`)) return;

    try {
      const { error } = await supabase.from('daftar_kontrak').delete().eq('id', id);
      if (error) throw error;
      setContracts(contracts.filter(c => c.id !== id));
      showToast('Kontrak berhasil dihapus dari Supabase');
    } catch (err) {
      showToast('Gagal menghapus: ' + err.message, 'error');
    }
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setCurrentId(item.id);
    setFormData({
      nomor_kontrak: item.nomor_kontrak,
      judul_kontrak: item.judul_kontrak,
      rekanan: item.rekanan || '',
      nilai_kontrak: item.nilai_kontrak || '',
      posisi_berkas: item.posisi_berkas || 'Draft / PPTK',
      tanggal_kontrak: item.tanggal_kontrak || new Date().toISOString().split('T')[0],
      keterangan: item.keterangan || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nomor_kontrak: '',
      judul_kontrak: '',
      rekanan: '',
      nilai_kontrak: '',
      posisi_berkas: 'Draft / PPTK',
      tanggal_kontrak: new Date().toISOString().split('T')[0],
      keterangan: ''
    });
    setCurrentId(null);
  };

  // Filtered Contracts
  const filteredContracts = contracts.filter(c => {
    const matchSearch = 
      c.nomor_kontrak?.toLowerCase().includes(search.toLowerCase()) ||
      c.judul_kontrak?.toLowerCase().includes(search.toLowerCase()) ||
      c.rekanan?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.posisi_berkas === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary Metrics
  const totalNilai = contracts.reduce((acc, curr) => acc + (Number(curr.nilai_kontrak) || 0), 0);
  const berkasSelesai = contracts.filter(c => c.posisi_berkas === 'Selesai / Diarsipkan').length;
  const berkasDraft = contracts.filter(c => c.posisi_berkas === 'Draft / PPTK').length;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const getStatusBadge = (posisi) => {
    const option = POSISI_OPTIONS.find(o => o.value === posisi) || POSISI_OPTIONS[0];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${option.color}`}>
        {option.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pelacak Kontrak PPTK</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Terhubung Langsung: Supabase Database (<code className="bg-slate-100 px-1 rounded text-slate-700">kilat-desa</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchContracts}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <button
              onClick={() => {
                resetForm();
                setModalMode('create');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kontrak</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-sm font-medium">Total Kontrak</span>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{contracts.length}</div>
            <p className="text-xs text-slate-400 mt-1">Seluruh berkas terdaftar</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-sm font-medium">Draft di PPTK</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{berkasDraft}</div>
            <p className="text-xs text-slate-400 mt-1">Perlu review & tindak lanjut</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-sm font-medium">Berkas Selesai</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">{berkasSelesai}</div>
            <p className="text-xs text-slate-400 mt-1">Diarsipkan & terbit SP2D</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-sm font-medium">Total Nilai Pagu</span>
              <Coins className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-lg font-bold text-slate-900 truncate" title={formatRupiah(totalNilai)}>
              {formatRupiah(totalNilai)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Akumulasi nilai kontrak</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor, judul, atau rekanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium shrink-0">Filter Posisi:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">Semua Posisi Berkas ({contracts.length})</option>
              {POSISI_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({contracts.filter(c => c.posisi_berkas === opt.value).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contracts Table & List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
              <p className="text-sm">Memuat data dari Supabase...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-base font-medium text-slate-600">Tidak ada kontrak yang ditemukan</p>
              <p className="text-xs mt-1">Coba ubah kata kunci pencarian atau tambah kontrak baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Nomor & Tanggal</th>
                    <th className="py-3.5 px-4">Judul Kontrak & Rekanan</th>
                    <th className="py-3.5 px-4">Nilai Kontrak</th>
                    <th className="py-3.5 px-4">Posisi Berkas Saat Ini</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredContracts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-slate-900 font-mono text-xs">{item.nomor_kontrak}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.tanggal_kontrak || '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top max-w-md">
                        <div className="font-medium text-slate-900">{item.judul_kontrak}</div>
                        {item.rekanan && (
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.rekanan}</span>
                          </div>
                        )}
                        {item.keterangan && (
                          <div className="text-xs text-slate-400 italic mt-1 line-clamp-1">
                            Ket: {item.keterangan}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="font-semibold text-slate-900 font-mono text-sm">
                          {formatRupiah(item.nilai_kontrak || 0)}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1.5">
                          {getStatusBadge(item.posisi_berkas)}
                          {/* Quick Change Dropdown */}
                          <div className="flex items-center gap-1">
                            <select
                              value={item.posisi_berkas}
                              onChange={(e) => handleQuickStatusChange(item.id, e.target.value)}
                              className="text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-1.5 py-0.5 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {POSISI_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Kontrak"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.nomor_kontrak)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Kontrak"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>{modalMode === 'create' ? 'Tambah Kontrak Kerja Baru' : 'Edit Kontrak Kerja'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nomor Kontrak / SPK *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 027/SPK/DISPORA/2026"
                  value={formData.nomor_kontrak}
                  onChange={(e) => setFormData({ ...formData, nomor_kontrak: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul / Nama Paket Pekerjaan *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Pengadaan Alat Tulis Kantor dan Peralatan Cetak"
                  value={formData.judul_kontrak}
                  onChange={(e) => setFormData({ ...formData, judul_kontrak: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nama Rekanan / Vendor</label>
                  <input
                    type="text"
                    placeholder="Contoh: CV. Maju Bersama"
                    value={formData.rekanan}
                    onChange={(e) => setFormData({ ...formData, rekanan: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nilai Kontrak (Rp)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.nilai_kontrak}
                    onChange={(e) => setFormData({ ...formData, nilai_kontrak: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Posisi Berkas Saat Ini</label>
                  <select
                    value={formData.posisi_berkas}
                    onChange={(e) => setFormData({ ...formData, posisi_berkas: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    {POSISI_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tanggal Kontrak</label>
                  <input
                    type="date"
                    value={formData.tanggal_kontrak}
                    onChange={(e) => setFormData({ ...formData, tanggal_kontrak: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Catatan / Keterangan Berkas</label>
                <input
                  type="text"
                  placeholder="Catatan kendala, kelengkapan berkas, dsb..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all"
                >
                  {modalMode === 'create' ? 'Simpan Kontrak' : 'Perbarui Kontrak'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
