import React from "react";

interface ConsentimientoDatosBiometricosProps {
  employeeName: string;
  employeeDni: string;
  employeeAddress: string;
  date: string;
}

const ConsentimientoDatosBiometricos = React.forwardRef<
  HTMLDivElement,
  ConsentimientoDatosBiometricosProps
>(({ employeeName, employeeDni, employeeAddress, date }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-black p-12"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Page 1 */}
      <div className="space-y-6">
        <h1 className="text-center text-xl font-bold uppercase mb-8">
          CONSTANCIA DE CONSENTIMIENTO PARA USO DE CÁMARAS DE VIGILANCIA Y DATOS
          BIOMÉTRICOS
        </h1>

        <p className="mb-4">
          <strong>Fecha:</strong> {date}
        </p>

        <p className="text-justify leading-relaxed mb-6">
          En la ciudad de Córdoba Capital, comparece el/la trabajador/a{" "}
          <strong>{employeeName}</strong>, DNI Nº <strong>{employeeDni}</strong>,
          con domicilio en <strong>{employeeAddress}</strong>, quien manifiesta
          prestar su consentimiento expreso en los términos de la Ley de
          Protección de Datos Personales N° 25.326 y normativa laboral aplicable.
        </p>

        <h2 className="text-lg font-bold mt-8 mb-4">1. Cámaras de Vigilancia</h2>

        <p className="text-justify leading-relaxed mb-4">
          El/la trabajador/a declara haber sido informado/a de la existencia de
          cámaras de seguridad instaladas en las instalaciones de la empresa
          Avícola La Paloma (en adelante "la Empresa"), cuya finalidad exclusiva
          es la prevención de riesgos, seguridad de las personas, resguardo de
          bienes materiales y control del cumplimiento de normas laborales.
        </p>

        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li className="text-justify leading-relaxed">
            Las cámaras se encuentran ubicadas en espacios comunes y áreas de
            trabajo, sin invadir espacios privados.
          </li>
          <li className="text-justify leading-relaxed">
            Las imágenes captadas podrán ser utilizadas como medio de prueba en
            caso de ser necesario y se almacenarán por un período limitado
            conforme a la política interna de la Empresa.
          </li>
        </ul>

        <h2 className="text-lg font-bold mt-8 mb-4">
          2. Datos Biométricos – Registro de Huella Digital
        </h2>

        <p className="text-justify leading-relaxed mb-4">
          El/la trabajador/a presta consentimiento para la recolección y
          tratamiento de su dato biométrico (huella digital) con la finalidad de:
        </p>

        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li className="text-justify leading-relaxed">
            Registrar su asistencia y puntualidad mediante el reloj biométrico
            implementado por la Empresa.
          </li>
          <li className="text-justify leading-relaxed">
            Garantizar la correcta administración de la jornada laboral.
          </li>
        </ul>

        <p className="text-justify leading-relaxed mb-6">
          Los datos biométricos serán tratados con carácter estrictamente
          confidencial, almacenados en soportes digitales seguros y utilizados
          únicamente para la finalidad descripta. No serán cedidos a terceros,
          salvo obligación legal.
        </p>

        <h2 className="text-lg font-bold mt-8 mb-4">3. Derechos del Trabajador/a</h2>

        <p className="text-justify leading-relaxed mb-2">
          El/la trabajador/a reconoce que:
        </p>

        {/* Page Break */}
        <div style={{ pageBreakAfter: "always" }}></div>

        {/* Page 2 */}
        <ul className="list-disc pl-8 mb-8 space-y-2 mt-6">
          <li className="text-justify leading-relaxed">
            Puede ejercer en cualquier momento sus derechos de acceso,
            rectificación, actualización o supresión de los datos conforme lo
            establece la Ley N° 25.326.
          </li>
          <li className="text-justify leading-relaxed">
            Su consentimiento puede ser revocado mediante notificación fehaciente
            a la Empresa, sin efectos retroactivos sobre el tratamiento ya
            realizado.
          </li>
        </ul>

        <div className="mt-16 space-y-12">
          <div>
            <h3 className="text-base font-bold mb-6">Firma del Trabajador/a</h3>
            <div className="space-y-4">
              <p>Nombre y Apellido: _________________________________</p>
              <p>DNI: _________________________________</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold mb-6">Firma de la Empresa</h3>
            <div className="space-y-4">
              <p>Representante: _________________________________</p>
              <p>Cargo: _________________________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ConsentimientoDatosBiometricos.displayName = "ConsentimientoDatosBiometricos";

export default ConsentimientoDatosBiometricos;