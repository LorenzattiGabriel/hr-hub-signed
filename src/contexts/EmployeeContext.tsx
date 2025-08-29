import { createContext, useContext, useState, ReactNode } from 'react';

interface Employee {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  cuil?: string;
  cargo: string;
  sector: string;
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

const initialEmployees: Employee[] = [
  {
    id: 1,
    nombres: "Noelia Belén",
    apellidos: "Ludueña",
    dni: "35.832.688",
    cuil: "27-35832688-4",
    cargo: "operario-produccion",
    sector: "produccion",
    fechaIngreso: "2024-05-25",
    fechaNacimiento: "1993-12-30",
    telefono: "3525-406695",
    email: "belenludueña8@gmail.com",
    direccion: "Zona Rural. El Crispin",
    salario: 450000,
    estadoCivil: "casado",
    contactoEmergencia: "Óscar Sánchez",
    telefonoEmergencia: "3574-638038",
    parentescoEmergencia: "conyuge",
    estado: "activo",
    nivelEducativo: "secundario-completo",
    titulo: "No posee",
    otrosConocimientos: "Peluquería",
    grupoSanguineo: "AB+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "Sí (No especifica cuál)",
    observaciones: "Licencia de conducir tipo B2, vencimiento 30/3/2025. Hijos: Thomas Benjamin Sánchez (8 años), Ian Gael Sánchez (2 años)"
  },
  {
    id: 2,
    nombres: "Mariela Desiree",
    apellidos: "Díaz",
    dni: "41.279.664",
    cuil: "27-41279664-8",
    cargo: "operario-produccion",
    sector: "produccion",
    fechaIngreso: "2020-01-07",
    fechaNacimiento: "1997-09-24",
    telefono: "3574-412746",
    email: "marieladesiree27@gmail.com",
    direccion: "Barrio Delich, Zona Rural. Río Primero",
    salario: 450000,
    estadoCivil: "soltero",
    contactoEmergencia: "Mónica Mariela Vaca",
    telefonoEmergencia: "3516-195254",
    parentescoEmergencia: "madre",
    estado: "activo",
    nivelEducativo: "primario-completo",
    titulo: "No posee",
    otrosConocimientos: "-",
    grupoSanguineo: "O-",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "Sí (Sancor)",
    observaciones: "Licencia de conducir tipo B1, vencimiento 19/1/2029. Hijos: Thiago Quinteros (8 años)"
  },
  {
    id: 3,
    nombres: "Jorge Abel",
    apellidos: "Sandovares",
    dni: "27.921.696",
    cuil: "20-27921696-5",
    cargo: "chofer",
    sector: "administracion",
    fechaIngreso: "2009-06-23",
    fechaNacimiento: "1980-02-08",
    telefono: "3574-418354",
    email: "abelsandovares@gmail.com",
    direccion: "Achaval Rodríguez 263. Río Primero",
    salario: 520000,
    estadoCivil: "casado",
    contactoEmergencia: "Esposa",
    telefonoEmergencia: "3574-405554",
    parentescoEmergencia: "conyuge",
    estado: "inactivo",
    nivelEducativo: "secundario-completo",
    titulo: "No posee",
    otrosConocimientos: "-",
    grupoSanguineo: "A+",
    alergias: "No",
    medicacionHabitual: "Sí (Metformina)",
    obraSocial: "Sí (Sancor)",
    observaciones: "Licencia de conducir tipo E1, vencimiento 18/7/2025. Hijos: Victoria Moscati Mendoza (16 años), Rafael Sandovares (6 años), Bautista Sandovares (5 años)"
  },
  {
    id: 4,
    nombres: "Juan Sebastián",
    apellidos: "Peralta",
    dni: "39.581.105",
    cuil: "20-39581105-8",
    cargo: "operario-produccion",
    sector: "produccion",
    fechaIngreso: "2024-11-04",
    fechaNacimiento: "1996-02-14",
    telefono: "3574-409910",
    email: "jp4739391@gmail.com",
    direccion: "Av. Sarmiento 238",
    salario: 450000,
    estadoCivil: "union-convivencial",
    contactoEmergencia: "Ariane Acosta",
    telefonoEmergencia: "3574-638980",
    parentescoEmergencia: "conyuge",
    estado: "activo",
    nivelEducativo: "secundario-incompleto",
    titulo: "No posee",
    otrosConocimientos: "Panadería",
    grupoSanguineo: "B+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "No",
    observaciones: "Sin licencia de conducir. Hijos: Mohana Simone Peralta (3 años)"
  },
  {
    id: 5,
    nombres: "Gerardo Damián",
    apellidos: "Mateo",
    dni: "34.671.654",
    cuil: "20-34671654-7",
    cargo: "chofer",
    sector: "administracion",
    fechaIngreso: "2023-08-04",
    fechaNacimiento: "1989-10-23",
    telefono: "3574-651097",
    email: "gerardomateoonano@gmail.com",
    direccion: "Pasaje Rodolfo Senn 308. Río Primero",
    salario: 520000,
    estadoCivil: "union-convivencial",
    contactoEmergencia: "Amalia",
    telefonoEmergencia: "3573-467086",
    parentescoEmergencia: "conyuge",
    estado: "activo",
    nivelEducativo: "primario-completo",
    titulo: "No posee",
    otrosConocimientos: "-",
    grupoSanguineo: "O+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "Sí (Oscep)",
    observaciones: "Licencia de conducir, vencimiento 14/1/2025. Hijos: Bruno Mateo (10 años), Carolina Mateo (4 años), Emiliana Mateo (3 años)"
  },
  {
    id: 6,
    nombres: "María Virginia",
    apellidos: "Ludueña Malano",
    dni: "37.874.590",
    cuil: "27-37874590-6",
    cargo: "administracion",
    sector: "administracion",
    fechaIngreso: "2024-12-20",
    fechaNacimiento: "1994-09-13",
    telefono: "3574-414832",
    email: "mvirlm@gmail.com",
    direccion: "Belgrano 81. Río Primero",
    salario: 650000,
    estadoCivil: "soltero",
    contactoEmergencia: "Matías Ribetti",
    telefonoEmergencia: "3516-168269",
    parentescoEmergencia: "otro",
    estado: "inactivo",
    nivelEducativo: "universitario-completo",
    titulo: "Lic. en Administración",
    otrosConocimientos: "-",
    grupoSanguineo: "A+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "Sí (Met)",
    observaciones: "Licencia de conducir tipo B2, vencimiento 11/4/2029. Sin hijos"
  },
  {
    id: 7,
    nombres: "Gabriel Felipe",
    apellidos: "Farías",
    dni: "41.411.770",
    cuil: "20-41411770-9",
    cargo: "chofer",
    sector: "administracion",
    fechaIngreso: "2024-10-01",
    fechaNacimiento: "1999-01-26",
    telefono: "3574-418308",
    email: "gf41411770@gmail.com",
    direccion: "Cipriano Malgarejo 404. Río Primero",
    salario: 520000,
    estadoCivil: "soltero",
    contactoEmergencia: "Luciana",
    telefonoEmergencia: "3512-079199",
    parentescoEmergencia: "otro",
    estado: "inactivo",
    nivelEducativo: "secundario-completo",
    titulo: "No posee",
    otrosConocimientos: "-",
    grupoSanguineo: "A+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "Sí (Nobis)",
    observaciones: "Licencia de conducir tipo E1, vencimiento 25/4/2026. Hijos: Felipe Farías (4 años)"
  },
  {
    id: 8,
    nombres: "Marcelo Edgar",
    apellidos: "Mangold",
    dni: "40.026.130",
    cuil: "20-40026130-1",
    cargo: "operario-produccion",
    sector: "produccion",
    fechaIngreso: "2019-05-02",
    fechaNacimiento: "1997-01-20",
    telefono: "3533-418765",
    email: "mangoldmarceloedgar@gmail.com",
    direccion: "Zona Rural. Los Guindos",
    salario: 450000,
    estadoCivil: "soltero",
    contactoEmergencia: "Rocío Mangold",
    telefonoEmergencia: "3574-455584",
    parentescoEmergencia: "hermano",
    estado: "activo",
    nivelEducativo: "secundario-incompleto",
    titulo: "No posee",
    otrosConocimientos: "Tambo",
    grupoSanguineo: "O-",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "Sí (Osprera)",
    observaciones: "Licencia de conducir tipo B1, vencimiento 22/12/2025. Hijos: Pilar Alfonsina Mangold (2 años), Chloe Olivia Mangold (2 meses)"
  },
  {
    id: 9,
    nombres: "Edgar Alberto",
    apellidos: "Maidana",
    dni: "27.079.378",
    cuil: "20-27079378-2",
    cargo: "operario-mantenimiento",
    sector: "mantenimiento",
    fechaIngreso: "2025-02-08",
    fechaNacimiento: "1979-02-02",
    telefono: "3574-651443",
    email: "edgarmaidana.2279@gmail.com",
    direccion: "Belgrano 247",
    salario: 480000,
    estadoCivil: "soltero",
    contactoEmergencia: "Madre",
    telefonoEmergencia: "3574-652159",
    parentescoEmergencia: "madre",
    estado: "activo",
    nivelEducativo: "secundario-incompleto",
    titulo: "No posee",
    otrosConocimientos: "Soldadura, Construcción",
    grupoSanguineo: "O+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "No",
    observaciones: "Licencia de conducir tipo E1, vencimiento 11/5/2025. Sin hijos"
  },
  {
    id: 10,
    nombres: "Laura Roxana",
    apellidos: "Criado",
    dni: "25.089.374",
    cuil: "27-25089374-3",
    cargo: "operario-administracion",
    sector: "administracion",
    fechaIngreso: "2016-02-02",
    fechaNacimiento: "1976-10-27",
    telefono: "3574-401950",
    email: "laura_roxi33@hotmail.com",
    direccion: "José Tarditi 356",
    salario: 470000,
    estadoCivil: "soltero",
    contactoEmergencia: "Marcos Chialva",
    telefonoEmergencia: "3574-454579",
    parentescoEmergencia: "otro",
    estado: "activo",
    nivelEducativo: "secundario-completo",
    titulo: "No posee",
    otrosConocimientos: "-",
    grupoSanguineo: "A+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "Sí (Osprera)",
    observaciones: "Sin licencia de conducir. Sin hijos"
  },
  {
    id: 11,
    nombres: "Lucas Milton",
    apellidos: "Bonetto",
    dni: "38.020.563",
    cuil: "20-38020563-4",
    cargo: "chofer",
    sector: "administracion",
    fechaIngreso: "2025-07-14",
    fechaNacimiento: "1994-04-17",
    telefono: "3576-514566",
    email: "lucasbonetto1704@gmail.com",
    direccion: "Irigoyen 252",
    salario: 520000,
    estadoCivil: "soltero",
    contactoEmergencia: "María Inés Beltramone",
    telefonoEmergencia: "3576-471275",
    parentescoEmergencia: "madre",
    estado: "activo",
    nivelEducativo: "secundario-completo",
    titulo: "No posee",
    otrosConocimientos: "Inglés básico",
    grupoSanguineo: "AB+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "No",
    observaciones: "Licencia de conducir tipo E1, vencimiento 3/8/2028. Sin hijos"
  },
  {
    id: 12,
    nombres: "Daniel Ángel",
    apellidos: "Zenteno Choque",
    dni: "42.338.815",
    cuil: "20-42338815-6",
    cargo: "operario-produccion",
    sector: "produccion",
    fechaIngreso: "2025-07-23",
    fechaNacimiento: "1999-12-28",
    telefono: "3574-436540",
    email: "danielzentenozenteno4@gmail.com",
    direccion: "Zona Rural (loteo Delich) S/N",
    salario: 450000,
    estadoCivil: "soltero",
    contactoEmergencia: "Sandra",
    telefonoEmergencia: "3574-436650",
    parentescoEmergencia: "hermano",
    estado: "inactivo",
    nivelEducativo: "secundario-incompleto",
    titulo: "No posee",
    otrosConocimientos: "-",
    grupoSanguineo: "O+",
    alergias: "No",
    medicacionHabitual: "No",
    obraSocial: "No",
    observaciones: "Sin licencia de conducir. Sin hijos"
  }
];

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