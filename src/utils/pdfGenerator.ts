import React from "react";
import html2pdf from "html2pdf.js";
import { createRoot } from "react-dom/client";
import { supabase } from "@/integrations/supabase/client";
import ConsentimientoDatosBiometricos from "@/components/documents/templates/ConsentimientoDatosBiometricos";
import ReglamentoInterno from "@/components/documents/templates/ReglamentoInterno";

// Función para generar HTML del Reglamento Interno
const generateReglamentoHTML = (employeeName: string, date: string): string => {
  return `
    <div style="width: 210mm; min-height: 297mm; background: white; color: black; padding: 20mm; font-family: Arial, sans-serif; line-height: 1.4;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">REGLAMENTO INTERNO</h1>
      <h2 style="text-align: center; font-size: 20px; font-weight: bold; text-transform: uppercase; margin-bottom: 30px;">AVÍCOLA LA PALOMA</h2>
      
      <p style="margin: 8px 0;"><strong>Fecha:</strong> ${date}</p>
      <p style="margin: 8px 0 20px 0;"><strong>Nombre del empleado:</strong> ${employeeName}</p>
      
      <p style="margin: 15px 0; text-align: justify;">
        Este reglamento tiene por objetivo establecer normas claras de convivencia, obligaciones, derechos y procedimientos que garanticen un ambiente de trabajo ordenado, seguro y respetuoso para todos.
      </p>
      
      <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0 10px 0;">1. Obligaciones y deberes de los empleados</h3>
      <ul style="margin: 10px 0; padding-left: 25px;">
        <li style="margin: 8px 0; text-align: justify;">Cumplir con las obligaciones propias del puesto de trabajo, conforme a las reglas de la buena fe y diligencia.</li>
        <li style="margin: 8px 0; text-align: justify;">Observar las órdenes e instrucciones que se le impartan sobre el modo de ejecución del trabajo.</li>
        <li style="margin: 8px 0; text-align: justify;">No ejecutar negociaciones por cuenta propia o de terceros, que pudieran afectar los intereses del empleador.</li>
        <li style="margin: 8px 0; text-align: justify;">Guardar secreto de las informaciones que tenga carácter reservado y cuya divulgación pueda ocasionar perjuicios al empleador.</li>
        <li style="margin: 8px 0; text-align: justify;">Conservar los instrumentos de trabajo y no utilizarlos para otros fines que los de su trabajo.</li>
      </ul>
      
      <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0 10px 0;">2. Horarios de trabajo</h3>
      <ul style="margin: 10px 0; padding-left: 25px;">
        <li style="margin: 8px 0; text-align: justify;">Respetar estrictamente los horarios de entrada y salida establecidos.</li>
        <li style="margin: 8px 0; text-align: justify;">Registrar correctamente el ingreso y egreso en el sistema de control horario.</li>
        <li style="margin: 8px 0; text-align: justify;">Solicitar autorización previa para cualquier modificación de horario.</li>
      </ul>
      
      <h3 style="font-size: 18px; font-weight: bold; margin: 20px 0 10px 0;">3. Normas de seguridad e higiene</h3>
      <ul style="margin: 10px 0; padding-left: 25px;">
        <li style="margin: 8px 0; text-align: justify;">Utilizar obligatoriamente los elementos de protección personal proporcionados.</li>
        <li style="margin: 8px 0; text-align: justify;">Mantener el lugar de trabajo limpio y ordenado.</li>
        <li style="margin: 8px 0; text-align: justify;">Reportar inmediatamente cualquier accidente o situación de riesgo.</li>
        <li style="margin: 8px 0; text-align: justify;">Cumplir con las normas de higiene personal y alimentaria.</li>
      </ul>
      
      <div style="margin-top: 50px;">
        <p style="margin: 30px 0 10px 0;">Firma del empleado:</p>
        <div style="border-bottom: 1px solid black; width: 300px; height: 50px; display: inline-block;"></div>
        <p style="margin: 10px 0;">Aclaración: ${employeeName}</p>
        <p style="margin: 10px 0;">Fecha: ${date}</p>
      </div>
    </div>
  `;
};

