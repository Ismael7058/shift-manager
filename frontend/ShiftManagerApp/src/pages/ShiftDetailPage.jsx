import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useShift } from '../context/ShiftsContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ChangeStatusShiftModal from '../components/shifts/ChangeStatusShiftModal';
import { parseDateToLocal } from '../utils/dateUtils';


const ShiftDetailPage = () => {
  const { id } = useParams();
  const { shift, loading, getShift } = useShift();
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const [modalAction, setModalAction] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    if (id) {
      getShift(id);
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);


  const handleDownloadPdf = () => {
    addNotification('La generación y descarga del comprobante en PDF estará disponible próximamente.', 'info');
  };


  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { label: 'Confirmado', badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' };
      case 'completed':
        return { label: 'Completado', badgeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' };
      case 'canceled':
        return { label: 'Cancelado', badgeClass: 'bg-red-500/20 text-red-400 border border-red-500/30' };
      case 'no_show':
        return { label: 'No Asistió', badgeClass: 'bg-neutral-600/30 text-neutral-300 border border-neutral-500/30' };
      case 'pending':
        return { label: 'Pendiente', badgeClass: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' };
      default:
        return { label: status || 'Desconocido', badgeClass: 'bg-neutral-800 text-white/80 border border-white/10' };
    }
  };

  const formatTime = (d) => (d ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} hs` : '--:--');

  const formatShiftDate = (iso) => {
    const d = parseDateToLocal(iso);
    return d ? d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-';
  };

  const formatCreatedAt = (iso) => {
    const d = parseDateToLocal(iso);
    return d ? `${d.toLocaleDateString('es-ES')} a las ${formatTime(d)}` : '-';
  };

  const getClientInitials = (name) => (name ? name.trim().split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() : 'C');

  // 5. Estado Derivado y Tiempos
  const role = user?.roleActive;
  const isClient = role === 'Cliente';
  const currentStatus = (shift?.status || '').toLowerCase();
  const statusInfo = getStatusBadge(currentStatus);
  const isClosed = ['completed', 'canceled', 'no_show'].includes(currentStatus);

  const shiftStartDate = parseDateToLocal(shift?.startAt);
  const shiftEndDate = parseDateToLocal(shift?.endAt);
  const isShiftStarted = shiftStartDate ? currentTime >= shiftStartDate : false;
  const fiveMinutesAfterStart = shiftStartDate ? new Date(shiftStartDate.getTime() + 5 * 60 * 1000) : null;
  const canMarkNoShow = fiveMinutesAfterStart ? currentTime >= fiveMinutesAfterStart : false;

  const startTimeFormatted = formatTime(shiftStartDate);
  const noShowTimeFormatted = formatTime(fiveMinutesAfterStart);
  const totalDuration = (shift?.items || []).reduce((acc, item) => acc + (Number(item.durationMinutes) || 0), 0);

  if (loading && !shift) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-white/50 space-y-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm">Cargando detalles del turno...</p>
        </div>
      </div>
    );
  }

  if (!shift && !loading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-white space-y-4 text-center">
          <span className="material-symbols-outlined text-4xl text-white/40">event_busy</span>
          <div>
            <h2 className="text-xl font-bold">Turno no encontrado</h2>
            <p className="text-xs text-white/50 mt-1">No se encontró ningún turno con el identificador #{id}.</p>
          </div>
          <Link
            to="/turnos"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            ← Volver a Turnos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/turnos"
              className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>← Volver a Turnos</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Detalles del Turno #{shift.id}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Administra la información de la cita, participantes, servicios contratados y estado.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 text-white border border-white/10 font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-2 active:scale-[0.98]"
            title="Descargar comprobante en PDF"
          >
            <span className="material-symbols-outlined text-[18px] text-red-400">picture_as_pdf</span>
            Descargar Comprobante PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Columna Izquierda */}
        <div className="lg:col-span-6 bg-neutral-900 border border-white/10 rounded-xl p-6 shadow-2xl text-white flex flex-col justify-between min-h-[560px]">
          <div>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2 mb-4">
              1. Información del Turno
            </h2>

            <div className="flex items-center gap-4 mb-5 p-4 bg-neutral-800/30 border border-white/10 rounded-lg">
              <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-lg border border-white/10 shadow-md shrink-0">
                {getClientInitials(shift.clientFullName)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] bg-white/5 text-white/60 px-2 py-0.5 font-semibold uppercase tracking-wider">
                    Cliente
                  </span>
                </div>
                <h3 className="text-base font-bold text-white truncate">
                  {shift.clientFullName || `Cliente #${shift.clientId}`}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Profesional Asignado</label>
                <div className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-white/40">badge</span>
                  <span className="truncate">{shift.providerFullName || `Proveedor #${shift.providerId}`}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Fecha del Turno</label>
                <div className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white text-sm font-medium capitalize flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-white/40">calendar_today</span>
                  <span className="truncate">{formatShiftDate(shift.startAt)}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Horario (24 hs)</label>
                  <div className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-white/40">schedule</span>
                      <span>{shiftStartDate ? `${formatTime(shiftStartDate).replace(' hs', '')} a ${formatTime(shiftEndDate)}` : '-'}</span>
                    </div>
                    <span className="text-xs text-white/40 font-mono">~{totalDuration} min</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Fecha de Registro</label>
                  <div className="w-full bg-neutral-800/50 border border-white/10 p-2.5 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-white/40">history</span>
                    <span className="truncate">{shift.createdAt ? formatCreatedAt(shift.createdAt) : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
            {isClosed ? (
              <div className="p-3.5 bg-neutral-800/30 border border-white/10 rounded-lg text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white/90">
                  <span className="material-symbols-outlined text-[16px] text-white/50">lock</span>
                  <span>Turno finalizado ({statusInfo.label})</span>
                </div>
                <p className="text-[11px] text-white/50">
                  Este turno se encuentra cerrado y no admite modificaciones de estado.
                </p>
              </div>
            ) : isClient ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-white/40 leading-relaxed">
                  ¿No puedes asistir? Cancela con anticipación para liberar la agenda.
                </p>
                <button
                  type="button"
                  onClick={() => setModalAction('canceled')}
                  className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  Cancelar Turno
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {currentStatus === 'pending' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Acciones operativas
                      </span>
                      <span className="text-[11px] text-yellow-400/90 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Pendiente de confirmación
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setModalAction('canceled')}
                        className="w-full py-2.5 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalAction('confirmed')}
                        className="w-full py-2.5 px-3 bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}

                {currentStatus === 'confirmed' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Acciones operativas
                      </span>
                      {!isShiftStarted ? (
                        <span className="text-[11px] text-blue-400/90 bg-blue-400/10 border border-blue-400/20 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 whitespace-nowrap">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          Inicia a las {startTimeFormatted}
                        </span>
                      ) : !canMarkNoShow ? (
                        <span className="text-[11px] text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 whitespace-nowrap">
                          <span className="material-symbols-outlined text-[13px]">timer</span>
                          Tolerancia hasta las {noShowTimeFormatted}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-400/90 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 whitespace-nowrap">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          En horario de atención
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setModalAction('canceled')}
                        className="w-full py-2.5 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-medium text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                        title="Cancelar turno"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                        <span>Cancelar</span>
                      </button>

                      <button
                        type="button"
                        disabled={!canMarkNoShow}
                        onClick={() => canMarkNoShow && setModalAction('no_show')}
                        className={`w-full py-2.5 px-3 font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 ${canMarkNoShow
                          ? 'bg-neutral-800/80 hover:bg-neutral-700 text-white/90 border border-white/10 cursor-pointer active:scale-[0.98]'
                          : 'bg-neutral-800/40 text-white/30 border border-white/5 cursor-not-allowed'
                          }`}
                        title={
                          canMarkNoShow
                            ? 'Registrar no asistencia'
                            : `Disponible a las ${noShowTimeFormatted} (5 min de tolerancia)`
                        }
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {canMarkNoShow ? 'person_off' : 'lock'}
                        </span>
                        <span>No Asistió</span>
                      </button>

                      <button
                        type="button"
                        disabled={!isShiftStarted}
                        onClick={() => isShiftStarted && setModalAction('completed')}
                        className={`w-full py-2.5 px-3 font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 ${isShiftStarted
                          ? 'bg-blue-600/80 hover:bg-blue-600 text-white cursor-pointer active:scale-[0.98]'
                          : 'bg-neutral-800/40 text-white/30 border border-white/5 cursor-not-allowed'
                          }`}
                        title={
                          isShiftStarted
                            ? 'Completar turno'
                            : `Disponible a las ${startTimeFormatted} al iniciar la cita`
                        }
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isShiftStarted ? 'task_alt' : 'lock'}
                        </span>
                        <span>Completar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-6 bg-neutral-900 border border-white/10 rounded-xl p-6 shadow-2xl text-white flex flex-col justify-between min-h-[560px]">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                2. Servicios Contratados
              </h2>
              <span className="text-xs bg-white/5 text-white/70 px-2.5 py-0.5 rounded-full border border-white/10 font-medium">
                Items: <span className="text-white font-bold">{shift.items?.length || 0}</span>
                {totalDuration > 0 && <span className="ml-1 text-white/40 font-mono">({totalDuration} min)</span>}
              </span>
            </div>

            {/* Servicios */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {shift.items && shift.items.length > 0 ? (
                shift.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between p-3.5 bg-neutral-800/30 border border-white/10 rounded-lg hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-white/60 border border-white/10 shrink-0">
                        <span className="material-symbols-outlined text-[18px]">spa</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {item.nameService || `Servicio #${item.serviceId}`}
                        </p>
                        {item.durationMinutes && (
                          <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                            {item.durationMinutes} min de duración
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-white">
                        ${Number(item.priceAtMoment || 0).toFixed(2)}
                      </span>
                      <p className="text-[10px] text-white/40 uppercase">Congelado</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-white/40 space-y-2">
                  <span className="material-symbols-outlined text-[32px] text-white/20">spa</span>
                  <p className="text-xs italic">
                    No hay servicios contratados registrados para este turno.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
            <div className="p-4 bg-neutral-800/40 border border-white/10 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Duración estimada total:</span>
                <span className="font-mono text-white/90">~{totalDuration} minutos</span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Condición de tarifa:</span>
                <span className="text-emerald-400 font-medium">Congelada al reservar</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50 uppercase font-bold tracking-wider">Total a Pagar</p>
                  <p className="text-[11px] text-white/40">Tarifa fija acordada</p>
                </div>
                <p className="text-2xl font-extrabold text-white tracking-tight">
                  ${Number(shift.totalAmount || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auditoria */}
      {user?.roleActive === 'Administrador' && (
        <div className="mt-6 bg-neutral-900 border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-sm text-white">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-4">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              3. Auditoría
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Creador */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-cyan-400 text-base">person_add</span>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Creado por</p>
              </div>
              <p className="text-sm font-semibold text-white">{shift?.createdByUser?.fullName || 'Desconocido'}</p>
              <div className="mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Rol: {shift?.createdByRole || 'N/A'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">
                {shift?.createdAt && new Date(shift.createdAt).toLocaleString('es-AR')}
              </p>
            </div>
            {/* Confirmador */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-emerald-400 text-base">verified</span>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Confirmado por</p>
              </div>
              {shift?.confirmedByUser ? (
                <div>
                  <p className="text-sm font-semibold text-white">{shift.confirmedByUser.fullName}</p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Confirmado
                  </span>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic mt-1">Sin confirmar</p>
              )}
            </div>
            {/* Cancelador */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-rose-400 text-base">cancel</span>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Cancelado por</p>
              </div>
              {shift?.canceledByUser ? (
                <div>
                  <p className="text-sm font-semibold text-white">{shift.canceledByUser.fullName}</p>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Cancelado
                  </span>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic mt-1">No cancelado</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Estado */}
      <ChangeStatusShiftModal
        isOpen={Boolean(modalAction)}
        onClose={() => setModalAction(null)}
        shift={shift}
        action={modalAction}
        statusInfo={statusInfo}
        onSuccess={() => getShift(id)}
      />
    </div>
  );
};

export default ShiftDetailPage;
