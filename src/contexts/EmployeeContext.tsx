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

const initialEmployees: Employee[] = [];

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newId = Math.max(0, ...employees.map(e => e.id)) + 1;
    setEmployees(prev => [{ ...employee, id: newId }, ...prev]);
  };

  const updateEmployee = (id: number, updatedEmployee: Partial<Employee>) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp)
    );
  };

  const deleteEmployee = (id: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
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