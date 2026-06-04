export type UserRole = 'ADMINISTRADOR' | 'EMPLEADO' | 'RECEPCIONISTA' | 'CLIENTE';

export interface AuthUser {
  workerId: number;
  dni: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact1?: string;
  emergencyContact2?: string;
  role: UserRole | string;
  password: string;
}

interface ServerAppointmentRate {
  id_servicio: number;
  codigo_display: string | null;
  nombre: string;
  tipo: 'CONSULTA' | 'EXAMEN' | 'PROCEDIMIENTO';
  especialidad: string;
  id_especialidad: number;
  precio: string | number;
  descripcion: string | null;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface AppointmentRate {
  id: string;
  serviceId: number;
  code: string;
  name: string;
  specialty: string;
  price: string;
  status: 'Activo' | 'Inactivo';
  description: string;
}

export interface AppointmentRatePayload {
  name: string;
  specialty: string;
  price: string | number;
  status: 'Activo' | 'Inactivo';
  description: string;
}

export type ExamRate = AppointmentRate;
export type ExamRatePayload = AppointmentRatePayload;

const API_BASE = '/api';

const toVisualRateId = (serviceId: number) => `TR-${String(serviceId).padStart(3, '0')}`;

const toNumberPrice = (rawPrice: string | number) => {
  if (typeof rawPrice === 'number') {
    return Number(rawPrice.toFixed(2));
  }

  const normalized = rawPrice.replace(/[^\d,.-]/g, '').replace(',', '.');
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error('Formato de precio invalido.');
  }

  return Number(parsed.toFixed(2));
};

const toPriceString = (rawPrice: string | number) => `S/ ${toNumberPrice(rawPrice).toFixed(2)}`;

const mapRateFromServer = (rate: ServerAppointmentRate): AppointmentRate => ({
  id: toVisualRateId(rate.id_servicio),
  serviceId: rate.id_servicio,
  code: rate.codigo_display || '',
  name: rate.nombre,
  specialty: rate.especialidad,
  price: toPriceString(rate.precio),
  status: rate.estado === 'INACTIVO' ? 'Inactivo' : 'Activo',
  description: rate.descripcion || '',
});

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error || 'No se pudo completar la solicitud.';
    throw new Error(message);
  }

  return payload as T;
};

export const login = async (dni: string, password: string): Promise<AuthUser> => {
  const data = await request<{ user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ dni, password }),
  });

  return data.user;
};

export const loginClient = async (dni: string, password: string): Promise<AuthUser> => {
  const data = await request<{ user: AuthUser }>('/auth/client-login', {
    method: 'POST',
    body: JSON.stringify({ dni, password }),
  });

  return data.user;
};

export const updateProfile = async (
  workerId: number,
  payload: { phone: string; email: string; address: string }
): Promise<void> => {
  await request<{ success: boolean }>(`/profile/${workerId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const updatePassword = async (
  workerId: number,
  payload: { currentPassword: string; newPassword: string }
): Promise<void> => {
  await request<{ success: boolean }>(`/profile/${workerId}/password`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const updateClientProfile = async (
  patientId: number,
  payload: { phone: string; email: string; address: string; emergencyContact1: string; emergencyContact2: string }
): Promise<void> => {
  await request<{ success: boolean }>(`/client-profile/${patientId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const updateClientPassword = async (
  patientId: number,
  payload: { currentPassword: string; newPassword: string }
): Promise<void> => {
  await request<{ success: boolean }>(`/client-profile/${patientId}/password`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export interface DashboardStats {
  citasMes: number;
  ingresosHoy: number;
  ingresosMes: number;
  gastosMes: number;
  enEspera: number;
  completadasMes: number;
  topServices: { name: string; value: number }[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  return await request<DashboardStats>('/dashboard-stats');
};


export const fetchAppointmentRates = async (searchTerm = ''): Promise<AppointmentRate[]> => {
  const params = new URLSearchParams();

  if (searchTerm.trim()) {
    params.set('search', searchTerm.trim());
  }

  const queryString = params.toString();
  const path = queryString ? `/appointment-rates?${queryString}` : '/appointment-rates';

  const data = await request<{ rates: ServerAppointmentRate[] }>(path);
  return data.rates.map(mapRateFromServer);
};

export const createAppointmentRate = async (
  payload: AppointmentRatePayload,
): Promise<AppointmentRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>('/appointment-rates', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      price: toNumberPrice(payload.price),
    }),
  });

  return mapRateFromServer(data.rate);
};

export const updateAppointmentRate = async (
  serviceId: number,
  payload: AppointmentRatePayload,
): Promise<AppointmentRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/appointment-rates/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...payload,
      price: toNumberPrice(payload.price),
    }),
  });

  return mapRateFromServer(data.rate);
};

