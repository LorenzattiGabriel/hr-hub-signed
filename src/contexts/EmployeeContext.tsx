import { createContext, useContext, useState, ReactNode } from 'react';

interface Employee {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  cuil?: string;
  cargo: string;
  sector: string;
  tipoContrato: string;
  fechaIngreso: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  direccion: string;
  salario: number;
  estadoCivil: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  parentescoEmergencia: string;
  estado: string;
  nivelEducativo?: string;
  titulo?: string;
  otrosConocimientos?: string;
  grupoSanguineo?: string;
  alergias?: string;
  medicacionHabitual?: string;
  obraSocial?: string;
  observaciones?: string;
  tieneHijos?: string;
  nombresHijos?: string;
  tieneLicencia?: string;
  tipoLicencia?: string;
  fotoDni?: File | null;
  fotoCarnet?: File | null;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  getActiveEmployees: () => Employee[];
  importEmployees: (employees: Omit<Employee, 'id'>[]) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const getStoredEmployees = (): Employee[] => {
  try {
    const stored = localStorage.getItem('employees');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialEmployees: Employee[] = getStoredEmployees();

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newId = Math.max(0, ...employees.map(e => e.id)) + 1;
    const newEmployees = [{ ...employee, id: newId }, ...employees];
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees, (key, value) => (key === 'fotoDni' || key === 'fotoCarnet' ? undefined : value)));
  };

  const updateEmployee = (id: number, updatedEmployee: Partial<Employee>) => {
    const newEmployees = employees.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp);
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees, (key, value) => (key === 'fotoDni' || key === 'fotoCarnet' ? undefined : value)));
  };

  const deleteEmployee = (id: number) => {
    const newEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees, (key, value) => (key === 'fotoDni' || key === 'fotoCarnet' ? undefined : value)));
  };

  const getActiveEmployees = () => {
    return employees.filter(emp => emp.estado === "activo");
  };

  const importEmployees = (newEmployees: Omit<Employee, 'id'>[]) => {
    const normalizeDni = (dni: string) => String(dni ?? '').trim();

    // Evitar duplicados: primero limpiar duplicados dentro del lote nuevo
    const seenBatch = new Set<string>();
    const uniqueBatch = newEmployees.filter(emp => {
      const k = normalizeDni(emp.dni);
      if (!k) return false;
      if (seenBatch.has(k)) return false;
      seenBatch.add(k);
      return true;
    });

    // Evitar duplicados respecto a los existentes
    const existingDnis = new Set(employees.map(e => normalizeDni(e.dni)));
    const trulyNew = uniqueBatch.filter(emp => !existingDnis.has(normalizeDni(emp.dni)));

    if (trulyNew.length === 0) {
      return; // Nada que agregar
    }

    const maxId = Math.max(0, ...employees.map(e => e.id));
    const employeesWithIds = trulyNew.map((emp, index) => ({
      ...emp,
      id: maxId + index + 1,
    }));

    const updatedEmployees = [...employees, ...employeesWithIds];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees, (key, value) => (key === 'fotoDni' || key === 'fotoCarnet' ? undefined : value)));
  };

  return (
    <EmployeeContext.Provider value={{ 
      employees, 
      addEmployee, 
      updateEmployee, 
      deleteEmployee,
      getActiveEmployees,
      importEmployees
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

export type { Employee };