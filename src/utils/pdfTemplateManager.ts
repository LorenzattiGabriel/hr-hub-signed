import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { supabase } from "@/integrations/supabase/client";

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
  signature?: string; // Base64 de la firma
  signatureCode?: string; // Código de firma
  signedDate: string;
}

// Función para cargar plantilla PDF desde public/templates
const loadPDFTemplate = async (documentType: string): Promise<ArrayBuffer> => {
  let templatePath = '';
  
  if (documentType === 'reglamento_interno') {
    templatePath = '/templates/reglamento_template.pdf';
  } else if (documentType === 'consentimiento_datos_biometricos') {
    templatePath = '/templates/consentimiento_template.pdf';
  } else {
    throw new Error(`Tipo de documento no soportado: ${documentType}`);
  }

  console.log('📂 [PDF TEMPLATE] Cargando plantilla:', templatePath);
  
  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`No se pudo cargar la plantilla: ${response.status}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error('❌ [PDF TEMPLATE] Error cargando plantilla:', error);
    throw new Error('No se pudo cargar la plantilla PDF');
  }
};

// Función para personalizar PDF con datos del empleado
const customizePDF = async (
  templateBuffer: ArrayBuffer, 
  employeeData: GeneratePDFParams['employeeData'],
  generatedDate: string
): Promise<Uint8Array> => {
  
  console.log('✏️ [PDF TEMPLATE] Personalizando PDF para:', employeeData.nombres, employeeData.apellidos);
  
  // Cargar el PDF existente
  const pdfDoc = await PDFDocument.load(templateBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Obtener la primera página
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  
  console.log('📐 [PDF TEMPLATE] Dimensiones de página:', { width, height });
  
  // Formatear fecha
  const formattedDate = new Date(generatedDate + 'T12:00:00').toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const employeeName = `${employeeData.nombres} ${employeeData.apellidos}`;
  
  // Agregar datos del empleado en posiciones específicas
  // Estas posiciones pueden necesitar ajuste según el layout de tus PDFs
  
  // Fecha (parte superior)
  firstPage.drawText(`Fecha: ${formattedDate}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  // Nombre del empleado
  firstPage.drawText(`Empleado: ${employeeName}`, {
    x: 50,
    y: height - 130,
    size: 12,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0),
  });
  
  // DNI
  firstPage.drawText(`DNI: ${employeeData.dni}`, {
    x: 50,
    y: height - 160,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  
  // Dirección (si está disponible)
  if (employeeData.direccion) {
    firstPage.drawText(`Dirección: ${employeeData.direccion}`, {
      x: 50,
      y: height - 190,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  }
  
  // Agregar marca de agua con estado "GENERADO"
  firstPage.drawText('GENERADO', {
    x: width / 2 - 50,
    y: height / 2,
    size: 60,
    font: helveticaBoldFont,
    color: rgb(0.9, 0.9, 0.9),
    opacity: 0.3,
  });
  
  console.log('✅ [PDF TEMPLATE] PDF personalizado correctamente');
  
  // Serializar el PDF modificado
  return await pdfDoc.save();
};

// Función para agregar firma al PDF
export const signPDF = async (params: SignPDFParams): Promise<PDFGenerationResult> => {
  console.log('✍️ [PDF TEMPLATE] Iniciando proceso de firma para documento:', params.documentId);
  
  try {
    // Obtener el documento de la base de datos
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.documentId)
      .single();
    
    if (docError || !document) {
      throw new Error('Documento no encontrado');
    }
    
    if (!document.pdf_url) {
      throw new Error('El documento no tiene PDF asociado');
    }
    
    // Descargar el PDF actual
    const fileName = document.pdf_url.split('/').pop();
    const { data: pdfBlob, error: downloadError } = await supabase.storage
      .from('documents')
      .download(fileName);
    
    if (downloadError) {
      throw new Error('No se pudo descargar el PDF actual');
    }
    
    // Cargar el PDF para modificarlo
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // Remover marca de agua "GENERADO" y agregar "FIRMADO"
    firstPage.drawText('FIRMADO', {
      x: width / 2 - 40,
      y: height / 2,
      size: 60,
      font: helveticaBoldFont,
      color: rgb(0, 0.8, 0),
      opacity: 0.3,
    });
    
    // Agregar información de firma
    const signedDate = new Date(params.signedDate + 'T12:00:00').toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    firstPage.drawText(`Firmado el: ${signedDate}`, {
      x: 50,
      y: 100,
      size: 10,
      font: helveticaBoldFont,
      color: rgb(0, 0.6, 0),
    });
    
    if (params.signatureCode) {
      firstPage.drawText(`Código de firma: ${params.signatureCode}`, {
        x: 50,
        y: 80,
        size: 10,
        font: helveticaBoldFont,
        color: rgb(0, 0.6, 0),
      });
    }
    
    // TODO: Si hay firma digital (base64), agregarla como imagen
    // if (params.signature) {
    //   // Implementar inserción de imagen de firma
    // }
    
    // Guardar PDF firmado
    const signedPdfBytes = await pdfDoc.save();
    const signedBlob = new Blob([new Uint8Array(signedPdfBytes)], { type: 'application/pdf' });
    
    // Subir PDF firmado (reemplazar el anterior)
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .update(fileName, signedBlob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Error subiendo PDF firmado: ${uploadError.message}`);
    }
    
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
    
    console.log('✅ [PDF TEMPLATE] Documento firmado exitosamente');
    
    return {
      success: true,
      pdfUrl: document.pdf_url,
      blob: signedBlob
    };
    
  } catch (error) {
    console.error('❌ [PDF TEMPLATE] Error firmando documento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Función principal para generar PDF personalizado
export const generateAndUploadPDF = async (params: GeneratePDFParams): Promise<PDFGenerationResult> => {
  console.log('🚀 [PDF TEMPLATE] Iniciando generación con plantillas existentes');
  
  try {
    // 1. Cargar plantilla base
    const templateBuffer = await loadPDFTemplate(params.documentType);
    
    // 2. Personalizar con datos del empleado
    const customizedPdfBytes = await customizePDF(templateBuffer, params.employeeData, params.generatedDate);
    
    // 3. Crear blob
    const blob = new Blob([new Uint8Array(customizedPdfBytes)], { type: 'application/pdf' });
    console.log('📦 [PDF TEMPLATE] PDF personalizado generado, tamaño:', blob.size, 'bytes');
    
    if (blob.size === 0) {
      throw new Error('El PDF generado está vacío');
    }
    
    // 4. Subir a Supabase
    const fileName = `${params.documentId}_${params.documentType}_${params.employeeData.dni}_${Date.now()}.pdf`;
    console.log('☁️ [PDF TEMPLATE] Subiendo a Supabase:', fileName);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, blob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ [PDF TEMPLATE] Error subiendo:', uploadError);
      throw new Error(`Error subiendo archivo: ${uploadError.message}`);
    }
    
    console.log('✅ [PDF TEMPLATE] Archivo subido exitosamente');
    
    // 5. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);
    
    if (!urlData?.publicUrl) {
      throw new Error('No se pudo obtener la URL del archivo');
    }
    
    console.log('🎉 [PDF TEMPLATE] Proceso completado exitosamente');
    
    return {
      success: true,
      pdfUrl: urlData.publicUrl,
      blob: blob
    };
    
  } catch (error) {
    console.error('❌ [PDF TEMPLATE] Error:', error);
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