export const updateAppointmentRateStatus = async (
  serviceId: number,
  status: 'Activo' | 'Inactivo',
): Promise<AppointmentRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/appointment-rates/${serviceId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return mapRateFromServer(data.rate);
};

export const softDeleteAppointmentRate = async (serviceId: number): Promise<AppointmentRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/appointment-rates/${serviceId}`, {
    method: 'DELETE',
  });

  return mapRateFromServer(data.rate);
};

export const fetchExamRates = async (searchTerm = ''): Promise<ExamRate[]> => {
  const params = new URLSearchParams();

  if (searchTerm.trim()) {
    params.set('search', searchTerm.trim());
  }

  const queryString = params.toString();
  const path = queryString ? `/exam-rates?${queryString}` : '/exam-rates';

  const data = await request<{ rates: ServerAppointmentRate[] }>(path);
  return data.rates.map(mapRateFromServer);
};

export const createExamRate = async (
  payload: ExamRatePayload,
): Promise<ExamRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>('/exam-rates', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      price: toNumberPrice(payload.price),
    }),
  });

  return mapRateFromServer(data.rate);
};

export const updateExamRate = async (
  serviceId: number,
  payload: ExamRatePayload,
): Promise<ExamRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/exam-rates/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...payload,
      price: toNumberPrice(payload.price),
    }),
  });

  return mapRateFromServer(data.rate);
};

export const updateExamRateStatus = async (
  serviceId: number,
  status: 'Activo' | 'Inactivo',
): Promise<ExamRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/exam-rates/${serviceId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return mapRateFromServer(data.rate);
};

export const softDeleteExamRate = async (serviceId: number): Promise<ExamRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/exam-rates/${serviceId}`, {
    method: 'DELETE',
  });

  return mapRateFromServer(data.rate);
};

// --- PROCEDURE RATES ---

export type ProcedureRate = AppointmentRate;
export type ProcedureRatePayload = AppointmentRatePayload;

export const fetchProcedureRates = async (searchTerm: string = ''): Promise<ProcedureRate[]> => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  const data = await request<{ rates: ServerAppointmentRate[] }>(`/procedure-rates${query}`);
  return data.rates.map(mapRateFromServer);
};

export const createProcedureRate = async (payload: ProcedureRatePayload): Promise<ProcedureRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>('/procedure-rates', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      price: toNumberPrice(payload.price),
    }),
  });

  return mapRateFromServer(data.rate);
};

export const updateProcedureRate = async (
  serviceId: number,
  payload: ProcedureRatePayload,
): Promise<ProcedureRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/procedure-rates/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...payload,
      price: toNumberPrice(payload.price),
    }),
  });

  return mapRateFromServer(data.rate);
};

export const updateProcedureRateStatus = async (
  serviceId: number,
  status: 'Activo' | 'Inactivo',
): Promise<ProcedureRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/procedure-rates/${serviceId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  return mapRateFromServer(data.rate);
};

export const softDeleteProcedureRate = async (serviceId: number): Promise<ProcedureRate> => {
  const data = await request<{ rate: ServerAppointmentRate }>(`/procedure-rates/${serviceId}`, {
    method: 'DELETE',
  });

  return mapRateFromServer(data.rate);
};

// --- SPECIALTIES ---

export type Specialty = {
  id: number;
  name: string;
};

export type SpecialtyFull = Specialty & {
  description: string;
  status: 'Activo' | 'Inactivo';
};

export type SpecialtyPayload = {
  name: string;
  description: string;
  status: 'Activo' | 'Inactivo';
};

const mapSpecialtyFromServer = (s: any): SpecialtyFull => ({
  id: s.id,
  name: s.name,
  description: s.description || '',
  status: s.status === 'INACTIVO' ? 'Inactivo' : 'Activo',
});

export const fetchSpecialties = async (searchTerm: string = ''): Promise<SpecialtyFull[]> => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  const data = await request<{ specialties: any[] }>(`/specialties${query}`);
  return data.specialties.map(mapSpecialtyFromServer);
};

