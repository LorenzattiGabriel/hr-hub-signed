import React from "react";

interface ReglamentoInternoProps {
  employeeName: string;
  date: string;
}

const ReglamentoInterno = React.forwardRef<
  HTMLDivElement,
  ReglamentoInternoProps
>(({ employeeName, date }, ref) => {
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
        <h1 className="text-center text-2xl font-bold uppercase mb-2">
          REGLAMENTO INTERNO
        </h1>
        <h2 className="text-center text-xl font-bold uppercase mb-8">
          AVÍCOLA LA PALOMA
        </h2>

        <p className="mb-2">
          <strong>Fecha:</strong> {date}
        </p>
        <p className="mb-6">
          <strong>Nombre del empleado:</strong> {employeeName}
        </p>

        <p className="text-justify leading-relaxed mb-6">
          Este reglamento tiene por objetivo establecer normas claras de
          convivencia, obligaciones, derechos y procedimientos que garanticen un
          ambiente de trabajo ordenado, seguro y respetuoso para todos.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-4">
          1. Obligaciones y deberes de los empleados
        </h3>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li className="text-justify leading-relaxed">
            Cumplir con las obligaciones propias del puesto de trabajo, conforme a
            los principios de buena fe, diligencia y responsabilidad.
          </li>
          <li className="text-justify leading-relaxed">
            Mantener el orden y aseo de los lugares de acceso común y convivencia
            con compañeros de trabajo.
          </li>
          <li className="text-justify leading-relaxed">
            Cuidar y conservar en condiciones óptimas las herramientas,
            maquinarias, elementos de limpieza y demás materiales de trabajo.
          </li>
          <li className="text-justify leading-relaxed">
            Cumplir y respetar las medidas de seguridad e higiene establecidas por
            la empresa.
          </li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-4">
          2. Derechos de los empleados
        </h3>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li className="text-justify leading-relaxed">
            Desempeñarse en un ambiente sano, seguro y libre de riesgos
            innecesarios.
          </li>
          <li className="text-justify leading-relaxed">
            Conocer los riesgos inherentes a su puesto de trabajo.
          </li>
          <li className="text-justify leading-relaxed">
            Percibir una retribución justa acorde a las tareas realizadas.
          </li>
          <li className="text-justify leading-relaxed">
            Recibir los elementos de trabajo y de protección personal necesarios
            según la tarea a realizar.
          </li>
          <li className="text-justify leading-relaxed">
            Acceder al descanso vacacional anual conforme a la normativa vigente.
          </li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-4">
          3. Normas de trabajo dentro de la granja
        </h3>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li className="text-justify leading-relaxed">
            Queda prohibido fumar en las zonas de trabajo.
          </li>
          <li className="text-justify leading-relaxed">
            No se podrá utilizar el teléfono celular en horario laboral, salvo
            para fines estrictamente laborales.
          </li>
          <li className="text-justify leading-relaxed">
            Mantener en todo momento un trato de respeto y educación hacia
            compañeros, superiores y público en general.
          </li>
          <li className="text-justify leading-relaxed">
            Presentarse al trabajo con higiene personal adecuada y con el uniforme
            limpio y en buen estado.
          </li>
          <li className="text-justify leading-relaxed">
            Queda prohibido jugar con herramientas de trabajo o darles un uso
            indebido.
          </li>
          <li className="text-justify leading-relaxed">
            Es obligatorio el uso de gafas de seguridad cuando la tarea lo
            requiera.
          </li>
        </ul>

        {/* Page Break */}
        <div style={{ pageBreakAfter: "always" }}></div>

        {/* Page 2 */}
        <h3 className="text-lg font-bold mt-6 mb-4">4. Prohibiciones</h3>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li className="text-justify leading-relaxed">
            Faltar al trabajo sin causa justificada o sin autorización previa.
          </li>
          <li className="text-justify leading-relaxed">
            Sustraer de la empresa herramientas, insumos, materia prima o
            productos elaborados.
          </li>
          <li className="text-justify leading-relaxed">
            Presentarse al trabajo en estado de embriaguez.
          </li>
          <li className="text-justify leading-relaxed">
            Presentarse bajo los efectos de narcóticos o drogas enervantes, salvo
            prescripción médica debidamente acreditada.
          </li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-4">
          5. Certificados y ausencias
        </h3>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li className="text-justify leading-relaxed">
            En caso de enfermedad, el trabajador deberá avisar con al menos 2
            horas de anticipación sobre su ausencia, salvo situaciones de urgencia.
          </li>
          <li className="text-justify leading-relaxed">
            El certificado médico deberá ser cargado en el formulario de ausencias
            dentro de las 24 horas de producida la falta.
          </li>
          <li className="text-justify leading-relaxed">
            Las vacaciones deberán solicitarse en el mes de octubre indicando las
            fechas de preferencia. La empresa, en base a la demanda productiva y
            organización interna, asignará los períodos entre noviembre y abril.
          </li>
          <li className="text-justify leading-relaxed">
            La falta de presentación del certificado en tiempo y forma dará lugar
            al descuento del día no trabajado. En caso de reincidencia, el
            trabajador podrá recibir un apercibimiento y, si la conducta persiste,
            suspensión.
          </li>
          <li className="text-justify leading-relaxed">
            El incumplimiento reiterado de este reglamento podrá derivar en
            sanciones disciplinarias según la gravedad del caso.
          </li>
        </ul>

        <h3 className="text-lg font-bold mt-6 mb-4">6. Sanciones</h3>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li className="text-justify leading-relaxed">
            Apercibimiento verbal o escrito.
          </li>
          <li className="text-justify leading-relaxed">
            Descuento de haberes en los casos que corresponda.
          </li>
          <li className="text-justify leading-relaxed">
            Suspensión según la gravedad y reiteración de las faltas.
          </li>
          <li className="text-justify leading-relaxed">
            En casos extremos y de gravedad, la empresa podrá evaluar la extinción
            de la relación laboral conforme a la legislación vigente.
          </li>
        </ul>

        <p className="text-justify leading-relaxed mb-8">
          Este Reglamento Interno entra en vigencia a partir de su comunicación a
          los empleados y deberá ser conocido, respetado y cumplido por todos los
          integrantes de Avícola La Paloma.
        </p>

        <div className="mt-12">
          <p className="mb-8">
            <strong>Firma Empleado</strong>
          </p>
          <p>Aclaración: _________________________________</p>
        </div>
      </div>
    </div>
  );
});

ReglamentoInterno.displayName = "ReglamentoInterno";

export default ReglamentoInterno;