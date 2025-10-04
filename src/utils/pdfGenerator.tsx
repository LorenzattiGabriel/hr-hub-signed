import { supabase } from "@/integrations/supabase/client";
import html2pdf from "html2pdf.js";
import { createRoot } from "react-dom/client";
import ConsentimientoDatosBiometricos from "@/components/documents/templates/ConsentimientoDatosBiometricos";
import ReglamentoInterno from "@/components/documents/templates/ReglamentoInterno";

export interface GeneratePDFParams {
  documentType: string;
  employeeData: {
    nombres: string;
    apellidos: string;
    dni: string;
    direccion?: string;
  };
  generatedDate: string;
  documentId: string;
}

export interface PDFGenerationResult {
  success: boolean;
  pdfUrl?: string;
  error?: string;
  blob?: Blob;
}

export interface SignPDFParams {
  documentId: string;
  signature?: string;
  signatureCode?: string;
  signedDate: string;
}

// Función para generar contenido del Reglamento Interno
const generateReglamentoContent = (employeeName: string, employeeDni: string, date: string) => {
  return [
    { text: "REGLAMENTO INTERNO", fontSize: 20, align: "center", bold: true },
    { text: "AVÍCOLA LA PALOMA", fontSize: 16, align: "center", bold: true },
    { text: "", fontSize: 12 },
    { text: `Fecha: ${date}`, fontSize: 12, bold: true },
    { text: `Nombre del empleado: ${employeeName}`, fontSize: 12, bold: true },
    { text: `DNI: ${employeeDni}`, fontSize: 12, bold: true },
    { text: "", fontSize: 12 },
    { 
      text: "Este reglamento tiene por objetivo establecer normas claras de convivencia, obligaciones, derechos y procedimientos que garanticen un ambiente de trabajo ordenado, seguro y respetuoso para todos.",
      fontSize: 12
    },
    { text: "", fontSize: 12 },
    { text: "1. OBLIGACIONES Y DEBERES DE LOS EMPLEADOS", fontSize: 14, bold: true },
    { text: "• Cumplir con las obligaciones propias del puesto de trabajo, conforme a las reglas de la buena fe y diligencia.", fontSize: 11 },
    { text: "• Observar las órdenes e instrucciones que se le impartan sobre el modo de ejecución del trabajo.", fontSize: 11 },
    { text: "• No ejecutar negociaciones por cuenta propia o de terceros, que pudieran afectar los intereses del empleador.", fontSize: 11 },
    { text: "• Guardar secreto de las informaciones que tenga carácter reservado y cuya divulgación pueda ocasionar perjuicios al empleador.", fontSize: 11 },
    { text: "• Conservar los instrumentos de trabajo y no utilizarlos para otros fines que los de su trabajo.", fontSize: 11 },
    { text: "", fontSize: 12 },
    { text: "2. HORARIOS DE TRABAJO", fontSize: 14, bold: true },
    { text: "• Respetar estrictamente los horarios de entrada y salida establecidos.", fontSize: 11 },
    { text: "• Registrar correctamente el ingreso y egreso en el sistema de control horario.", fontSize: 11 },
    { text: "• Solicitar autorización previa para cualquier modificación de horario.", fontSize: 11 },
    { text: "", fontSize: 12 },
    { text: "3. NORMAS DE SEGURIDAD E HIGIENE", fontSize: 14, bold: true },
    { text: "• Utilizar obligatoriamente los elementos de protección personal proporcionados.", fontSize: 11 },
    { text: "• Mantener el lugar de trabajo limpio y ordenado.", fontSize: 11 },
    { text: "• Reportar inmediatamente cualquier accidente o situación de riesgo.", fontSize: 11 },
    { text: "• Cumplir con las normas de higiene personal y alimentaria.", fontSize: 11 },
    { text: "", fontSize: 12 },
    { text: "4. PROHIBICIONES", fontSize: 14, bold: true },
    { text: "• Está prohibido el consumo de alcohol y drogas en el lugar de trabajo.", fontSize: 11 },
    { text: "• No se permite fumar en las instalaciones de la empresa.", fontSize: 11 },
    { text: "• Queda prohibido el uso de teléfonos celulares durante el horario de trabajo.", fontSize: 11 },
    { text: "", fontSize: 12 },
    { text: "5. SANCIONES", fontSize: 14, bold: true },
    { text: "El incumplimiento de este reglamento será sancionado según la gravedad de la falta, pudiendo aplicarse desde llamados de atención hasta la suspensión o despido.", fontSize: 11 },
    { text: "", fontSize: 20 },
    { text: "FIRMA DEL EMPLEADO:", fontSize: 12, bold: true },
    { text: "", fontSize: 15 },
    { text: "_".repeat(40), fontSize: 12 },
    { text: `Aclaración: ${employeeName}`, fontSize: 12 },
    { text: `DNI: ${employeeDni}`, fontSize: 12 },
    { text: `Fecha: ${date}`, fontSize: 12 }
  ];
};

