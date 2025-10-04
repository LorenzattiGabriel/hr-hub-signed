// Re-exportar funciones del sistema directo jsPDF (sin html2pdf)
export { 
  generatePDFDirectly as generateAndUploadPDF, 
  downloadPDFFromStorage, 
  deletePDFFromStorage,
  signPDF,
  type GeneratePDFParams,
  type PDFGenerationResult,
  type SignPDFParams
} from './directPdfGenerator';