export const createSpecialty = async (payload: SpecialtyPayload): Promise<SpecialtyFull> => {
  const data = await request<{ specialty: any }>('/specialties', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapSpecialtyFromServer(data.specialty);
};

export const updateSpecialty = async (id: number, payload: SpecialtyPayload): Promise<SpecialtyFull> => {
  const data = await request<{ specialty: any }>(`/specialties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapSpecialtyFromServer(data.specialty);
};

export const updateSpecialtyStatus = async (id: number, status: 'Activo' | 'Inactivo'): Promise<SpecialtyFull> => {
  const data = await request<{ specialty: any }>(`/specialties/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return mapSpecialtyFromServer(data.specialty);
};

export const softDeleteSpecialty = async (id: number): Promise<SpecialtyFull> => {
  const data = await request<{ specialty: any }>(`/specialties/${id}`, {
    method: 'DELETE',
  });
  return mapSpecialtyFromServer(data.specialty);
};

// --- PATIENTS ---
export type Patient = {
  id: number;
  dni: string;
  name: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact1: string;
  emergencyContact2: string;
  password?: string;
};

export type PatientPayload = Omit<Patient, 'id'>;

const mapPatientFromServer = (p: any): Patient => ({
  id: p.id,
  dni: p.dni || '',
  name: p.name || '',
  gender: p.gender || '',
  birthDate: p.birthDate || '',
  phone: p.phone || '',
  email: p.email || '',
  address: p.address || '',
  emergencyContact1: p.emergencyContact1 || '',
  emergencyContact2: p.emergencyContact2 || '',
  password: p.password || '',
});

export const fetchPatients = async (searchTerm: string = ''): Promise<Patient[]> => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  const data = await request<{ patients: any[] }>(`/patients${query}`);
  return data.patients.map(mapPatientFromServer);
};

export const createPatient = async (payload: PatientPayload): Promise<Patient> => {
  const data = await request<{ patient: any }>('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapPatientFromServer(data.patient);
};

export const updatePatient = async (id: number, payload: PatientPayload): Promise<Patient> => {
  const data = await request<{ patient: any }>(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapPatientFromServer(data.patient);
};

export const deletePatient = async (id: number): Promise<void> => {
  await request<{ success: boolean }>(`/patients/${id}`, {
    method: 'DELETE',
  });
};

// --- STAFF ---
export type Staff = {
  id: number;
  dni: string;
  name: string;
  specialtyId: number | null;
  specialtyName: string;
  status: string;
  phone: string;
  email: string;
  address: string;
  salary: number;
  userRole: string;
  password?: string;
};

export type StaffPayload = Omit<Staff, 'id' | 'specialtyName'>;

const mapStaffFromServer = (s: any): Staff => ({
  id: s.id,
  dni: s.dni || '',
  name: s.name || '',
  specialtyId: s.specialtyId || null,
  specialtyName: s.specialtyName || '',
  status: s.status || 'ACTIVO',
  phone: s.phone || '',
  email: s.email || '',
  address: s.address || '',
  salary: s.salary !== null ? Number(s.salary) : 0,
  userRole: s.userRole || 'EMPLEADO',
  password: s.password || '',
});

export const fetchStaff = async (searchTerm: string = ''): Promise<Staff[]> => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  const data = await request<{ staff: any[] }>(`/staff${query}`);
  return data.staff.map(mapStaffFromServer);
};

export const createStaff = async (payload: StaffPayload): Promise<Staff> => {
  const data = await request<{ staff: any }>('/staff', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapStaffFromServer(data.staff);
};

export const updateStaff = async (id: number, payload: StaffPayload): Promise<Staff> => {
  const data = await request<{ staff: any }>(`/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapStaffFromServer(data.staff);
};

export const deleteStaff = async (id: number): Promise<void> => {
  await request<{ success: boolean }>(`/staff/${id}`, {
    method: 'DELETE',
  });
};

// --- APPOINTMENTS ---

export interface Appointment {
  id: number;
  patientId: number;
  patientDni: string;
  patientName: string;
  serviceId: number;
  serviceName: string;
  serviceType: string;
  servicePrice: number;
  status: 'EN ESPERA' | 'COMPLETADA' | 'CANCELADA';
  dateTime: string;
}

export interface AppointmentPayload {
  patientId: number;
  serviceId: number;
  status: 'EN ESPERA' | 'COMPLETADA' | 'CANCELADA';
  dateTime: string;
}

const mapAppointmentFromServer = (a: any): Appointment => ({
  id: a.id,
  patientId: a.patientId,
  patientDni: a.patientDni || '',
  patientName: a.patientName || '',
  serviceId: a.serviceId,
  serviceName: a.serviceName || '',
  serviceType: a.serviceType || '',
  servicePrice: a.servicePrice !== null ? Number(a.servicePrice) : 0,
  status: a.status || 'EN ESPERA',
  dateTime: a.dateTime || '',
});

export const fetchAppointments = async (searchTerm = ''): Promise<Appointment[]> => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  const data = await request<{ appointments: any[] }>(`/appointments${query}`);
  return data.appointments.map(mapAppointmentFromServer);
};

export const createAppointment = async (payload: AppointmentPayload): Promise<Appointment> => {
  const data = await request<{ appointment: any }>('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapAppointmentFromServer(data.appointment);
};

export const updateAppointment = async (id: number, payload: AppointmentPayload): Promise<Appointment> => {
  const data = await request<{ appointment: any }>(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapAppointmentFromServer(data.appointment);
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await request<{ success: boolean }>(`/appointments/${id}`, {
    method: 'DELETE',
  });
};

// --- MEDICAL HISTORIES ---

export interface MedicalHistory {
  id: number;
  date: string;
  patientId: number;
  patientDni: string;
  patientName: string;
  doctorId: number;
  doctorName: string;
  weight: number;
  height: number;
  findings: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  procedures: string;
}

export interface MedicalHistoryPayload {
  patientId: number;
  doctorId: number;
  weight?: number;
  height?: number;
  findings?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  procedures?: string;
}

const mapMedicalHistoryFromServer = (h: any): MedicalHistory => ({
  id: h.id,
  date: h.date ? new Date(h.date).toLocaleDateString('es-PE', { timeZone: 'UTC' }) : '',
  patientId: h.patientId,
  patientDni: h.patientDni || '',
  patientName: h.patientName || '',
  doctorId: h.doctorId,
  doctorName: h.doctorName || '',
  weight: h.weight !== null ? Number(h.weight) : 0,
  height: h.height !== null ? Number(h.height) : 0,
  findings: h.findings || '',
  diagnosis: h.diagnosis || '',
  treatment: h.treatment || '',
  medications: h.medications || '',
  procedures: h.procedures || '',
});

export const fetchMedicalHistories = async (searchTerm = ''): Promise<MedicalHistory[]> => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  const data = await request<{ histories: any[] }>(`/medical-histories${query}`);
  return data.histories.map(mapMedicalHistoryFromServer);
};

export const fetchDigitizedHistories = async (searchTerm = ''): Promise<MedicalHistory[]> => {
  const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
  const data = await request<{ histories: any[] }>(`/digitized-histories${query}`);
  return data.histories.map(mapMedicalHistoryFromServer);
};

export const approveDigitizedHistory = async (id: number, doctorId: number): Promise<{ success: boolean; newHistoryId: number }> => {
  return await request<{ success: boolean; newHistoryId: number }>(`/digitized-histories/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ doctorId }),
  });
};