// Función para generar contenido del Consentimiento
const generateConsentimientoContent = (employeeName: string, employeeDni: string, employeeAddress: string, date: string) => {
  return [
    { text: "CONSTANCIA DE CONSENTIMIENTO PARA USO DE", fontSize: 16, align: "center", bold: true },
    { text: "CÁMARAS DE VIGILANCIA Y DATOS BIOMÉTRICOS", fontSize: 16, align: "center", bold: true },
    { text: "", fontSize: 12 },
    { text: `Fecha: ${date}`, fontSize: 12, bold: true },
    { text: "", fontSize: 12 },
    { 
      text: `En la ciudad de Córdoba Capital, comparece el/la trabajador/a ${employeeName}, DNI Nº ${employeeDni}, con domicilio en ${employeeAddress}, quien manifiesta prestar su consentimiento expreso en los términos de la Ley de Protección de Datos Personales N° 25.326 y normativa laboral aplicable.`,
      fontSize: 12
    },
    { text: "", fontSize: 12 },
    { text: "1. CÁMARAS DE VIGILANCIA", fontSize: 14, bold: true },
    { 
      text: "El/la trabajador/a declara haber sido informado/a de la existencia de cámaras de seguridad instaladas en las instalaciones de la empresa Avícola La Paloma (en adelante \"la Empresa\"), cuya finalidad exclusiva es la prevención de riesgos, seguridad de las personas, resguardo de bienes y control de acceso a las instalaciones.",
      fontSize: 11
    },
    { text: "", fontSize: 8 },
    { 
      text: "PRESTA SU CONSENTIMIENTO para ser filmado/a durante el desarrollo de sus tareas laborales, entendiendo que las imágenes captadas serán utilizadas únicamente para los fines mencionados y bajo estricta confidencialidad, conforme a la legislación vigente.",
      fontSize: 11,
      bold: true
    },
    { text: "", fontSize: 12 },
    { text: "2. DATOS BIOMÉTRICOS", fontSize: 14, bold: true },
    { 
      text: "El/la trabajador/a ha sido informado/a que la Empresa utiliza sistemas de control de acceso y horario mediante tecnología biométrica (huella dactilar), con el fin de garantizar la seguridad de las instalaciones y el correcto registro de la jornada laboral.",
      fontSize: 11
    },
    { text: "", fontSize: 8 },
    { 
      text: "PRESTA SU CONSENTIMIENTO para el tratamiento de sus datos biométricos (huella dactilar) exclusivamente para los fines mencionados, entendiendo que dichos datos serán almacenados de forma segura y no serán compartidos con terceros ajenos a la empresa.",
      fontSize: 11,
      bold: true
    },
    { text: "", fontSize: 12 },
    { text: "3. DERECHOS DEL TITULAR", fontSize: 14, bold: true },
    { 
      text: "El/la trabajador/a conoce sus derechos de acceso, rectificación, actualización y supresión de sus datos personales, los cuales podrá ejercer dirigiéndose a la empresa en cualquier momento, conforme a la Ley 25.326.",
      fontSize: 11
    },
    { text: "", fontSize: 8 },
    { 
      text: "Este consentimiento es revocable en cualquier momento, sin que ello afecte la licitud del tratamiento basado en el consentimiento previo a su retirada.",
      fontSize: 11
    },
    { text: "", fontSize: 20 },
    { text: "FIRMA DEL EMPLEADO:", fontSize: 12, bold: true },
    { text: "", fontSize: 15 },
    { text: "_".repeat(40), fontSize: 12 },
    { text: `Aclaración: ${employeeName}`, fontSize: 12 },
    { text: `DNI: ${employeeDni}`, fontSize: 12 },
    { text: `Fecha: ${date}`, fontSize: 12 }
  ];
};

