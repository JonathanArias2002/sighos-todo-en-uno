import React from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  Activity,
  Package,
  Settings,
  LayoutDashboard,
  FileText,
  ClipboardList,
  LogOut,
  Bell,
  Search,
  PlusCircle,
  Stethoscope,
  Clock,
  CalendarDays,
  ClipboardCheck,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  X,
  Lock,
  CreditCard,
  User,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  createAppointmentRate,
  fetchAppointmentRates,
  softDeleteAppointmentRate,
  updateAppointmentRate,
  type AppointmentRate,
  createExamRate,
  fetchExamRates,
  softDeleteExamRate,
  updateExamRate,
  type ExamRate,
  createProcedureRate,
  fetchProcedureRates,
  softDeleteProcedureRate,
  updateProcedureRate,
  type ProcedureRate,
  fetchSpecialties,
  createSpecialty,
  updateSpecialty,
  updateSpecialtyStatus,
  softDeleteSpecialty,
  type SpecialtyFull,
  type SpecialtyPayload,
  type Specialty,
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
  type Patient,
  type PatientPayload,
  fetchStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  type Staff,
  type StaffPayload,
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  type Appointment,
  updateProfile,
  updatePassword,
  updateClientProfile,
  updateClientPassword,
  fetchDashboardStats,
  type DashboardStats,
  fetchMedicalHistories,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
  type MedicalHistory,
  type MedicalHistoryPayload,
  fetchWorkSchedules,
  saveWorkSchedule,
  deleteWorkSchedule,
  type WorkSchedule,
  type WorkSchedulePayload,
} from '../services/api';

