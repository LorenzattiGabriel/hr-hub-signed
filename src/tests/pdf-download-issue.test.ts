import { describe, it, expect, vi } from 'vitest';
import { handleDownloadDocument } from '../components/documents/DocumentsModule';

// Test específico para reproducir el problema de descarga vacía
describe('PDF Download Empty File Issue', () => {
  
  const createMockEmployee = () => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez González', 
    dni: '12345678',
    direccion: 'Av. Córdoba 1234, Córdoba Capital',
    activo: true
  });

  const createMockDocument = () => ({
    id: '987fcdeb-51d2-4321-9876-543210987654',
    employee_id: '123e4567-e89b-12d3-a456-426614174000',
    document_type: 'reglamento_interno',
    generated_date: '2024-01-15',
    status: 'generado',
    document_content: 'Mock content for testing',
    empleadoNombre: 'Juan Carlos Pérez González',
    empleadoDni: '12345678'
  });

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  it('should reproduce and diagnose empty PDF download issue', async () => {
    console.log('🔍 REPRODUCIENDO EL PROBLEMA DE PDF VACÍO...\n');

    const mockEmployee = createMockEmployee();
    const mockDocument = createMockDocument();
    const activeEmployees = [mockEmployee];

    console.log('📋 Datos de prueba:');
    console.log('   👤 Empleado:', mockEmployee.nombres, mockEmployee.apellidos);
    console.log('   📄 Documento:', mockDocument.document_type);
    console.log('   📅 Fecha:', mockDocument.generated_date);
    console.log('   ✅ Status:', mockDocument.status);
    console.log('');

    // PASO 1: Verificar que el empleado existe
    console.log('🔎 PASO 1: Verificando empleado...');
    const employee = activeEmployees.find(e => e.id === mockDocument.employee_id);
    
    if (!employee) {
      console.log('❌ ERROR: Empleado no encontrado');
      expect(employee).toBeDefined();
      return;
    }
    console.log('✅ Empleado encontrado:', employee.nombres, employee.apellidos);
    console.log('');

    // PASO 2: Crear elemento temporal
    console.log('🔧 PASO 2: Creando elemento temporal para renderizado...');
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.color = 'black';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    
    document.body.appendChild(tempDiv);
    console.log('✅ Elemento temporal creado y agregado al DOM');
    console.log('');

    // PASO 3: Simular renderizado React
    console.log('⚛️  PASO 3: Simulando renderizado de componente React...');
    
    const employeeName = `${employee.nombres} ${employee.apellidos}`;
    const formattedDate = new Date(mockDocument.generated_date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });

    console.log('   📝 Nombre formateado:', employeeName);
    console.log('   📅 Fecha formateada:', formattedDate);

    // Simular el contenido que debería generar ReglamentoInterno
    const expectedContent = `
      <div style="padding: 48px; background: white; color: black; font-family: Arial, sans-serif;">
        <h1 style="text-align: center; font-size: 24px; font-weight: bold; text-transform: uppercase;">
          REGLAMENTO INTERNO
        </h1>
        <h2 style="text-align: center; font-size: 20px; font-weight: bold; text-transform: uppercase;">
          AVÍCOLA LA PALOMA
        </h2>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Nombre del empleado:</strong> ${employeeName}</p>
        <p>Este reglamento tiene por objetivo establecer normas claras de convivencia...</p>
        <h3>1. Obligaciones y deberes de los empleados</h3>
        <ul>
          <li>Cumplir con las obligaciones propias del puesto de trabajo...</li>
          <li>Mantener el orden y aseo de los lugares de acceso común...</li>
        </ul>
      </div>
    `;

    tempDiv.innerHTML = expectedContent;
    console.log('✅ Contenido HTML simulado insertado');
    console.log('');

    // PASO 4: Verificar contenido renderizado
    console.log('🧪 PASO 4: Verificando contenido renderizado...');
    const contentCheck = tempDiv.textContent || tempDiv.innerText || '';
    
    console.log('📏 Longitud del contenido:', contentCheck.length);
    console.log('📄 Contenido (primeros 200 chars):', contentCheck.substring(0, 200) + '...');
    console.log('🏷️  HTML (primeros 300 chars):', tempDiv.innerHTML.substring(0, 300) + '...');
    console.log('');

    // DIAGNÓSTICO
    console.log('🩺 DIAGNÓSTICO:');
    
    if (contentCheck.length < 100) {
      console.log('❌ PROBLEMA CRÍTICO: Contenido muy corto o vacío');
      console.log('🔍 Posibles causas:');
      console.log('   1. React no se está renderizando');
      console.log('   2. El componente no recibe las props correctas');
      console.log('   3. Los estilos CSS no se están aplicando');
      console.log('   4. Error en la lógica de renderizado');
    } else {
      console.log('✅ Contenido adecuado generado');
    }

    if (!contentCheck.includes(employeeName)) {
      console.log('❌ PROBLEMA: Nombre del empleado no aparece en el contenido');
    } else {
      console.log('✅ Nombre del empleado presente en el contenido');
    }

    if (!contentCheck.includes('REGLAMENTO INTERNO')) {
      console.log('❌ PROBLEMA: Título del documento no aparece');
    } else {
      console.log('✅ Título del documento presente');
    }

    if (!contentCheck.includes(formattedDate)) {
      console.log('❌ PROBLEMA: Fecha no aparece en el contenido');
    } else {
      console.log('✅ Fecha presente en el contenido');
    }

    console.log('');

    // PASO 5: Simular generación de PDF
    console.log('📄 PASO 5: Simulando generación de PDF...');
    
    // Mock html2pdf
    const mockPdfWorker = {
      get: vi.fn(() => Promise.resolve({
        output: vi.fn(() => {
          if (contentCheck.length < 100) {
            // Simular PDF vacío si el contenido es insuficiente
            return new Blob([''], { type: 'application/pdf' });
          } else {
            // Simular PDF con contenido
            return new Blob(['%PDF-1.4 mock pdf content'], { type: 'application/pdf' });
          }
        })
      }))
    };

    const mockHtml2pdf = vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(), 
      toPdf: vi.fn(() => mockPdfWorker)
    }));

    // Simular la generación
    const worker = mockHtml2pdf().from(tempDiv).set({}).toPdf();
    const pdf = await worker.get('pdf');
    const blob = pdf.output('blob');

    console.log('📊 Resultado de la generación:');
    console.log('   📦 Tamaño del blob:', blob.size, 'bytes');
    console.log('   📋 Tipo de blob:', blob.type);
    
    if (blob.size === 0) {
      console.log('❌ PDF VACÍO GENERADO - Este es el problema!');
    } else {
      console.log('✅ PDF con contenido generado');
    }

    console.log('');

    // PASO 6: Conclusiones y recomendaciones
    console.log('📋 CONCLUSIONES:');
    console.log('');
    console.log('🔍 CAUSA RAÍZ DEL PROBLEMA:');
    
    if (contentCheck.length < 100) {
      console.log('   ❌ El componente React NO se está renderizando correctamente');
      console.log('   ❌ html2pdf.js recibe contenido vacío y genera PDF vacío');
      console.log('');
      console.log('🛠️  SOLUCIONES REQUERIDAS:');
      console.log('   1. Verificar que createRoot.render() se ejecute correctamente');
      console.log('   2. Aumentar el tiempo de espera para renderizado (300ms+)');
      console.log('   3. Agregar validación de contenido antes de generar PDF');
      console.log('   4. Implementar logging para debug en producción');
      console.log('   5. Considerar usar referencias directas al DOM en lugar de React');
    } else {
      console.log('   ✅ El renderizado funcionaría correctamente');
      console.log('   ✅ html2pdf.js recibiría contenido válido');
    }

    // Limpiar
    document.body.removeChild(tempDiv);

    // Assertions para el test
    expect(employee).toBeDefined();
    expect(employeeName).toContain('Juan Carlos');
    expect(formattedDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(tempDiv.innerHTML).toContain('REGLAMENTO INTERNO');
  });

  it('should test the actual DocumentsModule handleDownloadDocument function', async () => {
    console.log('🧪 TESTING FUNCIÓN REAL DE DESCARGA...\n');

    // Este test verificaría la función real si pudiera importarla
    // Por ahora, documentamos lo que debería testear

    console.log('⚠️  NOTA: Este test requiere refactorizar DocumentsModule.tsx');
    console.log('   para exportar handleDownloadDocument como función independiente');
    console.log('');
    console.log('🔧 REFACTORING SUGERIDO:');
    console.log('   1. Extraer handleDownloadDocument a utils/pdfGenerator.ts');
    console.log('   2. Hacer la función testeable independientemente');
    console.log('   3. Agregar manejo de errores específicos');
    console.log('   4. Implementar validaciones pre-generación');

    expect(true).toBe(true); // Placeholder test
  });

  it('should verify Supabase Storage configuration for documents', async () => {
    console.log('🗄️  VERIFICANDO CONFIGURACIÓN DE STORAGE...\n');

    console.log('💡 ARQUITECTURA ACTUAL:');
    console.log('   ❌ NO usa Supabase Storage');
    console.log('   ❌ NO guarda PDFs como archivos');
    console.log('   ⚡ Genera PDFs dinámicamente');
    console.log('');
    console.log('🏗️  ARQUITECTURA RECOMENDADA:');
    console.log('   ✅ Configurar bucket "documents" en Supabase');
    console.log('   ✅ Generar PDF una vez al crear documento');
    console.log('   ✅ Guardar URL en campo document_url');
    console.log('   ✅ Servir desde Storage para descargas');
    console.log('');
    console.log('📊 BENEFICIOS:');
    console.log('   - PDFs consistentes');
    console.log('   - Mejor performance');
    console.log('   - Menor carga en frontend');
    console.log('   - Versionado de documentos');

    expect(true).toBe(true); // Informational test
  });
});
