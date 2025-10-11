import React from 'react';

interface DespidoPeriodoPruebaTemplateProps {
  employeeData: {
    nombres: string;
    apellidos: string;
    dni: string;
    cuil?: string;
  };
  fecha: string;
}

export const DespidoPeriodoPruebaTemplate: React.FC<DespidoPeriodoPruebaTemplateProps> = ({
  employeeData,
  fecha
}) => {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '40px', 
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6'
    }}>
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
          Avícola La Paloma
        </h1>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>20-24088189-7</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Av. José Hernández 90 – Río Primero
        </p>
      </div>

      {/* Lugar y Fecha */}
      <div style={{ textAlign: 'right', marginBottom: '30px', fontSize: '14px' }}>
        Río Primero, Córdoba – {fecha}
      </div>

      {/* Destinatario */}
      <div style={{ marginBottom: '30px', fontSize: '14px' }}>
        <p style={{ margin: '5px 0' }}>
          Al Sr. {employeeData.apellidos} {employeeData.nombres}
        </p>
        <p style={{ margin: '5px 0' }}>DNI: {employeeData.dni}</p>
      </div>

      {/* Referencia */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Ref.: Comunicación de finalización de la relación laboral durante el período de prueba.
        </h2>
      </div>

      {/* Cuerpo */}
      <div style={{ marginBottom: '30px', textAlign: 'justify', fontSize: '14px' }}>
        <p style={{ marginBottom: '15px' }}>
          Por medio de la presente, le informamos que hemos decidido dar por finalizada la relación 
          laboral que lo vincula con esta empresa a partir del día {fecha}, conforme lo dispuesto por 
          el Artículo 92 bis de la Ley de Contrato de Trabajo N.º 20.744, encontrándose usted dentro 
          del período de prueba legalmente establecido.
        </p>
        <p style={{ marginBottom: '15px' }}>
          La extinción de la relación laboral no obedece a causa disciplinaria alguna y, por tratarse 
          de una desvinculación dentro del período de prueba, no corresponde el pago de indemnización 
          por despido, conforme a lo establecido en la legislación vigente.
        </p>
        <p style={{ marginBottom: '15px' }}>
          En los próximos días podrá retirar su liquidación final, recibo correspondiente y demás 
          documentación laboral, incluyendo su certificado de trabajo conforme al Art. 80 de la LCT.
        </p>
        <p style={{ marginBottom: '15px' }}>
          Sin otro particular, saludamos a usted atentamente.
        </p>
      </div>

      {/* Firmas */}
      <div style={{ marginTop: '60px' }}>
        <div style={{ marginBottom: '60px' }}>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
            Firma del empleador:
          </p>
          <p style={{ margin: '30px 0 5px 0', fontSize: '14px' }}>
            Nombre: ____________________________
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            Cargo: ____________________________
          </p>
        </div>

        <div>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
            Firma del trabajador:
          </p>
          <p style={{ margin: '30px 0 5px 0', fontSize: '14px' }}>
            Nombre: ____________________________
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            DNI: ____________________________
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            Fecha de recepción: __________________
          </p>
        </div>
      </div>
    </div>
  );
};