export const generateAndUploadPDF = async (params: GeneratePDFParams): Promise<PDFGenerationResult> => {
  const { documentType, employeeData, generatedDate, documentId } = params;
  
  const isPreview = documentId.startsWith('preview_');
  console.log('🚀 [PDF GENERATOR] Iniciando generación con html2pdf y componentes React', isPreview ? '(PREVIEW)' : '(GUARDAR)');

  try {
    // Crear un div temporal para renderizar el componente
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '210mm'; // A4 width
    tempDiv.style.background = 'white';
    document.body.appendChild(tempDiv);

    // Renderizar el componente React apropiado
    const root = createRoot(tempDiv);
    
    const employeeName = `${employeeData.nombres} ${employeeData.apellidos}`;
    const formattedDate = new Date(generatedDate + 'T12:00:00').toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    console.log('📄 [PDF GENERATOR] Generando para:', employeeName, 'Fecha:', formattedDate);

    // Renderizar según tipo de documento
    if (documentType === 'reglamento_interno') {
      root.render(
        <ReglamentoInterno
          employeeName={employeeName}
          date={formattedDate}
        />
      );
    } else if (documentType === 'consentimiento_datos_biometricos') {
      root.render(
        <ConsentimientoDatosBiometricos
          employeeName={employeeName}
          employeeDni={employeeData.dni}
          employeeAddress={employeeData.direccion || 'Sin dirección registrada'}
          date={formattedDate}
        />
      );
    } else {
      throw new Error(`Tipo de documento no soportado: ${documentType}`);
    }

    // Esperar a que React renderice
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('📝 [PDF GENERATOR] Convirtiendo HTML a PDF...');

    // Configurar html2pdf con opciones optimizadas
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `documento_${documentId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy']
      }
    };

    // Generar el PDF
    const pdfBlob = await html2pdf().set(opt).from(tempDiv).outputPdf('blob');

    console.log('📦 [PDF GENERATOR] PDF generado, tamaño:', pdfBlob.size, 'bytes');

    // Limpiar
    root.unmount();
    document.body.removeChild(tempDiv);

    if (pdfBlob.size === 0) {
      throw new Error('El PDF generado está vacío');
    }

    const blob = new Blob([pdfBlob], { type: 'application/pdf' });

    // Solo subir a Supabase si NO es preview
    if (!isPreview) {
      const fileName = `${documentId}_${documentType}_${employeeData.dni}_${Date.now()}.pdf`;
      console.log('☁️ [PDF GENERATOR] Subiendo a Supabase:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, blob, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ [PDF GENERATOR] Error subiendo:', uploadError);
        throw new Error(`Error subiendo archivo: ${uploadError.message}`);
      }

      console.log('✅ [PDF GENERATOR] Archivo subido exitosamente');

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error('No se pudo obtener la URL del archivo');
      }

      console.log('🎉 [PDF GENERATOR] Proceso completado exitosamente');

      return {
        success: true,
        pdfUrl: urlData.publicUrl,
        blob: blob
      };
    } else {
      console.log('📥 [PDF GENERATOR] Preview generado - NO se sube a Supabase');
      
      return {
        success: true,
        blob: blob
      };
    }

  } catch (error) {
    console.error('❌ [PDF GENERATOR] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Función simple para firmar (actualizar estado)
export const signPDF = async (params: SignPDFParams): Promise<PDFGenerationResult> => {
  console.log('✍️ [PDF GENERATOR] Firmando documento:', params.documentId);
  
  try {
    // Actualizar documento en la base de datos
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        status: 'firmado',
        signed_date: params.signedDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.documentId);
    
    if (updateError) {
      throw new Error(`Error actualizando documento: ${updateError.message}`);
    }
    
    console.log('✅ [PDF GENERATOR] Documento firmado exitosamente');
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('❌ [PDF GENERATOR] Error firmando documento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Función para descargar PDF desde Supabase Storage
export const downloadPDFFromStorage = async (fileName: string): Promise<Blob> => {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(fileName);

  if (error) {
    throw new Error(`Error descargando archivo: ${error.message}`);
  }

  return data;
};

// Función para eliminar PDF de Supabase Storage
export const deletePDFFromStorage = async (fileName: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('documents')
    .remove([fileName]);

  if (error) {
    throw new Error(`Error eliminando archivo: ${error.message}`);
  }
};