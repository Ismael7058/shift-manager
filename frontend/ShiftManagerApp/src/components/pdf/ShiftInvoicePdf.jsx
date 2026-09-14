import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const pad = (n) => String(n).padStart(2, '0');

// Formatea la fecha del turno respetando UTC para coincidir con la hora agendada (ej: "19/09/2026")
const formatShiftDate = (isoString) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '-';
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
};

// Formatea la hora del turno respetando UTC (ej: "09:00")
const formatShiftTime = (isoString) => {
  if (!isoString) return '--:--';
  const d = new Date(isoString);
  return isNaN(d.getTime()) ? '--:--' : `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
};

// Formatea fecha de emisión en hora local (ej: "19/09/2026")
const formatEmissionDate = (isoString) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (amount) => {
  return `$ ${Number(amount || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const STATUS_LABELS = {
  confirmed: 'Confirmado',
  completed: 'Completado',
  pending: 'Pendiente',
  canceled: 'Cancelado',
  no_show: 'No Asistió'
};

const ShiftInvoicePdf = ({ shift }) => {
  if (!shift) return null;

  const statusLabel = STATUS_LABELS[shift.status?.toLowerCase()] || shift.status || 'Registrado';
  const shiftDate = formatShiftDate(shift.startAt);
  const shiftTimeRange = `${formatShiftTime(shift.startAt)} a ${formatShiftTime(shift.endAt)}`;


  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>ShiftManager</Text>
            <Text style={styles.brandSubtitle}>Sistema de Gestión de Turnos y Citas</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>COMPROBANTE DE TURNO</Text>
            <Text style={styles.invoiceMeta}>N° Turno: #{String(shift.id).padStart(5, '0')}</Text>
            <Text style={styles.invoiceMeta}>Fecha emisión: {formatEmissionDate(shift.createdAt)}</Text>
            <Text style={styles.statusBadge}>{statusLabel}</Text>
          </View>
        </View>

        {/* Datos Principales (Cliente y Cita) */}
        <View style={styles.metaContainer}>
          <View style={styles.metaBlock}>
            <Text style={styles.sectionTitle}>Datos del Cliente</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Cliente:</Text>
              <Text style={styles.metaValue}>{shift.clientFullName || '-'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Registrado por:</Text>
              <Text style={styles.metaValue}>{shift.createdByUser?.fullName || '-'}</Text>
            </View>
          </View>

          <View style={styles.metaBlock}>
            <Text style={styles.sectionTitle}>Detalles de la Cita</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Profesional:</Text>
              <Text style={styles.metaValue}>{shift.providerFullName || '-'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Fecha:</Text>
              <Text style={styles.metaValue}>{shiftDate}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Horario:</Text>
              <Text style={styles.metaValue}>{shiftTimeRange}</Text>
            </View>
          </View>
        </View>

        {/* Tabla de Servicios */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCol, styles.colService]}>Servicio / Tratamiento</Text>
            <Text style={[styles.tableHeaderCol, styles.colDuration]}>Duración</Text>
            <Text style={[styles.tableHeaderCol, styles.colPrice]}>Precio</Text>
          </View>

          {(shift.items || []).map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.colService}>
                <Text style={styles.serviceName}>{item.nameService}</Text>
              </View>
              <Text style={[styles.cellText, styles.colDuration]}>
                {item.durationMinutes} min
              </Text>
              <Text style={[styles.cellText, styles.colPrice]}>
                {formatCurrency(item.priceAtMoment || item.price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Bloque del Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a Pagar:</Text>
              <Text style={styles.totalValue}>{formatCurrency(shift.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Pie de Página */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Comprobante no válido como factura fiscal • Gracias por su preferencia
          </Text>
          <Text style={styles.auditText}>
            ShiftManager App
          </Text>
        </View>

      </Page>
    </Document>
  );
};


const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 35,
    color: '#1f2937',
    backgroundColor: '#ffffff'
  },
  // Encabezado
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#4f46e5',
    paddingBottom: 15,
    marginBottom: 20
  },
  brandTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#111827'
  },
  brandSubtitle: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2
  },
  invoiceInfo: {
    alignItems: 'flex-end'
  },
  invoiceTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#4f46e5',
    marginBottom: 4
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 2
  },
  statusBadge: {
    marginTop: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: '#e0e7ff',
    borderRadius: 4,
    color: '#3730a3',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    textTransform: 'uppercase'
  },
  // Bloques de Información
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  metaBlock: {
    width: '48%'
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#4f46e5',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  metaLabel: {
    width: 75,
    color: '#6b7280',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9
  },
  metaValue: {
    flex: 1,
    color: '#111827',
    fontSize: 9
  },
  // Tabla de Items
  table: {
    width: '100%',
    marginBottom: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  tableHeaderCol: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: '#374151',
    textTransform: 'uppercase'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: 'center'
  },
  colService: {
    flex: 5
  },
  colDuration: {
    flex: 2,
    textAlign: 'center'
  },
  colPrice: {
    flex: 3,
    textAlign: 'right'
  },
  serviceName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937'
  },
  cellText: {
    fontSize: 9,
    color: '#4b5563'
  },
  // Sección de Totales
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
    marginBottom: 25
  },
  totalBox: {
    width: 180,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827'
  },
  totalValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#4f46e5'
  },
  // Pie de Página
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af'
  },
  auditText: {
    fontSize: 8,
    color: '#6b7280'
  }
});


export default ShiftInvoicePdf;