// Función para generar HTML del Consentimiento de Datos Biométricos
const generateConsentimientoHTML = (employeeName: string, employeeDni: string, employeeAddress: string, date: string): string => {
  return `
    <div style="width: 210mm; min-height: 297mm; background: white; color: black; padding: 20mm; font-family: Arial, sans-serif; line-height: 1.4;">
      <h1 style="text-align: center; font-size: 20px; font-weight: bold; text-transform: uppercase; margin-bottom: 30px;">
        CONSTANCIA DE CONSENTIMIENTO PARA USO DE CÁMARAS DE VIGILANCIA Y DATOS BIOMÉTRICOS
      </h1>
      
      <p style="margin: 15px 0;"><strong>Fecha:</strong> ${date}</p>
      
      <p style="margin: 15px 0; text-align: justify;">
        En la ciudad de Córdoba Capital, comparece el/la trabajador/a <strong>${employeeName}</strong>, DNI Nº <strong>${employeeDni}</strong>, 
        con domicilio en <strong>${employeeAddress}</strong>, quien manifiesta prestar su consentimiento expreso en los términos de la 
        Ley de Protección de Datos Personales N° 25.326 y normativa laboral aplicable.
      </p>
      
      <h2 style="font-size: 18px; font-weight: bold; margin: 25px 0 15px 0;">1. Cámaras de Vigilancia</h2>
      
      <p style="margin: 12px 0; text-align: justify;">
        El/la trabajador/a declara haber sido informado/a de la existencia de cámaras de seguridad instaladas en las instalaciones 
        de la empresa Avícola La Paloma (en adelante "la Empresa"), cuya finalidad exclusiva es la prevención de riesgos, 
        seguridad de las personas, resguardo de bienes y control de acceso a las instalaciones.
      </p>
      
      <p style="margin: 12px 0; text-align: justify;">
        <strong>PRESTA SU CONSENTIMIENTO</strong> para ser filmado/a durante el desarrollo de sus tareas laborales, 
        entendiendo que las imágenes captadas serán utilizadas únicamente para los fines mencionados y bajo estricta 
        confidencialidad, conforme a la legislación vigente.
      </p>
      
      <h2 style="font-size: 18px; font-weight: bold; margin: 25px 0 15px 0;">2. Datos Biométricos</h2>
      
      <p style="margin: 12px 0; text-align: justify;">
        El/la trabajador/a ha sido informado/a que la Empresa utiliza sistemas de control de acceso y horario mediante 
        tecnología biométrica (huella dactilar), con el fin de garantizar la seguridad de las instalaciones y el 
        correcto registro de la jornada laboral.
      </p>
      
      <p style="margin: 12px 0; text-align: justify;">
        <strong>PRESTA SU CONSENTIMIENTO</strong> para el tratamiento de sus datos biométricos (huella dactilar) 
        exclusivamente para los fines mencionados, entendiendo que dichos datos serán almacenados de forma segura 
        y no serán compartidos con terceros ajenos a la empresa.
      </p>
      
      <h2 style="font-size: 18px; font-weight: bold; margin: 25px 0 15px 0;">3. Derechos del titular</h2>
      
      <p style="margin: 12px 0; text-align: justify;">
        El/la trabajador/a conoce sus derechos de acceso, rectificación, actualización y supresión de sus datos personales, 
        los cuales podrá ejercer dirigiéndose a la empresa en cualquier momento, conforme a la Ley 25.326.
      </p>
      
      <p style="margin: 12px 0; text-align: justify;">
        Este consentimiento es revocable en cualquier momento, sin que ello afecte la licitud del tratamiento basado 
        en el consentimiento previo a su retirada.
      </p>
      
      <div style="margin-top: 50px;">
        <p style="margin: 30px 0 10px 0;">Firma del empleado:</p>
        <div style="border-bottom: 1px solid black; width: 300px; height: 50px; display: inline-block;"></div>
        <p style="margin: 10px 0;">Aclaración: ${employeeName}</p>
        <p style="margin: 10px 0;">DNI: ${employeeDni}</p>
        <p style="margin: 10px 0;">Fecha: ${date}</p>
      </div>
    </div>
  `;
};

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

/**
 * Genera un PDF a partir de un template React y lo sube a Supabase Storage
 */