const KPICard = ({ title, value, icon: Icon, subValue, colorClass }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-dash-panel p-6 rounded-3xl border border-dash-border relative overflow-hidden group transition-all hover:border-dash-accent/50 shadow-xl"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full ${colorClass || 'bg-dash-accent'}`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-dash-text tracking-tighter">{value}</h3>
          {subValue && <span className="text-[10px] font-bold text-dash-text-dim uppercase font-mono">{subValue}</span>}
        </div>
      </div>
      <div className={`p-4 rounded-2xl bg-dash-glass border border-dash-border group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${colorClass === 'bg-dash-success' ? 'text-dash-success' : colorClass === 'bg-dash-danger' ? 'text-dash-danger' : 'text-dash-accent'}`} />
      </div>
    </div>
  </motion.div>
);

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, title = "¿Está seguro de realizar esta acción?" }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-dash-panel border border-dash-border w-full max-w-sm rounded-[2rem] shadow-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-dash-danger/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-dash-danger/20">
            <Trash2 className="text-dash-danger" size={32} />
          </div>
          <h3 className="text-sm font-bold text-dash-text uppercase tracking-widest mb-2">{title}</h3>
          <p className="text-[10px] text-dash-text-dim uppercase tracking-widest leading-relaxed mb-8">Esta acción es irreversible y afectará los registros actuales.</p>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 rounded-2xl border border-dash-border text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:bg-dash-glass hover:text-dash-text transition-all"
            >
              No, Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-dash-danger text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-dash-danger/20 hover:brightness-110 active:scale-95 transition-all"
            >
              Sí, Aceptar
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const IconButton = ({ icon: Icon, label, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center p-6 bg-dash-panel backdrop-blur-md rounded-2xl border border-dash-border hover:border-dash-accent hover:bg-dash-glass transition-all group shrink-0"
  >
    <div className="p-4 bg-dash-glass rounded-full border border-dash-border group-hover:border-dash-accent/30 transition-colors mb-3">
      <Icon className="w-6 h-6 text-dash-text-dim group-hover:text-dash-accent" />
    </div>
    <span className="text-xs font-bold text-dash-text-dim group-hover:text-dash-accent uppercase tracking-wider">{label}</span>
  </motion.button>
);

const StaffManagement = () => {
  const [staff, setStaff] = React.useState<Staff[]>([]);
  const [specialties, setSpecialties] = React.useState<SpecialtyFull[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [modalMode, setModalMode] = React.useState<'view' | 'edit' | 'add' | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const [formData, setFormData] = React.useState<any>({});

  const loadData = React.useCallback(async (term: string, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [staffData, specialtiesData] = await Promise.all([
        fetchStaff(term),
        fetchSpecialties()
      ]);
      setStaff(staffData);
      setSpecialties(specialtiesData);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo cargar la información.';
      setApiError(message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData(searchTerm, true);
  }, [searchTerm, loadData]);

  const handleOpenModal = (mode: 'view' | 'edit' | 'add', member: Staff | null = null) => {
    setModalMode(mode);
    setApiError('');
    if (mode === 'add') {
      setFormData({
        visualId: `ST-${String(staff.length + 1).padStart(3, '0')}`,
        dni: '',
        name: '',
        specialtyId: '',
        status: 'ACTIVO',
        phone: '',
        email: '',
        address: '',
        salary: '',
        userRole: 'EMPLEADO',
        password: ''
      });
    } else if (member) {
      setFormData({
        ...member,
        visualId: `ST-${String(member.id).padStart(3, '0')}`,
        salary: member.salary ? member.salary.toString() : '',
        specialtyId: member.specialtyId ? member.specialtyId.toString() : ''
      });
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (modalMode === 'view') return;
    if (!formData.dni?.trim() || !formData.name?.trim()) {
      setApiError('El DNI y Nombre Completo son obligatorios.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: StaffPayload = {
        dni: formData.dni,
        name: formData.name,
        specialtyId: formData.specialtyId ? Number(formData.specialtyId) : null,
        status: formData.status,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        salary: formData.salary ? Number(formData.salary.toString().replace(/[^0-9.]/g, '')) : 0,
        userRole: formData.userRole,
        password: formData.password,
      };

      if (modalMode === 'add') {
        await createStaff(payload);
      } else if (modalMode === 'edit' && formData.id) {
        await updateStaff(formData.id, payload);
      }

      await loadData(searchTerm, false);
      handleCloseModal();
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el trabajador.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      await deleteStaff(deleteId);
      await loadData(searchTerm, false);
      setDeleteId(null);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el trabajador.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStaff = staff;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Personal</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Directorio avanzado de trabajadores del hospital SIGHOS</p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="bg-dash-accent text-white px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2"
        >
          <UserPlus size={18} />
          Añadir Miembro
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
      </div>

      {apiError && (
        <div className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl">
          <AlertCircle size={16} className="text-dash-danger shrink-0" />
          <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{apiError}</p>
        </div>
      )}

      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dash-border bg-dash-glass/50">
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID Personal</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">DNI</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Nombre Completo</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Especialidad</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  Cargando trabajadores...
                </td>
              </tr>
            ) : filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-dash-glass transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent">ST-{String(member.id).padStart(3, '0')}</td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim">{member.dni}</td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-dash-text">{member.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim font-medium">{member.specialtyName || 'Ninguna'}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${member.status === 'ACTIVO'
                        ? 'border-dash-success/30 text-dash-success bg-dash-success/10'
                        : 'border-dash-danger/30 text-dash-danger bg-dash-danger/10'
                      }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('view', member)}
                        title="Ver Detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('edit', member)}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-2 bg-dash-danger/5 border border-dash-danger/20 rounded-lg text-dash-danger/60 hover:text-dash-danger hover:bg-dash-danger/20 hover:border-dash-danger transition-all"
                        onClick={() => handleDelete(member.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  No se encontraron trabajadores con ese DNI o nombre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dash-panel border border-dash-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dash-border flex justify-between items-center bg-dash-glass/30">
              <h3 className="text-sm font-bold text-dash-accent uppercase tracking-[0.2em]">
                {modalMode === 'view' ? 'Expediente del Trabajador' : modalMode === 'edit' ? 'Modificar Información' : 'Nuevo Registro de Personal'}
              </h3>
              <button onClick={handleCloseModal} className="text-dash-text-dim hover:text-dash-danger transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">ID Trabajador</label>
                <input
                  disabled
                  value={formData.visualId}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-mono outline-none opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">DNI</label>
                <input
                  name="dni"
                  disabled={modalMode === 'view'}
                  value={formData.dni}
                  onChange={handleInputChange}
                  placeholder="Número de DNI"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nombre Completo</label>
                <input
                  name="name"
                  disabled={modalMode === 'view'}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Especialidad</label>
                <select
                  name="specialtyId"
                  disabled={modalMode === 'view'}
                  value={formData.specialtyId}
                  onChange={handleInputChange}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                >
                  <option value="">Ninguna</option>
                  {specialties.filter(s => s.status === 'Activo' || s.id === Number(formData.specialtyId)).map((spec) => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Estado</label>
                <select
                  name="status"
                  disabled={modalMode === 'view'}
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Celular</label>
                <input
                  name="phone"
                  disabled={modalMode === 'view'}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9XXXXXXXX"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Correo Electrónico</label>
                <input
                  name="email"
                  disabled={modalMode === 'view'}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="usuario@sighos.com"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Dirección de Vivienda</label>
                <input
                  name="address"
                  disabled={modalMode === 'view'}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle, Número, Distrito"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Salario Mensual</label>
                <input
                  name="salary"
                  disabled={modalMode === 'view'}
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Ej. 4500.00"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Rol en Sistema</label>
                <select
                  name="userRole"
                  disabled={modalMode === 'view'}
                  value={formData.userRole}
                  onChange={handleInputChange}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                >
                  <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                  <option value="EMPLEADO">EMPLEADO</option>
                  <option value="RECEPCIONISTA">RECEPCIONISTA</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Contraseña</label>
                <input
                  name="password"
                  type={modalMode === 'view' ? 'password' : 'text'}
                  disabled={modalMode === 'view'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 8 caracteres"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-t border-dash-border bg-dash-glass/10 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-6 py-2 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
              >
                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-dash-accent text-white px-8 py-2 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Confirmar y Guardar'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const PatientManagement = ({ onViewHistory }: { onViewHistory: (dni: string) => void }) => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [modalMode, setModalMode] = React.useState<'view' | 'edit' | 'add' | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const [formData, setFormData] = React.useState<any>({});

  const loadPatients = React.useCallback(async (term: string, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await fetchPatients(term);
      setPatients(data);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los pacientes.';
      setApiError(message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadPatients(searchTerm, true);
  }, [searchTerm, loadPatients]);

  const handleOpenModal = (mode: 'view' | 'edit' | 'add', patient: Patient | null = null) => {
    setModalMode(mode);
    setApiError('');
    if (mode === 'add') {
      setFormData({
        visualId: `PA-${String(patients.length + 1).padStart(3, '0')}`,
        dni: '',
        name: '',
        gender: 'MASCULINO',
        birthDate: '',
        phone: '',
        email: '',
        address: '',
        emergencyContact1: '',
        emergencyContact2: '',
        password: ''
      });
    } else if (patient) {
      setFormData({
        ...patient,
        visualId: `PA-${String(patient.id).padStart(3, '0')}`
      });
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (modalMode === 'view') return;
    if (!formData.dni?.trim() || !formData.name?.trim()) {
      setApiError('El DNI y Nombre Completo son obligatorios.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: PatientPayload = {
        dni: formData.dni,
        name: formData.name,
        gender: formData.gender,
        birthDate: formData.birthDate,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergencyContact1: formData.emergencyContact1,
        emergencyContact2: formData.emergencyContact2,
        password: formData.password,
      };

      if (modalMode === 'add') {
        await createPatient(payload);
      } else if (modalMode === 'edit' && formData.id) {
        await updatePatient(formData.id, payload);
      }

      await loadPatients(searchTerm, false);
      handleCloseModal();
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el paciente.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      await deletePatient(deleteId);
      await loadPatients(searchTerm, false);
      setDeleteId(null);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el paciente.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const parts = birthDate.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    if (!day || !month || !year || year < 1900) return null;

    const today = new Date();
    const birth = new Date(year, month - 1, day);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const filteredPatients = patients;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Pacientes</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Directorio avanzado de pacientes del hospital SIGHOS</p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="bg-dash-accent text-white px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2"
        >
          <UserPlus size={18} />
          Añadir Paciente
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
      </div>

      {apiError && (
        <div className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl">
          <AlertCircle size={16} className="text-dash-danger shrink-0" />
          <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{apiError}</p>
        </div>
      )}

      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dash-border bg-dash-glass/50">
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID Paciente</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">DNI</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Nombre Completo</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Celular</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  Cargando pacientes...
                </td>
              </tr>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-dash-glass transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent">PA-{String(patient.id).padStart(3, '0')}</td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim">{patient.dni}</td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-dash-text">{patient.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim font-medium">{patient.phone}</td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('view', patient)}
                        title="Ver Detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('edit', patient)}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        title="Historial Médico"
                        onClick={() => onViewHistory(patient.dni)}
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        className="p-2 bg-dash-danger/5 border border-dash-danger/20 rounded-lg text-dash-danger/60 hover:text-dash-danger hover:bg-dash-danger/20 hover:border-dash-danger transition-all"
                        onClick={() => handleDelete(patient.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  No se encontraron pacientes con ese DNI o nombre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dash-panel border border-dash-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dash-border flex justify-between items-center bg-dash-glass/30">
              <h3 className="text-sm font-bold text-dash-accent uppercase tracking-[0.2em]">
                {modalMode === 'view' ? 'Expediente del Paciente' : modalMode === 'edit' ? 'Modificar Información' : 'Nuevo Registro de Paciente'}
              </h3>
              <button onClick={handleCloseModal} className="text-dash-text-dim hover:text-dash-danger transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">ID Paciente</label>
                <input
                  disabled
                  value={formData.visualId}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-mono outline-none opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">DNI</label>
                <input
                  name="dni"
                  disabled={modalMode === 'view'}
                  value={formData.dni}
                  onChange={handleInputChange}
                  placeholder="Número de DNI"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nombre Completo</label>
                <input
                  name="name"
                  disabled={modalMode === 'view'}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. María García"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Sexo / Género</label>
                <select
                  name="gender"
                  disabled={modalMode === 'view'}
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                >
                  <option value="MASCULINO">MASCULINO</option>
                  <option value="FEMENINO">FEMENINO</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center pr-1">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Fecha de Nacimiento</label>
                  {calculateAge(formData.birthDate) !== null && (
                    <span className="text-[10px] font-bold text-dash-accent uppercase tracking-widest">
                      Edad: {calculateAge(formData.birthDate)} años
                    </span>
                  )}
                </div>
                <input
                  name="birthDate"
                  disabled={modalMode === 'view'}
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  placeholder="DD/MM/AAAA"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Celular</label>
                <input
                  name="phone"
                  disabled={modalMode === 'view'}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9XXXXXXXX"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Correo Electrónico</label>
                <input
                  name="email"
                  disabled={modalMode === 'view'}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="paciente@sighos.com"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Dirección</label>
                <input
                  name="address"
                  disabled={modalMode === 'view'}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle, Número, Distrito"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">N. de Emergencia 1</label>
                <input
                  name="emergencyContact1"
                  disabled={modalMode === 'view'}
                  value={formData.emergencyContact1}
                  onChange={handleInputChange}
                  placeholder="9XXXXXXXX"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">N. de Emergencia 2</label>
                <input
                  name="emergencyContact2"
                  disabled={modalMode === 'view'}
                  value={formData.emergencyContact2}
                  onChange={handleInputChange}
                  placeholder="9XXXXXXXX"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Contraseña</label>
                <input
                  name="password"
                  type={modalMode === 'view' ? 'password' : 'text'}
                  disabled={modalMode === 'view'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 8 caracteres"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
            </div>

            <div className="p-6 border-t border-dash-border bg-dash-glass/10 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-6 py-2 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
              >
                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-dash-accent text-white px-8 py-2 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Confirmar y Guardar'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

type RoleModalMode = 'view' | 'edit' | 'add';

type RoleFormData = {
  id: number | null;
  visualId: string;
  name: string;
  active: 'Activo' | 'Inactivo';
  description: string;
};

const emptyRoleForm: RoleFormData = {
  id: null,
  visualId: 'RL-001',
  name: '',
  active: 'Activo',
  description: '',
};

const RolesManagement = () => {
  const [roles, setRoles] = React.useState<SpecialtyFull[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [modalMode, setModalMode] = React.useState<RoleModalMode | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<RoleFormData>(emptyRoleForm);

  const loadRoles = React.useCallback(async (term: string, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await fetchSpecialties(term);
      setRoles(data);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar las especialidades.';
      setApiError(message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadRoles(searchTerm, true);
  }, [searchTerm, loadRoles]);

  const handleOpenModal = (mode: RoleModalMode, role: SpecialtyFull | null = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      setFormData({
        ...emptyRoleForm,
        visualId: `RL-${String(roles.length + 1).padStart(3, '0')}`,
      });
      return;
    }
    if (role) {
      setFormData({
        id: role.id,
        visualId: `RL-${String(role.id).padStart(3, '0')}`,
        name: role.name,
        active: role.status,
        description: role.description || '',
      });
    }
  };

  const handleCloseModal = () => setModalMode(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (modalMode === 'view') return;
    if (!formData.name.trim()) {
      setApiError('El nombre es obligatorio.');
      return;
    }
    setIsSaving(true);
    try {
      const payload: SpecialtyPayload = {
        name: formData.name,
        description: formData.description,
        status: formData.active,
      };

      if (modalMode === 'add') {
        await createSpecialty(payload);
      }
      if (modalMode === 'edit' && formData.id) {
        await updateSpecialty(formData.id, payload);
      }
      await loadRoles(searchTerm, false);
      handleCloseModal();
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar la especialidad.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => setDeleteId(id);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      await softDeleteSpecialty(deleteId);
      await loadRoles(searchTerm, false);
      setDeleteId(null);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar la especialidad.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRoles = roles;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Especialidades</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Configuración de áreas y departamentos médicos SIGHOS</p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar especialidad por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
      </div>

      {apiError && (
        <div className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl">
          <AlertCircle size={16} className="text-dash-danger shrink-0" />
          <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{apiError}</p>
        </div>
      )}

      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dash-border bg-dash-glass/50">
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID Especialidad</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Nombre</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Activo</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  Cargando especialidades...
                </td>
              </tr>
            ) : filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-dash-glass transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent">RL-{String(role.id).padStart(3, '0')}</td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-dash-text">{role.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${role.status === 'Activo'
                        ? 'border-dash-success/30 text-dash-success bg-dash-success/10'
                        : 'border-dash-danger/30 text-dash-danger bg-dash-danger/10'
                      }`}>
                      {role.status === 'Activo' ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('view', role)}
                        title="Ver Detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  No se encontraron especialidades con ese nombre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dash-panel border border-dash-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dash-border flex justify-between items-center bg-dash-glass/30">
              <h3 className="text-sm font-bold text-dash-accent uppercase tracking-[0.2em]">
                {modalMode === 'view' ? 'Detalles de la Especialidad' : modalMode === 'edit' ? 'Modificar Especialidad' : 'Nueva Especialidad'}
              </h3>
              <button onClick={handleCloseModal} className="text-dash-text-dim hover:text-dash-danger transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">ID Especialidad</label>
                  <input
                    disabled
                    value={formData.visualId}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-mono outline-none opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Activo</label>
                  <select
                    name="active"
                    disabled={modalMode === 'view'}
                    value={formData.active}
                    onChange={handleInputChange}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                  >
                    <option value="Activo">Sí</option>
                    <option value="Inactivo">No</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nombre de la Especialidad</label>
                <input
                  name="name"
                  disabled={modalMode === 'view'}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Medicina Interna"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Descripción</label>
                <textarea
                  name="description"
                  disabled={modalMode === 'view'}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe la función y alcance de esta área médica..."
                  rows={4}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-dash-border bg-dash-glass/10 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-6 py-2 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
              >
                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-dash-accent text-white px-8 py-2 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

type ExamModalMode = 'view' | 'edit' | 'add';

type ExamFormData = {
  id: string;
  serviceId: number | null;
  name: string;
  specialty: string;
  price: string;
  status: 'Activo' | 'Inactivo';
  description: string;
};

const emptyExamForm: ExamFormData = {
  id: 'EX-001',
  serviceId: null,
  name: '',
  specialty: '',
  price: '',
  status: 'Activo',
  description: '',
};

const ExamsManagement = () => {
  const [exams, setExams] = React.useState<ExamRate[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [modalMode, setModalMode] = React.useState<ExamModalMode | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<ExamFormData>(emptyExamForm);
  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);

  const loadSpecialties = React.useCallback(async () => {
    try {
      const data = await fetchSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error("Failed to load specialties", error);
    }
  }, []);

  const loadExams = React.useCallback(async (term: string, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await fetchExamRates(term);
      setExams(data);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los exámenes.';
      setApiError(message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadExams(searchTerm, true);
    void loadSpecialties();
  }, [searchTerm, loadExams, loadSpecialties]);

  const handleOpenModal = (mode: ExamModalMode, exam: ExamRate | null = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      setFormData({
        ...emptyExamForm,
        id: `EX-${String(exams.length + 1).padStart(3, '0')}`,
      });
      return;
    }
    if (exam) {
      setFormData({
        id: exam.id,
        serviceId: exam.serviceId,
        name: exam.name,
        specialty: exam.specialty,
        price: exam.price,
        status: exam.status,
        description: exam.description,
      });
    }
  };

  const handleCloseModal = () => setModalMode(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (modalMode === 'view') return;
    if (!formData.name.trim() || !formData.specialty.trim() || !String(formData.price).trim()) {
      setApiError('Nombre, especialidad y precio son obligatorios.');
      return;
    }
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        await createExamRate({
          name: formData.name,
          specialty: formData.specialty,
          price: formData.price,
          status: formData.status,
          description: formData.description,
        });
      }
      if (modalMode === 'edit' && formData.serviceId) {
        await updateExamRate(formData.serviceId, {
          name: formData.name,
          specialty: formData.specialty,
          price: formData.price,
          status: formData.status,
          description: formData.description,
        });
      }
      await loadExams(searchTerm, false);
      handleCloseModal();
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el examen.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (serviceId: number) => setDeleteId(serviceId);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      await softDeleteExamRate(deleteId);
      await loadExams(searchTerm, false);
      setDeleteId(null);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo inactivar el examen.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredExams = exams;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Tarifas de Exámenes</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Catálogo de servicios y procedimientos diagnósticos SIGHOS</p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar examen por nombre o especialidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
      </div>

      {apiError && (
        <div className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl">
          <AlertCircle size={16} className="text-dash-danger shrink-0" />
          <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{apiError}</p>
        </div>
      )}

      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dash-border bg-dash-glass/50">
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID Examen</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Nombre</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Especialidad</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Precio</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  Cargando exámenes...
                </td>
              </tr>
            ) : filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <tr key={exam.serviceId || exam.id} className="hover:bg-dash-glass transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent font-bold">{exam.id}</td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-dash-text">{exam.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim">{exam.specialty}</td>
                  <td className="px-8 py-6 text-sm font-bold text-dash-text italic">{exam.price}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${exam.status === 'Activo'
                        ? 'border-dash-success/30 text-dash-success bg-dash-success/10'
                        : 'border-dash-danger/30 text-dash-danger bg-dash-danger/10'
                      }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('view', exam)}
                        title="Ver Detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  No se encontraron exámenes con ese nombre o especialidad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="¿Desea inactivar este examen?"
      />

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dash-panel border border-dash-border w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dash-border flex justify-between items-center bg-dash-glass/30">
              <h3 className="text-sm font-bold text-dash-accent uppercase tracking-[0.2em]">
                {modalMode === 'view' ? 'Ficha Técnica de Examen' : modalMode === 'edit' ? 'Modificar Parámetros' : 'Nuevo Examen Médico'}
              </h3>
              <button onClick={handleCloseModal} className="text-dash-text-dim hover:text-dash-danger transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">ID Examen</label>
                  <input
                    disabled
                    value={formData.id}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-mono outline-none opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Estado</label>
                  <select
                    name="status"
                    disabled={modalMode === 'view'}
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nombre del Examen</label>
                <input
                  name="name"
                  disabled={modalMode === 'view'}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Tomografía Axial Computarizada"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Especialidad</label>
                  <select
                    name="specialty"
                    disabled={modalMode === 'view'}
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                  >
                    <option value="">Seleccionar Especialidad</option>
                    {specialties.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Precio / Costo</label>
                  <input
                    name="price"
                    disabled={modalMode === 'view'}
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ej. 150.00"
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all italic font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Descripción / Reclamaciones</label>
                <textarea
                  name="description"
                  disabled={modalMode === 'view'}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Indicaciones previas, contraindicaciones y breve descripción..."
                  rows={4}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-dash-border bg-dash-glass/10 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
                disabled={isSaving}
              >
                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-dash-accent text-white px-8 py-2 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const MedicalHistoryManagement = ({ initialSearch = '', currentDoctorId, currentDoctorName, userDni }: { initialSearch?: string, currentDoctorId: number, currentDoctorName: string, userDni?: string }) => {
  const [history, setHistory] = React.useState<MedicalHistory[]>([]);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = React.useState(initialSearch);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');

  const [modalMode, setModalMode] = React.useState<'view' | 'edit' | 'add' | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<any>({});

  const loadData = React.useCallback(async (term: string, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [historiesData, patientsData] = await Promise.all([
        fetchMedicalHistories(term),
        fetchPatients()
      ]);
      setHistory(historiesData);
      setPatients(patientsData);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo cargar la información.';
      setApiError(message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData(searchTerm, true);
  }, [searchTerm, loadData]);

  const handleOpenModal = (mode: 'view' | 'edit' | 'add', entry: MedicalHistory | null = null) => {
    setModalMode(mode);
    setApiError('');
    if (mode === 'add') {
      setFormData({
        id: '',
        date: new Date().toLocaleDateString('es-PE'),
        patientId: '',
        patientName: '',
        patientDni: '',
        doctorId: currentDoctorId,
        doctorName: currentDoctorName,
        findings: '',
        diagnosis: '',
        treatment: '',
        medications: '',
        procedures: '',
        weight: '',
        height: ''
      });
    } else if (entry) {
      setFormData({
        ...entry,
        weight: entry.weight || '',
        height: entry.height || '',
      });
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'patientDni' && (modalMode === 'add' || modalMode === 'edit')) {
      const patient = patients.find(p => p.dni === value);
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
        patientName: patient ? patient.name : '',
        patientId: patient ? patient.id : ''
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (modalMode === 'view') return;
    if (!formData.patientId) {
      setApiError('Debe ingresar un DNI de paciente válido que se encuentre registrado.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: MedicalHistoryPayload = {
        patientId: Number(formData.patientId),
        doctorId: formData.doctorId ? Number(formData.doctorId) : currentDoctorId,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        findings: formData.findings,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        medications: formData.medications,
        procedures: formData.procedures,
      };

      if (modalMode === 'add') {
        await createMedicalHistory(payload);
      } else if (modalMode === 'edit' && formData.id) {
        await updateMedicalHistory(formData.id, payload);
      }

      await loadData(searchTerm, false);
      handleCloseModal();
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el historial.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      await deleteMedicalHistory(deleteId);
      await loadData(searchTerm, false);
      setDeleteId(null);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el historial.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Historiales Médicos</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Registro clínico detallado de pacientes SIGHOS</p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar historial por paciente o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
      </div>

      {apiError && (
        <div className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl">
          <AlertCircle size={16} className="text-dash-danger shrink-0" />
          <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{apiError}</p>
        </div>
      )}

      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dash-border bg-dash-glass/50">
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID Historial</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Fecha</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Paciente</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">DNI</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Médico Encargado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  Cargando historiales médicos...
                </td>
              </tr>
            ) : history.length > 0 ? (
              history.filter(entry => !userDni || entry.patientDni === userDni).map((entry) => (
                <tr key={entry.id} className="hover:bg-dash-glass transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent font-bold">MH-{String(entry.id).padStart(3, '0')}</td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim font-medium">{entry.date}</td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-dash-text uppercase tracking-tight">{entry.patientName}</span>
                  </td>
                  <td className="px-8 py-6 text-xs font-mono text-dash-text-dim">{entry.patientDni}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-dash-text tracking-tight uppercase">{entry.doctorName}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('view', entry)}
                        title="Ver Detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  No se encontraron historiales médicos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dash-panel border border-dash-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dash-border flex justify-between items-center bg-dash-glass/30">
              <h3 className="text-sm font-bold text-dash-accent uppercase tracking-[0.2em]">
                {modalMode === 'view' ? 'Detalle de Historial Médico' : modalMode === 'edit' ? 'Editar Entrada Clínica' : 'Nuevo Registro Clínico'}
              </h3>
              <button onClick={handleCloseModal} className="text-dash-text-dim hover:text-dash-danger transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">ID Historial</label>
                <input
                  disabled
                  value={formData.id ? `MH-${String(formData.id).padStart(3, '0')}` : ''}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-mono outline-none opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Fecha</label>
                <input
                  name="date"
                  disabled
                  value={formData.date}
                  placeholder="Se genera automáticamente"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">DNI Paciente</label>
                <input
                  name="patientDni"
                  disabled={modalMode === 'view'}
                  value={formData.patientDni}
                  onChange={handleInputChange}
                  placeholder="Ingrese DNI..."
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Paciente</label>
                <input
                  name="patientName"
                  disabled
                  value={formData.patientName}
                  placeholder={modalMode === 'add' ? "Se completará con el DNI" : "Nombre del paciente"}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all opacity-60 font-bold"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Médico Encargado</label>
                <input
                  name="doctorName"
                  disabled
                  value={formData.doctorName}
                  placeholder="Nombre del médico"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Peso (kg)</label>
                <input
                  name="weight"
                  disabled={modalMode === 'view'}
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Ej. 70"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Altura (cm)</label>
                <input
                  name="height"
                  disabled={modalMode === 'view'}
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="Ej. 175"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Hallazgos Médicos</label>
                <textarea
                  name="findings"
                  disabled={modalMode === 'view'}
                  value={formData.findings}
                  onChange={handleInputChange}
                  placeholder="Describa los hallazgos observados..."
                  rows={3}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Diagnóstico</label>
                <textarea
                  name="diagnosis"
                  disabled={modalMode === 'view'}
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Descripción del diagnóstico clínico..."
                  rows={3}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Tratamiento</label>
                <textarea
                  name="treatment"
                  disabled={modalMode === 'view'}
                  value={formData.treatment}
                  onChange={handleInputChange}
                  placeholder="Indicaciones terapéuticas y generales..."
                  rows={4}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Medicamentos</label>
                <textarea
                  name="medications"
                  disabled={modalMode === 'view'}
                  value={formData.medications}
                  onChange={handleInputChange}
                  placeholder="Lista de medicamentos prescritos, dosis y frecuencia..."
                  rows={4}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Procedimientos</label>
                <textarea
                  name="procedures"
                  disabled={modalMode === 'view'}
                  value={formData.procedures}
                  onChange={handleInputChange}
                  placeholder="Procedimientos médicos realizados o indicados..."
                  rows={3}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-dash-border bg-dash-glass/10 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-6 py-2 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
              >
                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-dash-accent text-white px-8 py-2 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};


type ProcedureModalMode = 'view' | 'edit' | 'add';

type ProcedureFormData = {
  id: string;
  serviceId: number | null;
  name: string;
  specialty: string;
  price: string;
  status: 'Activo' | 'Inactivo';
  description: string;
};

const emptyProcedureForm: ProcedureFormData = {
  id: 'PR-001',
  serviceId: null,
  name: '',
  specialty: '',
  price: '',
  status: 'Activo',
  description: '',
};

const ProceduresManagement = () => {
  const [procedures, setProcedures] = React.useState<ProcedureRate[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [modalMode, setModalMode] = React.useState<ProcedureModalMode | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<ProcedureFormData>(emptyProcedureForm);
  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);

  const loadSpecialties = React.useCallback(async () => {
    try {
      const data = await fetchSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error("Failed to load specialties", error);
    }
  }, []);

  const loadProcedures = React.useCallback(async (term: string, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await fetchProcedureRates(term);
      setProcedures(data);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los procedimientos.';
      setApiError(message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadProcedures(searchTerm, true);
    void loadSpecialties();
  }, [searchTerm, loadProcedures, loadSpecialties]);

  const handleOpenModal = (mode: ProcedureModalMode, procedure: ProcedureRate | null = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      setFormData({
        ...emptyProcedureForm,
        id: `PR-${String(procedures.length + 1).padStart(3, '0')}`,
      });
      return;
    }
    if (procedure) {
      setFormData({
        id: procedure.id,
        serviceId: procedure.serviceId,
        name: procedure.name,
        specialty: procedure.specialty,
        price: procedure.price,
        status: procedure.status,
        description: procedure.description,
      });
    }
  };

  const handleCloseModal = () => setModalMode(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (modalMode === 'view') return;
    if (!formData.name.trim() || !formData.specialty.trim() || !String(formData.price).trim()) {
      setApiError('Nombre, especialidad y costo base son obligatorios.');
      return;
    }
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        await createProcedureRate({
          name: formData.name,
          specialty: formData.specialty,
          price: formData.price,
          status: formData.status,
          description: formData.description,
        });
      }
      if (modalMode === 'edit' && formData.serviceId) {
        await updateProcedureRate(formData.serviceId, {
          name: formData.name,
          specialty: formData.specialty,
          price: formData.price,
          status: formData.status,
          description: formData.description,
        });
      }
      await loadProcedures(searchTerm, false);
      handleCloseModal();
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el procedimiento.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (serviceId: number) => setDeleteId(serviceId);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      await softDeleteProcedureRate(deleteId);
      await loadProcedures(searchTerm, false);
      setDeleteId(null);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo inactivar el procedimiento.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProcedures = procedures;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Tarifas de Procedimientos</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Directorio de intervenciones y procedimientos del hospital SIGHOS</p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar procedimiento por nombre o especialidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
      </div>

      {apiError && (
        <div className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl">
          <AlertCircle size={16} className="text-dash-danger shrink-0" />
          <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{apiError}</p>
        </div>
      )}

      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dash-border bg-dash-glass/50">
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID Proced.</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Nombre</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Especialidad</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Costo Estimado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  Cargando procedimientos...
                </td>
              </tr>
            ) : filteredProcedures.length > 0 ? (
              filteredProcedures.map((procedure) => (
                <tr key={procedure.serviceId || procedure.id} className="hover:bg-dash-glass transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent font-bold">{procedure.id}</td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-dash-text">{procedure.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim">{procedure.specialty}</td>
                  <td className="px-8 py-6 text-sm font-bold text-dash-text italic">{procedure.price}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${procedure.status === 'Activo'
                        ? 'border-dash-success/30 text-dash-success bg-dash-success/10'
                        : 'border-dash-danger/30 text-dash-danger bg-dash-danger/10'
                      }`}>
                      {procedure.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('view', procedure)}
                        title="Ver Detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  No se encontraron procedimientos con ese nombre o especialidad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="¿Desea inactivar este procedimiento?"
      />

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dash-panel border border-dash-border w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dash-border flex justify-between items-center bg-dash-glass/30">
              <h3 className="text-sm font-bold text-dash-accent uppercase tracking-[0.2em]">
                {modalMode === 'view' ? 'Ficha Técnica de Procedimiento' : modalMode === 'edit' ? 'Modificar Parámetros' : 'Nuevo Procedimiento'}
              </h3>
              <button onClick={handleCloseModal} className="text-dash-text-dim hover:text-dash-danger transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">ID Procedimiento</label>
                  <input
                    disabled
                    value={formData.id}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-mono outline-none opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Estado</label>
                  <select
                    name="status"
                    disabled={modalMode === 'view'}
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nombre del Procedimiento</label>
                <input
                  name="name"
                  disabled={modalMode === 'view'}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Intervención Quirúrgica..."
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Especialidad</label>
                  <select
                    name="specialty"
                    disabled={modalMode === 'view'}
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                  >
                    <option value="">Seleccionar Especialidad</option>
                    {specialties.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Costo Base Estimado</label>
                  <input
                    name="price"
                    disabled={modalMode === 'view'}
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ej. 1000.00"
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all italic font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Descripción y Protocolo</label>
                <textarea
                  name="description"
                  disabled={modalMode === 'view'}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detalles del procedimiento, materiales y personal requerido..."
                  rows={4}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-dash-border bg-dash-glass/10 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
                disabled={isSaving}
              >
                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-dash-accent text-white px-8 py-2 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default function ClienteDashboard({ initialUser, onLogout, onUpdateUser }: { initialUser: any, onLogout: () => void, onUpdateUser: (data: any) => void }) {
  const [activeTab, setActiveTab] = React.useState('appointments');
  const [historySearch, setHistorySearch] = React.useState('');
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  const [dashboardStats, setDashboardStats] = React.useState<DashboardStats | null>(null);

  React.useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats()
        .then(setDashboardStats)
        .catch(error => console.error("Error al cargar estadisticas:", error));
    }
  }, [activeTab]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [userProfile, setUserProfile] = React.useState(initialUser);

  const handleProfileUpdate = (newData: any) => {
    setUserProfile(newData);
    onUpdateUser(newData);
  };

  const navigateToHistory = (dni: string) => {
    setHistorySearch(dni);
    setActiveTab('medical-history');
  };

  const handleTabChange = (tab: string) => {
    if (tab !== 'medical-history') {
      setHistorySearch('');
    }
    setActiveTab(tab);
  };

  const menuItems = [
    { id: 'appointments', icon: ClipboardCheck, label: 'Gestión de Citas / Servicios' },
    { id: 'medical-history', icon: FileText, label: 'Gestión de Historiales Médicos' },
    { id: 'roles', icon: ClipboardList, label: 'Gestión de Especialidades' },
    { id: 'schedules', icon: CalendarDays, label: 'Gestión de Horarios Laborales' },
    { id: 'exams', icon: Stethoscope, label: 'Gestión de Tarifas de Exámenes' },
    { id: 'procedures', icon: ClipboardList, label: 'Gestión de Tarifas de Procedimientos' },
    { id: 'appointment-rates', icon: CreditCard, label: 'Gestión de Tarifas de Cita' },
  ];

  const recentPatients = [
    { name: 'Elena Rodríguez', id: '#P-4521', status: 'En Observación', time: 'hace 10m', avatar: 'ER' },
    { name: 'Marco Santillán', id: '#P-4522', status: 'Emergencia', time: 'hace 25m', avatar: 'MS' },
    { name: 'Sofía Martínez', id: '#P-4523', status: 'Alta Pendiente', time: 'hace 1h', avatar: 'SM' },
    { name: 'Javier Luna', id: '#P-4524', status: 'Cirugía', time: 'hace 2h', avatar: 'JL' },
  ];

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dash-panel backdrop-blur-xl flex flex-col border-r border-dash-border">
        <div className="p-8 border-b border-dash-border flex items-center gap-3">
          <div className="w-8 h-8 bg-dash-accent rounded shadow-sm flex items-center justify-center">
            <Activity className="text-white w-5 h-5 stroke-[3px]" />
          </div>
          <span className="text-lg font-bold text-dash-text tracking-widest uppercase italic">SIGHOS</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold uppercase tracking-wider ${activeTab === item.id
                  ? 'bg-dash-glass text-dash-accent border-l-4 border-dash-accent'
                  : 'text-dash-text-dim hover:text-dash-text hover:bg-dash-glass'
                }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-dash-panel/50 backdrop-blur-md border-b border-dash-border px-10 flex items-center justify-between sticky top-0 z-10">
          <div className="flex-1">
            {/* Espacio reservado o título de sección si fuera necesario */}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right mr-4">
              <p className="text-xl font-bold text-dash-text font-mono">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </p>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-dash-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-dash-text uppercase tracking-tight">{userProfile.name}</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${showProfileMenu || activeTab === 'profile'
                      ? 'bg-dash-accent text-white border-dash-accent shadow-[0_0_15px_var(--color-dash-accent)]'
                      : 'bg-dash-glass border-dash-accent text-dash-accent shadow-sm hover:bg-dash-accent hover:text-white'
                    }`}
                >
                  <User size={20} />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 mt-4 w-56 bg-dash-panel border border-dash-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-dash-border bg-dash-glass/30">
                          <p className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest mb-1">Usuario Activo</p>
                          <p className="text-xs font-bold text-dash-text truncate uppercase">{userProfile.name}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => {
                              handleTabChange('profile');
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-dash-text-dim hover:text-dash-accent hover:bg-dash-accent/5 rounded-xl transition-all uppercase tracking-widest"
                          >
                            <User size={16} />
                            Ver Perfil
                          </button>
                          <button
                            className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-dash-danger hover:bg-dash-danger/5 rounded-xl transition-all uppercase tracking-widest"
                            onClick={onLogout}
                          >
                            <LogOut size={16} />
                            Cerrar Sesión
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {activeTab === 'profile' ? (
            <UserProfileManagement profile={userProfile} onUpdate={handleProfileUpdate} />
          ) : activeTab === 'medical-history' ? (
            <MedicalHistoryManagement initialSearch={historySearch} currentDoctorId={userProfile.workerId} currentDoctorName={userProfile.name} userDni={userProfile.dni} />
          ) : activeTab === 'roles' ? (
            <RolesManagement />
          ) : activeTab === 'exams' ? (
            <ExamsManagement />
          ) : activeTab === 'procedures' ? (
            <ProceduresManagement />
          ) : activeTab === 'appointment-rates' ? (
            <AppointmentRatesManagement />
          ) : activeTab === 'schedules' ? (
            <ScheduleManagement />
          ) : activeTab === 'appointments' ? (
            <AppointmentsManagement userDni={userProfile.dni} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-dash-text-dim">
              <Activity size={64} className="opacity-10 mb-6" />
              <h2 className="text-xl font-bold uppercase tracking-widest">Módulo en Desarrollo</h2>
              <p className="mt-2 text-sm">Este apartado estará disponible en la próxima actualización de SIGHOS.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

type RateModalMode = 'view' | 'edit' | 'add';

type RateFormData = {
  id: string;
  serviceId: number | null;
  name: string;
  specialty: string;
  price: string;
  status: 'Activo' | 'Inactivo';
  description: string;
};

const emptyRateForm: RateFormData = {
  id: 'TR-001',
  serviceId: null,
  name: '',
  specialty: '',
  price: '',
  status: 'Activo',
  description: '',
};

const AppointmentRatesManagement = () => {
  const [rates, setRates] = React.useState<AppointmentRate[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [modalMode, setModalMode] = React.useState<RateModalMode | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<RateFormData>(emptyRateForm);
  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);

  const loadSpecialties = React.useCallback(async () => {
    try {
      const data = await fetchSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error("Failed to load specialties", error);
    }
  }, []);

  const loadRates = React.useCallback(async (term: string, showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const data = await fetchAppointmentRates(term);
      setRates(data);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar las tarifas.';
      setApiError(message);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    void loadRates(searchTerm, true);
    void loadSpecialties();
  }, [searchTerm, loadRates, loadSpecialties]);

  const handleOpenModal = (mode: RateModalMode, rate: AppointmentRate | null = null) => {
    setModalMode(mode);

    if (mode === 'add') {
      setFormData({
        ...emptyRateForm,
        id: `TR-${String(rates.length + 1).padStart(3, '0')}`,
      });
      return;
    }

    if (rate) {
      setFormData({
        id: rate.id,
        serviceId: rate.serviceId,
        name: rate.name,
        specialty: rate.specialty,
        price: rate.price,
        status: rate.status,
        description: rate.description,
      });
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (modalMode === 'view') {
      return;
    }

    if (!formData.name.trim() || !formData.specialty.trim() || !String(formData.price).trim()) {
      setApiError('Nombre, especialidad y precio son obligatorios.');
      return;
    }

    setIsSaving(true);

    try {
      if (modalMode === 'add') {
        await createAppointmentRate({
          name: formData.name,
          specialty: formData.specialty,
          price: formData.price,
          status: formData.status,
          description: formData.description,
        });
      }

      if (modalMode === 'edit' && formData.serviceId) {
        await updateAppointmentRate(formData.serviceId, {
          name: formData.name,
          specialty: formData.specialty,
          price: formData.price,
          status: formData.status,
          description: formData.description,
        });
      }

      await loadRates(searchTerm, false);
      handleCloseModal();
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar la tarifa.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (serviceId: number) => {
    setDeleteId(serviceId);
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    setIsSaving(true);

    try {
      await softDeleteAppointmentRate(deleteId);
      await loadRates(searchTerm, false);
      setDeleteId(null);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo inactivar la tarifa.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRates = rates;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Tarifas de Cita</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Configuración de costos por consultas y especialidades SIGHOS</p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar tarifa por nombre de consulta o especialidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
      </div>

      {apiError && (
        <div className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl">
          <AlertCircle size={16} className="text-dash-danger shrink-0" />
          <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{apiError}</p>
        </div>
      )}

      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dash-border bg-dash-glass/50">
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID Tarifa</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Nombre de Consulta</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Especialidad</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Costo</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  Cargando tarifas...
                </td>
              </tr>
            ) : filteredRates.length > 0 ? (
              filteredRates.map((rate) => (
                <tr key={rate.serviceId} className="hover:bg-dash-glass transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent font-bold">{rate.id}</td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-dash-text">{rate.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim">{rate.specialty}</td>
                  <td className="px-8 py-6 text-sm font-bold text-dash-text italic">{rate.price}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${rate.status === 'Activo'
                        ? 'border-dash-success/30 text-dash-success bg-dash-success/10'
                        : 'border-dash-danger/30 text-dash-danger bg-dash-danger/10'
                      }`}>
                      {rate.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent hover:border-dash-accent transition-all"
                        onClick={() => handleOpenModal('view', rate)}
                        title="Ver Detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  No se encontraron tarifas con ese nombre o especialidad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="¿Desea inactivar esta tarifa?"
      />

      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dash-panel border border-dash-border w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dash-border flex justify-between items-center bg-dash-glass/30">
              <h3 className="text-sm font-bold text-dash-accent uppercase tracking-[0.2em]">
                {modalMode === 'view' ? 'Detalles de Tarifa' : modalMode === 'edit' ? 'Modificar Tarifa' : 'Registro de Nueva Tarifa'}
              </h3>
              <button onClick={handleCloseModal} className="text-dash-text-dim hover:text-dash-danger transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">ID Tarifa</label>
                  <input
                    disabled
                    value={formData.id}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-mono outline-none opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Estado</label>
                  <select
                    name="status"
                    disabled={modalMode === 'view'}
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nombre de la Consulta</label>
                <input
                  name="name"
                  disabled={modalMode === 'view'}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Consulta Médica Integral"
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Especialidad</label>
                  <select
                    name="specialty"
                    disabled={modalMode === 'view'}
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                  >
                    <option value="">Seleccionar Especialidad</option>
                    {specialties.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Costo de la Cita</label>
                  <input
                    name="price"
                    disabled={modalMode === 'view'}
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ej. S/ 50.00"
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all italic font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Descripción del Servicio</label>
                <textarea
                  name="description"
                  disabled={modalMode === 'view'}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detalles sobre lo que incluye la consulta..."
                  rows={4}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-dash-border bg-dash-glass/10 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
              >
                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {modalMode !== 'view' && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-dash-accent text-white px-8 py-2 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const UserProfileManagement = ({ profile, onUpdate }: { profile: any, onUpdate: (data: any) => void }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({ ...profile });
  const [passwordForm, setPasswordForm] = React.useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordError, setPasswordError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setApiError('');
    try {
      await updateClientProfile(profile.workerId, {
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergencyContact1: formData.emergencyContact1 || '',
        emergencyContact2: formData.emergencyContact2 || ''
      });
      onUpdate(formData);
      setIsEditing(false);
    } catch (err: any) {
      setApiError(err.message || 'Error al actualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.current !== profile.password) {
      setPasswordError('La contraseña actual es incorrecta');
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('Las nuevas contraseñas no coinciden');
      return;
    }

    if (passwordForm.new.length < 4) {
      setPasswordError('La nueva contraseña debe tener al menos 4 caracteres');
      return;
    }

    setIsSaving(true);
    setPasswordError('');
    try {
      await updateClientPassword(profile.workerId, {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new
      });
      onUpdate({ ...profile, password: passwordForm.new });
      setFormData((prev: any) => ({ ...prev, password: passwordForm.new }));
      setIsChangingPassword(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      setPasswordError(err.message || 'Error al cambiar contraseña');
    } finally {
      setIsSaving(false);
    }
  };


  if (isChangingPassword) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto"
      >
        <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-dash-border bg-dash-glass/30 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Cambio de Contraseña</h2>
              <p className="text-dash-text-dim text-[10px] uppercase tracking-[0.2em] mt-1">Actualice sus credenciales de seguridad</p>
            </div>
            <button
              onClick={() => { setIsChangingPassword(false); setPasswordError(''); }}
              className="text-dash-text-dim hover:text-dash-danger transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Contraseña Actual</label>
              <input
                name="current"
                type="password"
                value={passwordForm.current}
                onChange={handlePasswordInputChange}
                placeholder="Ingrese su contraseña actual"
                className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-3 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nueva Contraseña</label>
              <input
                name="new"
                type="password"
                value={passwordForm.new}
                onChange={handlePasswordInputChange}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-3 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Confirmar Nueva Contraseña</label>
              <input
                name="confirm"
                type="password"
                value={passwordForm.confirm}
                onChange={handlePasswordInputChange}
                placeholder="Repita la nueva contraseña"
                className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-3 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
              />
            </div>

            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-dash-danger text-center"
              >
                {passwordError}
              </motion.p>
            )}

            <button
              onClick={handleChangePassword}
              disabled={isSaving}
              className="w-full bg-dash-accent text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-dash-border bg-dash-glass/30 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Mi Perfil de Paciente</h2>
            <p className="text-dash-text-dim text-[10px] uppercase tracking-[0.2em] mt-1">Configuración de cuenta y datos personales SIGHOS</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-dash-accent text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2"
            >
              <Pencil size={14} />
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => { setIsEditing(false); setFormData({ ...profile }); }}
                className="px-6 py-2.5 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-dash-success text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>

        {apiError && (
          <div className="mx-10 mt-6 p-4 bg-dash-danger/10 border border-dash-danger/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-dash-danger shrink-0" size={18} />
            <p className="text-xs font-bold text-dash-danger">{apiError}</p>
          </div>
        )}

        <div className="p-10 grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">DNI (Inalterable)</label>
            <input
              disabled
              value={formData.dni}
              className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-3 text-sm text-dash-text outline-none opacity-60 font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nombre Completo (Inalterable)</label>
            <input
              disabled
              value={formData.name}
              className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-3 text-sm text-dash-text outline-none opacity-60 font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Celular</label>
            <input
              name="phone"
              disabled={!isEditing}
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full bg-dash-glass border rounded-xl px-4 py-3 text-sm text-dash-text outline-none transition-all ${isEditing ? 'border-dash-accent' : 'border-dash-border cursor-not-allowed'}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Correo Electrónico</label>
            <input
              name="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full bg-dash-glass border rounded-xl px-4 py-3 text-sm text-dash-text outline-none transition-all ${isEditing ? 'border-dash-accent' : 'border-dash-border cursor-not-allowed'}`}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Dirección de Vivienda</label>
            <input
              name="address"
              disabled={!isEditing}
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full bg-dash-glass border rounded-xl px-4 py-3 text-sm text-dash-text outline-none transition-all ${isEditing ? 'border-dash-accent' : 'border-dash-border cursor-not-allowed'}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Contacto de Emergencia 1</label>
            <input
              name="emergencyContact1"
              disabled={!isEditing}
              value={formData.emergencyContact1 || ''}
              onChange={handleInputChange}
              className={`w-full bg-dash-glass border rounded-xl px-4 py-3 text-sm text-dash-text outline-none transition-all ${isEditing ? 'border-dash-accent' : 'border-dash-border cursor-not-allowed'}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Contacto de Emergencia 2</label>
            <input
              name="emergencyContact2"
              disabled={!isEditing}
              value={formData.emergencyContact2 || ''}
              onChange={handleInputChange}
              className={`w-full bg-dash-glass border rounded-xl px-4 py-3 text-sm text-dash-text outline-none transition-all ${isEditing ? 'border-dash-accent' : 'border-dash-border cursor-not-allowed'}`}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Contraseña (Inalterable)</label>
            <div className="relative">
              <input
                type="password"
                disabled
                value={formData.password}
                className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-3 text-sm text-dash-text outline-none opacity-60 flex-1"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-dash-text-dim uppercase tracking-widest">Protegido</span>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="mt-2 text-[10px] font-bold text-dash-accent uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                <Lock size={12} />
                Cambiar Contraseña
              </button>
            )}
          </div>
        </div>

        <div className="p-6 bg-dash-glass/10 border-t border-dash-border flex items-center gap-4 px-10">
          <div className="p-3 bg-dash-accent/10 rounded-full">
            <AlertCircle className="w-5 h-5 text-dash-accent" />
          </div>
          <p className="text-[10px] text-dash-text-dim italic leading-relaxed">
            * Por razones de seguridad del sistema SIGHOS, el DNI, el Nombre y la Contraseña no pueden ser modificados directamente desde la edición de perfil. Utilice el botón "Cambiar Contraseña" para actualizar sus credenciales.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ScheduleManagement = () => {
  const [schedules, setSchedules] = React.useState<WorkSchedule[]>([]);
  const [specialties, setSpecialties] = React.useState<SpecialtyFull[]>([]);
  const [staff, setStaff] = React.useState<Staff[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const [selectedSpecialty, setSelectedSpecialty] = React.useState('');
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
  const [mode, setMode] = React.useState<'idle' | 'view' | 'edit'>('idle');

  const [currentMorningId, setCurrentMorningId] = React.useState('');
  const [currentAfternoonId, setCurrentAfternoonId] = React.useState('');
  const [currentScheduleId, setCurrentScheduleId] = React.useState<number | null>(null);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [schedulesData, specialtiesData, staffData] = await Promise.all([
        fetchWorkSchedules(),
        fetchSpecialties(),
        fetchStaff()
      ]);
      setSchedules(schedulesData);
      setSpecialties(specialtiesData);
      setStaff(staffData);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo cargar la información.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const getCurrentSchedule = () => {
    return schedules.find(s =>
      s.specialtyId === Number(selectedSpecialty) &&
      s.month === Number(selectedMonth) &&
      s.year === Number(selectedYear)
    );
  };

  const handleConsult = () => {
    if (!selectedSpecialty || !selectedMonth || !selectedYear) {
      setApiError('Por favor seleccione especialidad, mes y año.');
      return;
    }
    setApiError('');
    const saved = getCurrentSchedule();
    if (saved) {
      setCurrentMorningId(saved.morningWorkerId ? String(saved.morningWorkerId) : '');
      setCurrentAfternoonId(saved.afternoonWorkerId ? String(saved.afternoonWorkerId) : '');
      setCurrentScheduleId(saved.id);
      setMode('view');
    } else {
      setCurrentMorningId('');
      setCurrentAfternoonId('');
      setCurrentScheduleId(null);
      setMode('view');
    }
  };

  const handleAddSchedule = () => {
    if (!selectedSpecialty || !selectedMonth || !selectedYear) {
      setApiError('Por favor seleccione especialidad, mes y año.');
      return;
    }
    setApiError('');
    setCurrentMorningId('');
    setCurrentAfternoonId('');
    setCurrentScheduleId(null);
    setMode('edit');
  };

  const handleEdit = () => {
    if (!selectedSpecialty || !selectedMonth || !selectedYear) {
      setApiError('Por favor seleccione especialidad, mes y año.');
      return;
    }
    setApiError('');
    const saved = getCurrentSchedule();
    if (saved) {
      setCurrentMorningId(saved.morningWorkerId ? String(saved.morningWorkerId) : '');
      setCurrentAfternoonId(saved.afternoonWorkerId ? String(saved.afternoonWorkerId) : '');
      setCurrentScheduleId(saved.id);
      setMode('edit');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: WorkSchedulePayload = {
        specialtyId: Number(selectedSpecialty),
        month: Number(selectedMonth),
        year: Number(selectedYear),
        morningWorkerId: currentMorningId ? Number(currentMorningId) : null,
        afternoonWorkerId: currentAfternoonId ? Number(currentAfternoonId) : null,
      };
      await saveWorkSchedule(payload);
      await loadData();
      setMode('view');
      setApiError('');
      // Update local state to immediately show assigned IDs when switched to 'view'
      setCurrentScheduleId(getCurrentSchedule()?.id || null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el horario.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentScheduleId) return;
    setIsSaving(true);
    try {
      await deleteWorkSchedule(currentScheduleId);
      await loadData();
      setMode('idle');
      setCurrentScheduleId(null);
      setCurrentMorningId('');
      setCurrentAfternoonId('');
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el horario.';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setSelectedSpecialty('');
    setSelectedMonth('');
    setSelectedYear(new Date().getFullYear().toString());
    setCurrentMorningId('');
    setCurrentAfternoonId('');
    setCurrentScheduleId(null);
    setMode('idle');
    setApiError('');
  };

  const hours = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
  ];

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const filteredStaff = staff.filter(s => s.specialtyId === Number(selectedSpecialty) && s.status === 'ACTIVO');

  const getCellColor = (timeStr: string) => {
    if (!currentMorningId && !currentAfternoonId) return 'bg-transparent';

    // Normalize time to check ranges
    const hour = parseInt(timeStr.split(':')[0]);
    const isPM = timeStr.includes('PM');
    const normalizedHour = (isPM && hour !== 12) ? hour + 12 : (!isPM && hour === 12) ? 0 : hour;

    if (currentMorningId && normalizedHour >= 8 && normalizedHour < 17) {
      return 'bg-dash-success/20 border-dash-success/30';
    }
    if (currentAfternoonId && normalizedHour >= 17 && normalizedHour < 21) {
      return 'bg-blue-500/20 border-blue-500/30';
    }
    return 'bg-transparent';
  };

  const morningWorkerName = staff.find(s => String(s.id) === currentMorningId)?.name || 'SIN ASIGNAR';
  const afternoonWorkerName = staff.find(s => String(s.id) === currentAfternoonId)?.name || 'SIN ASIGNAR';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="bg-dash-panel p-8 rounded-3xl border border-dash-border flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Horarios Laborales</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Planificación mensual de turnos por especialidad médica</p>
        </div>
      </div>

      {apiError && (
        <div className="flex items-center gap-2 bg-dash-danger/10 border border-dash-danger/20 p-4 rounded-xl">
          <AlertCircle size={16} className="text-dash-danger shrink-0" />
          <p className="text-[11px] font-bold text-dash-danger uppercase tracking-tight">{apiError}</p>
        </div>
      )}

      {isLoading && (
        <div className="p-10 text-center text-dash-text-dim italic text-sm">
          Cargando datos...
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Schedule Table */}
          <div className="flex-1 bg-dash-panel rounded-3xl border border-dash-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-dash-glass/50 border-b border-dash-border">
                    <th className="p-4 text-[10px] font-bold text-dash-text-dim uppercase tracking-widest border-r border-dash-border w-24">Hora</th>
                    {days.map(day => (
                      <th key={day} className="p-4 text-[10px] font-bold text-dash-text-dim uppercase tracking-widest border-r border-dash-border last:border-r-0">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-border">
                  {hours.map((hour, idx) => (
                    <tr key={idx} className="group hover:bg-white/5 transition-colors">
                      <td className="p-4 text-[10px] font-mono text-dash-text-dim border-r border-dash-border text-center">{hour}</td>
                      {days.map(day => (
                        <td key={day} className={`p-4 border-r border-dash-border last:border-r-0 transition-all duration-300 ${getCellColor(hour)}`}>
                          <div className="h-4"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Control Panel */}
          <aside className="w-full lg:w-80 space-y-6">
            <div className="bg-dash-panel border border-dash-border rounded-3xl p-6 space-y-6 shadow-lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Especialidad</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => {
                      setSelectedSpecialty(e.target.value);
                      setMode('idle');
                    }}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                  >
                    <option value="">Seleccionar Especialidad</option>
                    {specialties.filter(s => s.status === 'Activo').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Mes</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        setMode('idle');
                      }}
                      className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all appearance-none"
                    >
                      <option value="">Mes</option>
                      {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Año</label>
                    <input
                      type="number"
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setMode('idle');
                      }}
                      className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-text outline-none focus:border-dash-accent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4">
                <button
                  onClick={handleConsult}
                  className="w-full bg-dash-glass hover:bg-dash-accent hover:text-white border border-dash-border hover:border-dash-accent rounded-xl py-3 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Search size={14} />
                  Consultar
                </button>
                <button
                  onClick={handleClear}
                  className="w-full bg-dash-glass hover:bg-dash-danger hover:text-white border border-dash-border hover:border-dash-danger rounded-xl py-3 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <X size={14} />
                  Limpiar
                </button>
              </div>
            </div>

            {/* Personnel Assignment Section */}
            {(mode === 'view' || mode === 'edit') && selectedSpecialty && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dash-panel border border-dash-border rounded-3xl p-6 space-y-6 shadow-lg"
              >
                <h3 className="text-[11px] font-bold text-dash-accent uppercase tracking-[0.2em] mb-4">Personal Asignado</h3>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-dash-accent/10 px-3 py-1 rounded-full w-fit">
                      <Clock size={12} className="text-dash-accent" />
                      <span className="text-[9px] font-bold text-dash-accent uppercase tracking-widest">Turno Mañana (08:00 - 17:00)</span>
                    </div>
                    {mode === 'view' ? (
                      <div className="w-full bg-dash-glass/50 border border-dash-border rounded-xl px-4 py-3 text-sm text-dash-text font-bold">
                        {morningWorkerName}
                      </div>
                    ) : (
                      <select
                        value={currentMorningId}
                        onChange={(e) => setCurrentMorningId(e.target.value)}
                        className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-bold outline-none border-dash-accent/50 appearance-none"
                      >
                        <option value="">Seleccionar Personal</option>
                        {filteredStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full w-fit">
                      <Clock size={12} className="text-blue-500" />
                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Turno Tarde (17:00 - 21:00)</span>
                    </div>
                    {mode === 'view' ? (
                      <div className="w-full bg-dash-glass/50 border border-dash-border rounded-xl px-4 py-3 text-sm text-dash-text font-bold">
                        {afternoonWorkerName}
                      </div>
                    ) : (
                      <select
                        value={currentAfternoonId}
                        onChange={(e) => setCurrentAfternoonId(e.target.value)}
                        className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-sm text-dash-accent font-bold outline-none border-dash-accent/50 appearance-none"
                      >
                        <option value="">Seleccionar Personal</option>
                        {filteredStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    )}
                  </div>

                  {mode === 'edit' && (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-dash-accent text-white rounded-xl py-3 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-dash-accent/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isSaving ? 'Guardando...' : 'Guardar Asignación'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </aside>
        </div>
      )}
    </motion.div>
  );
};

const AppointmentsManagement = ({ userDni }: { userDni?: string }) => {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [patientsCatalog, setPatientsCatalog] = React.useState<Patient[]>([]);
  const [appointmentRates, setAppointmentRates] = React.useState<AppointmentRate[]>([]);
  const [examsRates, setExamsRates] = React.useState<ExamRate[]>([]);
  const [proceduresRates, setProceduresRates] = React.useState<ProcedureRate[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [apiError, setApiError] = React.useState('');

  const [view, setView] = React.useState<'list' | 'phase1' | 'phase2' | 'phase3'>('list');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dniInput, setDniInput] = React.useState('');
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
  const [requestType, setRequestType] = React.useState<'cita' | 'examen' | 'procedimiento' | null>(null);
  const [subSearchTerm, setSubSearchTerm] = React.useState('');

  const [modalMode, setModalMode] = React.useState<'view' | 'edit' | null>(null);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<any>({});

  const loadData = React.useCallback(async (term: string, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [appData, patData, appRatesData, exRatesData, procRatesData] = await Promise.all([
        fetchAppointments(term),
        fetchPatients(),
        fetchAppointmentRates(),
        fetchExamRates(),
        fetchProcedureRates()
      ]);
      setAppointments(appData);
      setPatientsCatalog(patData);
      setAppointmentRates(appRatesData);
      setExamsRates(exRatesData);
      setProceduresRates(procRatesData);
      setApiError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar los datos.';
      setApiError(message);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData(searchTerm, true);
  }, [searchTerm, loadData]);

  const handleOpenModal = (mode: 'view' | 'edit', app: Appointment) => {
    setModalMode(mode);
    setSelectedAppointment(app);
    setFormData({
      ...app,
      patient: app.patientName,
      dni: app.patientDni
    });
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedAppointment(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedAppointment) return;
    setIsSaving(true);
    try {
      await updateAppointment(selectedAppointment.id, {
        patientId: formData.patientId,
        serviceId: formData.serviceId,
        status: formData.status as 'EN ESPERA' | 'COMPLETADA' | 'CANCELADA',
        dateTime: formData.dateTime
      });
      await loadData(searchTerm, false);
      handleCloseModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar la cita.';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      setIsSaving(true);
      try {
        await deleteAppointment(deleteId);
        await loadData(searchTerm, false);
        setDeleteId(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al eliminar la cita.';
        alert(message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleStartRegistration = () => {
    setDniInput('');
    setSelectedPatient(null);
    setRequestType(null);
    setSubSearchTerm('');
    setView('phase1');
  };

  const handlePhase1Continue = () => {
    const patient = patientsCatalog.find(p => p.dni === dniInput);
    if (patient) {
      setSelectedPatient(patient);
      setView('phase2');
    } else {
      alert('Por favor registre al paciente en el sistema primero (Módulo Gestión de Pacientes)');
    }
  };

  const handlePhase2Select = (type: 'cita' | 'examen' | 'procedimiento') => {
    setRequestType(type);
    setView('phase3');
  };

  const handleRegisterAppointment = async (item: any) => {
    if (!selectedPatient) return;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    setIsSaving(true);
    try {
      await createAppointment({
        patientId: selectedPatient.id,
        serviceId: item.serviceId || item.id, // serviceId for DB
        status: 'EN ESPERA',
        dateTime: formattedDate
      });
      await loadData(searchTerm, false);
      setView('list');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar la cita.';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const currentRates = requestType === 'cita' ? appointmentRates :
    requestType === 'examen' ? examsRates :
      requestType === 'procedimiento' ? proceduresRates : [];

  const filteredSubRates = currentRates.filter(r =>
    r.name.toLowerCase().includes(subSearchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter(app => !userDni || app.patientDni === userDni);

  if (view === 'phase1') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto mt-20 space-y-8">
        <div className="bg-dash-panel p-10 rounded-3xl border border-dash-border shadow-2xl text-center">
          <div className="w-16 h-16 bg-dash-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="text-dash-accent" size={32} />
          </div>
          <h2 className="text-xl font-bold text-dash-text uppercase tracking-widest mb-2">Validación de Paciente</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mb-8">Fase 1: Ingrese identificación oficial</p>

          <div className="space-y-6">
            <div className="text-left space-y-2">
              <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">DNI del Paciente</label>
              <input
                type="text"
                value={dniInput}
                onChange={(e) => setDniInput(e.target.value)}
                placeholder="Introduzca DNI..."
                className="w-full bg-dash-glass border border-dash-border rounded-2xl px-6 py-4 text-sm text-dash-text outline-none focus:border-dash-accent transition-all text-center font-bold tracking-[0.2em]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setView('list')}
                className="flex-1 px-6 py-4 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePhase1Continue}
                className="flex-1 bg-dash-accent text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-dash-accent/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (view === 'phase2') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto mt-20 space-y-8 text-center">
        <div className="bg-dash-panel p-10 rounded-3xl border border-dash-border shadow-2xl">
          <div className="mb-10">
            <span className="text-[10px] font-bold text-dash-accent uppercase tracking-[0.3em] bg-dash-accent/10 px-4 py-1.5 rounded-full mb-4 inline-block">Fase 2: Tipo de Servicio</span>
            <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight mt-4">¿Qué desea solicitar para el paciente?</h2>
            <p className="text-dash-text-dim text-sm mt-2 font-medium">Paciente: <span className="text-dash-accent font-bold uppercase">{selectedPatient?.name}</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button
              onClick={() => handlePhase2Select('cita')}
              className="flex flex-col items-center gap-4 p-8 bg-dash-glass border border-dash-border rounded-3xl hover:border-dash-accent hover:bg-dash-accent/5 transition-all group"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="text-blue-500" size={28} />
              </div>
              <span className="text-[11px] font-bold text-dash-text uppercase tracking-widest">Solicitar Cita</span>
            </button>

            <button
              onClick={() => handlePhase2Select('examen')}
              className="flex flex-col items-center gap-4 p-8 bg-dash-glass border border-dash-border rounded-3xl hover:border-dash-accent hover:bg-dash-accent/5 transition-all group"
            >
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="text-purple-500" size={28} />
              </div>
              <span className="text-[11px] font-bold text-dash-text uppercase tracking-widest">Solicitar Examen</span>
            </button>

            <button
              onClick={() => handlePhase2Select('procedimiento')}
              className="flex flex-col items-center gap-4 p-8 bg-dash-glass border border-dash-border rounded-3xl hover:border-dash-accent hover:bg-dash-accent/5 transition-all group"
            >
              <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="text-teal-500" size={28} />
              </div>
              <span className="text-[11px] font-bold text-dash-text uppercase tracking-widest">Solicitar Procedimiento</span>
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-dash-border">
            <button
              onClick={() => setView('phase1')}
              className="text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
            >
              Regresar al DNI
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (view === 'phase3') {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-dash-accent uppercase tracking-widest bg-dash-accent/10 px-3 py-1 rounded-full">Fase 3: Selección de Tarifa</span>
              <span className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest">•</span>
              <span className="text-[10px] font-bold text-dash-text uppercase tracking-widest">Paciente: {selectedPatient?.name}</span>
            </div>
            <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Seleccione el Servicio a Registrar</h2>
          </div>
          <button
            onClick={() => setView('phase2')}
            className="bg-dash-glass border border-dash-border text-dash-text px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:border-dash-accent transition-all flex items-center gap-2"
          >
            Regresar
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder={`Buscar en lista de ${requestType === 'cita' ? 'tarifas de citas' : requestType === 'examen' ? 'exámenes' : 'procedimientos'}...`}
            value={subSearchTerm}
            onChange={(e) => setSubSearchTerm(e.target.value)}
            className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
        </div>

        <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dash-border bg-dash-glass/50">
                <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Nombre Servicio</th>
                <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Precio</th>
                <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dash-border">
              {filteredSubRates.length > 0 ? (
                filteredSubRates.map((item) => (
                  <tr key={item.id} className="hover:bg-dash-glass transition-colors group">
                    <td className="px-8 py-6 text-xs font-mono text-dash-accent">{item.id}</td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-dash-text">{item.name}</span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-dash-text italic">{item.price}</td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleRegisterAppointment(item)}
                        className="bg-dash-accent/10 border border-dash-accent/30 text-dash-accent px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-dash-accent hover:text-white transition-all shadow-sm"
                      >
                        Registrar Cita
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                    No se encontraron servicios disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex justify-between items-center bg-dash-panel p-8 rounded-3xl border border-dash-border">
        <div>
          <h2 className="text-2xl font-bold text-dash-text uppercase tracking-tight">Gestión de Citas / Servicios</h2>
          <p className="text-dash-text-dim text-xs uppercase tracking-widest mt-1">Control de agendas y programación de atención SIGHOS</p>
        </div>
        <button
          onClick={handleStartRegistration}
          className="bg-dash-accent text-white px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2"
        >
          <Calendar size={18} />
          Nueva Cita
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por paciente o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dash-panel border border-dash-border focus:border-dash-accent/50 rounded-2xl py-4 pl-14 pr-4 transition-all text-sm outline-none text-dash-text placeholder:text-dash-text-dim/50 shadow-lg"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-dash-accent" size={20} />
      </div>

      <div className="bg-dash-panel rounded-3xl border border-dash-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dash-border bg-dash-glass/50">
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">ID Cita</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Paciente</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">DNI</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Servicio Solicitado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Fecha/Hora Registro</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-5 text-[10px] font-bold text-dash-text-dim uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  Cargando citas...
                </td>
              </tr>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((app: Appointment) => (
                <tr key={app.id} className="hover:bg-dash-glass transition-colors group">
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent">CT-{String(app.id).padStart(3, '0')}</td>
                  <td className="px-8 py-6 font-bold text-sm text-dash-text uppercase tracking-tight">{app.patientName}</td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim underline decoration-dash-accent/30">{app.patientDni}</td>
                  <td className="px-8 py-6 text-sm text-dash-text-dim font-medium italic">{app.serviceName}</td>
                  <td className="px-8 py-6 text-xs font-mono text-dash-accent">
                    {app.dateTime ? new Date(app.dateTime).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${app.status === 'EN ESPERA'
                        ? 'border-dash-accent/30 text-dash-accent bg-dash-accent/10 shadow-[0_0_8px_var(--color-dash-accent-10)]'
                        : app.status === 'COMPLETADA'
                          ? 'border-dash-success/30 text-dash-success bg-dash-success/10'
                          : 'border-dash-danger/30 text-dash-danger bg-dash-danger/10'
                      }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal('view', app)}
                        className="p-2 bg-dash-glass border border-dash-border rounded-lg text-dash-text-dim hover:text-dash-accent transition-all shadow-sm"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-8 py-10 text-center text-dash-text-dim italic text-sm">
                  No se registraron movimientos recientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {modalMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dash-bg/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dash-panel border border-dash-border w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dash-border flex justify-between items-center bg-dash-glass/30">
              <h3 className="text-sm font-bold text-dash-accent uppercase tracking-[0.2em]">
                {modalMode === 'view' ? 'Detalles de la Cita' : 'Editar Cita / Servicio'}
              </h3>
              <button onClick={handleCloseModal} className="text-dash-text-dim hover:text-dash-danger transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">ID Cita</label>
                  <input
                    disabled
                    value={formData.id ? `CT-${String(formData.id).padStart(3, '0')}` : ''}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-xs text-dash-accent font-mono outline-none opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Estado</label>
                  <select
                    name="status"
                    disabled={modalMode === 'view'}
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-xs text-dash-text outline-none focus:border-dash-accent transition-all appearance-none uppercase font-bold"
                  >
                    <option value="EN ESPERA">EN ESPERA</option>
                    <option value="COMPLETADA">COMPLETADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Paciente</label>
                <input
                  disabled
                  value={formData.patient}
                  className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-xs text-dash-text font-bold uppercase outline-none opacity-80"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">DNI</label>
                  <input
                    disabled
                    value={formData.dni}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-xs text-dash-text-dim outline-none opacity-80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Fecha/Hora</label>
                  <input
                    disabled
                    value={formData.dateTime ? new Date(formData.dateTime).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-xs text-dash-accent font-mono outline-none opacity-80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Tipo de Servicio</label>
                  <input
                    disabled
                    value={formData.serviceType}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-xs text-dash-accent font-bold uppercase outline-none opacity-80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dash-text-dim uppercase tracking-widest pl-1">Nombre del Servicio</label>
                  <input
                    disabled
                    value={formData.serviceName}
                    className="w-full bg-dash-glass border border-dash-border rounded-xl px-4 py-2.5 text-xs text-dash-text font-bold uppercase outline-none opacity-80"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-dash-border bg-dash-glass/10 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 text-xs font-bold text-dash-text-dim uppercase tracking-widest hover:text-dash-text transition-colors"
              >
                {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
              </button>
              {modalMode === 'edit' && (
                <button
                  onClick={handleSave}
                  className="bg-dash-accent text-white px-8 py-2 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-110 transition-all"
                >
                  Guardar Cambios
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