export const rejectDigitizedHistory = async (id: number): Promise<void> => {
  await request<{ success: boolean }>(`/digitized-histories/${id}`, {
    method: 'DELETE',
  });
};

export const createMedicalHistory = async (payload: MedicalHistoryPayload): Promise<MedicalHistory> => {
  const data = await request<{ history: any }>('/medical-histories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapMedicalHistoryFromServer(data.history);
};

export const updateMedicalHistory = async (id: number, payload: MedicalHistoryPayload): Promise<MedicalHistory> => {
  const data = await request<{ history: any }>(`/medical-histories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapMedicalHistoryFromServer(data.history);
};

export const deleteMedicalHistory = async (id: number): Promise<void> => {
  await request<{ success: boolean }>(`/medical-histories/${id}`, {
    method: 'DELETE',
  });
};

// --- WORK SCHEDULES ---

export interface WorkSchedule {
  id: number;
  specialtyId: number;
  specialtyName: string;
  month: number;
  year: number;
  morningWorkerId: number | null;
  morningWorkerName: string | null;
  afternoonWorkerId: number | null;
  afternoonWorkerName: string | null;
}

export interface WorkSchedulePayload {
  specialtyId: number;
  month: number;
  year: number;
  morningWorkerId?: number | null;
  afternoonWorkerId?: number | null;
}

const mapWorkScheduleFromServer = (s: any): WorkSchedule => ({
  id: s.id,
  specialtyId: s.specialtyId,
  specialtyName: s.specialtyName || '',
  month: Number(s.month),
  year: Number(s.year),
  morningWorkerId: s.morningWorkerId || null,
  morningWorkerName: s.morningWorkerName || null,
  afternoonWorkerId: s.afternoonWorkerId || null,
  afternoonWorkerName: s.afternoonWorkerName || null,
});

export const fetchWorkSchedules = async (): Promise<WorkSchedule[]> => {
  const data = await request<{ schedules: any[] }>('/work-schedules');
  return data.schedules.map(mapWorkScheduleFromServer);
};

export const saveWorkSchedule = async (payload: WorkSchedulePayload): Promise<WorkSchedule> => {
  const data = await request<{ schedule: any }>('/work-schedules', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapWorkScheduleFromServer(data.schedule);
};

export const deleteWorkSchedule = async (id: number): Promise<void> => {
  await request<{ success: boolean }>(`/work-schedules/${id}`, {
    method: 'DELETE',
  });
};

export interface FailedDigitization {
  id: number;
  fileName: string;
  fileType: string;
  date: string;
}

export const fetchFailedDigitizations = async (): Promise<FailedDigitization[]> => {
  const data = await request<{ failedDigitizations: FailedDigitization[] }>(`/failed-digitizations`);
  return data.failedDigitizations;
};

export const deleteFailedDigitization = async (id: number): Promise<void> => {
  await request<{ success: boolean }>(`/failed-digitizations/${id}`, {
    method: 'DELETE',
  });
};
