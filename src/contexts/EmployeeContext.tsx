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
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const updateEmployee = (id: number, updatedEmployee: Partial<Employee>) => {
    const newEmployees = employees.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp);
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const deleteEmployee = (id: number) => {
    const newEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const getActiveEmployees = () => {
    return employees.filter(emp => emp.estado === "activo");
  };

  return (
    <EmployeeContext.Provider value={{ 
      employees, 
      addEmployee, 
      updateEmployee, 
      deleteEmployee,
      getActiveEmployees 
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