export const generateAndUploadPDF = async (params: GeneratePDFParams): Promise<PDFGenerationResult> => {
  const { documentType, employeeData, generatedDate, documentId } = params;
  
  try {
    console.log('🚀 [PDF GENERATOR] Iniciando generación de PDF:', documentType);
    console.log('📋 [PDF GENERATOR] Parámetros recibidos:', params);
    
    // 1. Crear elemento temporal para renderizado
    console.log('🔧 [PDF GENERATOR] Creando elemento temporal...');
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.color = 'black';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    
    // Copiar estilos globales al div temporal (simplificado)
    try {
      const stylesheets = Array.from(document.styleSheets);
      const cssText = stylesheets.map(sheet => {
        try {
          return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
        } catch (e) {
          console.warn('No se pudieron copiar algunos estilos CSS:', e);
          return '';
        }
      }).join('');
      
      if (cssText.length > 0) {
        const style = document.createElement('style');
        style.textContent = cssText;
        tempDiv.appendChild(style);
      }
    } catch (cssError) {
      console.warn('Error copiando estilos CSS, continuando sin estilos globales:', cssError);
    }
    
    document.body.appendChild(tempDiv);

    // 2. Renderizar el componente React correspondiente
    const root = createRoot(tempDiv);
    const employeeName = `${employeeData.nombres} ${employeeData.apellidos}`;
    
    // Formatear fecha correctamente evitando problemas de zona horaria
    const dateObj = new Date(generatedDate + 'T12:00:00'); // Agregar hora para evitar problemas de zona horaria
    const formattedDate = dateObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    console.log('📅 [PDF GENERATOR] Fecha original:', generatedDate);
    console.log('📅 [PDF GENERATOR] Fecha formateada:', formattedDate);

    console.log('📄 [PDF GENERATOR] Renderizando template para:', employeeName);
    console.log('🔍 [PDF GENERATOR] ANTES DE RENDERIZAR - Tipo:', documentType);

    // Generar HTML directo según el tipo de documento
    console.log('📄 [PDF GENERATOR] Generando HTML directo para:', documentType);
    
    if (documentType === 'consentimiento_datos_biometricos') {
      tempDiv.innerHTML = generateConsentimientoHTML(employeeName, employeeData.dni, employeeData.direccion || 'Sin dirección registrada', formattedDate);
    } else if (documentType === 'reglamento_interno') {
      tempDiv.innerHTML = generateReglamentoHTML(employeeName, formattedDate);
    } else {
      throw new Error(`Tipo de documento no soportado: ${documentType}`);
    }
    
    console.log('✅ [PDF GENERATOR] HTML generado correctamente');

    console.log('✅ [PDF GENERATOR] Componente React renderizado, esperando DOM...');

    // 3. Esperar renderizado completo
    console.log('⏱️ [PDF GENERATOR] Esperando renderizado completo...');
    await new Promise(resolve => requestAnimationFrame(() => 
      requestAnimationFrame(() => setTimeout(resolve, 500))
    ));

    // 4. Validar contenido renderizado
    console.log('🔍 [PDF GENERATOR] ===== VALIDACIÓN DE CONTENIDO =====');
    const contentCheck = tempDiv.textContent || tempDiv.innerText || '';
    console.log('📏 [PDF GENERATOR] Contenido renderizado:', contentCheck.length, 'caracteres');
    console.log('📄 [PDF GENERATOR] Primeros 200 chars:', JSON.stringify(contentCheck.substring(0, 200)));
    console.log('🏷️ [PDF GENERATOR] HTML completo (500 chars):', tempDiv.innerHTML.substring(0, 500));
    console.log('🔍 [PDF GENERATOR] Empleado:', employeeName);
    console.log('🔍 [PDF GENERATOR] Tipo documento:', documentType);
    console.log('🔍 [PDF GENERATOR] Fecha:', formattedDate);
    
    // Diagnóstico adicional
    const allElements = tempDiv.querySelectorAll('*');
    console.log('🏗️ [PDF GENERATOR] Elementos HTML encontrados:', allElements.length);
    
    if (contentCheck.length < 50) {
      console.error('❌ [PDF GENERATOR] CONTENIDO CRÍTICO - MUY POCO TEXTO');
      console.error('🔍 [PDF GENERATOR] HTML completo del div:', tempDiv.innerHTML);
      console.error('🔍 [PDF GENERATOR] OuterHTML del div:', tempDiv.outerHTML.substring(0, 1000));
      
      // No lanzar error, continuar para ver qué pasa
      console.warn('⚠️ [PDF GENERATOR] Continuando a pesar del contenido insuficiente...');
    }

    // 5. Generar PDF con html2pdf
    console.log('🔄 [PDF GENERATOR] Generando archivo PDF con html2pdf...');
    console.log('📐 [PDF GENERATOR] Dimensiones del div:', {
      scrollWidth: tempDiv.scrollWidth,
      scrollHeight: tempDiv.scrollHeight,
      offsetWidth: tempDiv.offsetWidth,
      offsetHeight: tempDiv.offsetHeight
    });
    
    const options = {
      margin: [10, 10, 10, 10],
      filename: `${documentType}_${employeeData.dni}_${generatedDate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollY: 0,
        scrollX: 0,
        width: 794,
        windowWidth: 794,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    const worker = (html2pdf as any)().from(tempDiv).set(options).toPdf();
    console.log('🏗️ [PDF GENERATOR] Worker de html2pdf creado, ejecutando...');
    
    const pdf = await worker.get('pdf');
    console.log('📄 [PDF GENERATOR] PDF objeto obtenido');
    
    const blob = pdf.output('blob') as Blob;
    console.log('📦 [PDF GENERATOR] Blob generado, tamaño:', blob.size, 'bytes');
    console.log('🔍 [PDF GENERATOR] Tipo de blob:', blob.type);
    
    // Diagnóstico adicional del blob
    if (blob.size === 0) {
      console.error('❌ [PDF GENERATOR] El PDF generado está completamente vacío (0 bytes)');
      console.error('🔍 [PDF GENERATOR] Contenido del div antes de limpiar:', tempDiv.innerHTML.substring(0, 1000));
      throw new Error('El PDF generado está vacío');
    }
    
    if (blob.size < 1000) {
      console.warn('⚠️ [PDF GENERATOR] El PDF generado es muy pequeño:', blob.size, 'bytes');
      console.warn('🔍 [PDF GENERATOR] Esto podría indicar contenido incompleto');
      
      // Intentar leer una muestra del blob para debug
      try {
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const firstBytes = Array.from(uint8Array.slice(0, 50)).map(b => String.fromCharCode(b)).join('');
        console.log('🔍 [PDF GENERATOR] Primeros bytes del PDF:', firstBytes);
      } catch (err) {
        console.error('❌ [PDF GENERATOR] Error leyendo blob:', err);
      }
    }

    // Limpiar DOM
    console.log('🧹 [PDF GENERATOR] Limpiando DOM...');
    root.unmount();
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
    }

    // 6. Subir a Supabase Storage
    const fileName = `${documentId}_${documentType}_${employeeData.dni}_${Date.now()}.pdf`;
    console.log('☁️ [PDF GENERATOR] Subiendo a Supabase Storage...');
    console.log('📁 [PDF GENERATOR] Nombre de archivo:', fileName);
    console.log('🗄️ [PDF GENERATOR] Bucket de destino: documents');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, blob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    console.log('📊 [PDF GENERATOR] Resultado del upload:', { uploadData, uploadError });

    if (uploadError) {
      console.error('❌ [PDF GENERATOR] Error subiendo archivo:', uploadError);
      throw new Error(`Error subiendo archivo: ${uploadError.message}`);
    }

    console.log('✅ [PDF GENERATOR] Archivo subido exitosamente:', uploadData);

    // 7. Obtener URL pública del archivo
    console.log('🔗 [PDF GENERATOR] Obteniendo URL pública...');
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    console.log('📎 [PDF GENERATOR] URL data:', urlData);

    if (!urlData?.publicUrl) {
      console.error('❌ [PDF GENERATOR] No se pudo obtener la URL del archivo');
      throw new Error('No se pudo obtener la URL del archivo');
    }

    console.log('🎉 [PDF GENERATOR] PDF subido exitosamente:', urlData.publicUrl);

    return {
      success: true,
      pdfUrl: urlData.publicUrl,
      blob
    };

  } catch (error) {
    console.error('❌ [PDF GENERATOR] Error en el proceso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Descarga un PDF desde Supabase Storage
 */
export const downloadPDFFromStorage = async (pdfUrl: string, fileName: string): Promise<void> => {
  try {
    console.log('⬇️ Descargando PDF desde storage:', pdfUrl);
    
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Error descargando archivo: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Descarga completada');
  } catch (error) {
    console.error('❌ Error descargando PDF:', error);
    throw error;
  }
};

/**
 * Elimina un PDF de Supabase Storage
 */
export const deletePDFFromStorage = async (pdfUrl: string): Promise<boolean> => {
  try {
    // Extraer el nombre del archivo de la URL
    const urlParts = pdfUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (!fileName) {
      throw new Error('No se pudo extraer el nombre del archivo de la URL');
    }

    console.log('🗑️ Eliminando PDF del storage:', fileName);

    const { error } = await supabase.storage
      .from('documents')
      .remove([fileName]);

    if (error) {
      console.error('❌ Error eliminando archivo:', error);
      return false;
    }

    console.log('✅ Archivo eliminado del storage');
    return true;
  } catch (error) {
    console.error('❌ Error eliminando PDF:', error);
    return false;
  }
};
