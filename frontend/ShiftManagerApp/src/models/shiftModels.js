// =============================================================================
// MODELOS COMPARTIDOS / COMUNES (Shared)
// =============================================================================

/**
 * Respuesta genérica paginada devuelta por los endpoints con listado
 * @template T
 * @typedef {Object} PaginatedDto
 * @property {T[]} items - Colección de elementos de la página actual
 * @property {number} totalCount - Cantidad total de registros disponibles
 * @property {number} pageNumber - Número de página actual (1-based)
 * @property {number} pageSize - Cantidad de registros por página
 * @property {number} totalPages - Total de páginas calculadas
 */

/**
 * Rango de fechas / horarios para bloqueos o indisponibilidades
 * @typedef {Object} DateRangeDto
 * @property {string} startAt - Fecha y hora de inicio (formato ISO 8601 UTC)
 * @property {string} endAt - Fecha y hora de fin (formato ISO 8601 UTC)
 */

/**
 * Payload para activación o desactivación de entidades
 * @typedef {Object} UpdateStatusDto
 * @property {boolean} isActive - Estado activo (true) o inactivo (false)
 */

/**
 * Resumen básico de usuario utilizado en relaciones y auditoría
 * @typedef {Object} UserResumDto
 * @property {number} id - Identificador único del usuario
 * @property {string} fullName - Nombre completo del usuario
 */

/**
 * Tipos de género admitidos en el sistema
 * @typedef {'male' | 'female' | 'other'} GenderType
 */

// =============================================================================
// AUTENTICACIÓN Y ROLES (Auth / Role)
// =============================================================================

/**
 * Credenciales para inicio de sesión
 * @typedef {Object} LoginDto
 * @property {string} identifier - Email o Nombre de usuario
 * @property {string} password - Contraseña
 */

/**
 * Payload para el registro de nuevos usuarios
 * @typedef {Object} RegisterDto
 * @property {string} firstName - Nombre (1-50 caracteres, letras y espacios)
 * @property {string} lastName - Apellido (1-50 caracteres, letras y espacios)
 * @property {string} dateOfBirth - Fecha de nacimiento en formato DateOnly (YYYY-MM-DD)
 * @property {GenderType} gender - Género ('male' | 'female' | 'other')
 * @property {string} [phoneNumber] - Teléfono de contacto (8-15 dígitos)
 * @property {string} username - Nombre de usuario único
 * @property {string} email - Correo electrónico válido
 * @property {string} password - Contraseña (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo)
 * @property {string} confirmPassword - Debe coincidir con password
 */

/**
 * Datos de respuesta de autenticación exitosa
 * @typedef {Object} AuthTokenDto
 * @property {string} accessToken - Token JWT de acceso (también enviado en Cookie HTTP-only)
 * @property {string} refreshToken - Token de refresco
 * @property {string} expiration - Fecha de expiración (formato DateOnly YYYY-MM-DD)
 * @property {UserDto} user - Datos del perfil del usuario logueado
 * @property {string} roleActive - Rol activo con el que opera la sesión
 */

/**
 * Payload para seleccionar o enviar un rol
 * @typedef {Object} RoleDto
 * @property {string} name - Nombre del rol
 */

/**
 * Catálogo de roles del sistema
 * @typedef {Object} RoleResponseDto
 * @property {number} id - Identificador del rol
 * @property {string} name - Nombre del rol (ej: 'Administrador', 'Proveedor', 'Recepcion', 'Cliente')
 */

// =============================================================================
// USUARIOS (User / Profile)
// =============================================================================

/**
 * Representación completa del perfil de un usuario
 * @typedef {Object} UserDto
 * @property {number} id - Identificador único del usuario
 * @property {string} firstName - Nombre
 * @property {string} lastName - Apellido
 * @property {string} dateOfBirth - Fecha de nacimiento (YYYY-MM-DD)
 * @property {string} gender - Género del usuario
 * @property {string} [phoneNumber] - Teléfono de contacto
 * @property {string} username - Nombre de usuario
 * @property {string} email - Correo electrónico
 * @property {string} [pictureURL] - URL de la imagen de perfil
 * @property {boolean} [isActive] - Estado de la cuenta (activo/inactivo)
 * @property {string[]} roles - Lista de nombres de roles asignados
 */

/**
 * Filtros para la búsqueda paginada de usuarios (Admin)
 * @typedef {Object} UserFilterDto
 * @property {string} [name] - Búsqueda por nombre o apellido
 * @property {string} [email] - Búsqueda por correo electrónico
 * @property {string} [username] - Búsqueda por username
 * @property {number} [role] - Filtrar por ID de rol asignado
 * @property {number} [isActive] - Filtrar por estado (1: activo, 0: inactivo)
 * @property {string} [sortBy] - Campo de ordenamiento
 * @property {boolean} [isDescending] - Si el orden es descendente
 * @property {number} [pageNumber] - Número de página (default: 1)
 * @property {number} [pageSize] - Tamaño de página (default: 10)
 */

/**
 * Payload para la creación administrativa de un usuario
 * @typedef {Object} CreateUserDto
 * @property {string} firstName - Nombre
 * @property {string} lastName - Apellido
 * @property {string} dateOfBirth - Fecha de nacimiento (YYYY-MM-DD)
 * @property {GenderType} gender - Género ('male' | 'female' | 'other')
 * @property {string} [phoneNumber] - Teléfono
 * @property {string} username - Nombre de usuario
 * @property {string} email - Correo electrónico
 * @property {string} password - Contraseña
 * @property {string} confirmPassword - Confirmación de contraseña
 * @property {number[]} rolesId - Lista de IDs de roles que se le asignarán
 */

/**
 * Payload para actualización de datos personales del perfil
 * @typedef {Object} UpdateUserDto
 * @property {string} [firstName] - Nombre
 * @property {string} [lastName] - Apellido
 * @property {string} [dateOfBirth] - Fecha de nacimiento (YYYY-MM-DD)
 * @property {GenderType} [gender] - Género
 * @property {string} [phoneNumber] - Teléfono
 */

/**
 * Payload para cambio de email
 * @typedef {Object} EditEmailDto
 * @property {string} email - Nuevo correo electrónico
 */

/**
 * Payload para cambio de nombre de usuario
 * @typedef {Object} EditUsernameDto
 * @property {string} username - Nuevo nombre de usuario (1-70 caracteres)
 */

/**
 * Payload para reseteo directo de contraseña (Administrador)
 * @typedef {Object} EditPasswordDto
 * @property {string} newPassword - Nueva contraseña
 * @property {string} confirmPassword - Confirmación de la nueva contraseña
 */

/**
 * Payload para cambio de contraseña por parte del propio usuario en perfil
 * @typedef {Object} EditPasswordProfileDto
 * @property {string} oldPassword - Contraseña actual
 * @property {string} newPassword - Nueva contraseña
 * @property {string} confirmPassword - Confirmación de la nueva contraseña
 */

// =============================================================================
// CLIENTES (Client)
// =============================================================================

/**
 * Datos públicos de un cliente
 * @typedef {Object} ClientDto
 * @property {number} id - Identificador del cliente
 * @property {string} firstName - Nombre
 * @property {string} lastName - Apellido
 * @property {string} username - Nombre de usuario
 * @property {string} email - Correo electrónico
 * @property {string} phoneNumber - Teléfono de contacto
 * @property {string} [pictureURL] - URL del avatar
 */

/**
 * Filtros para el listado paginado de clientes
 * @typedef {Object} ClientFilterDto
 * @property {string} [name] - Búsqueda por nombre o apellido
 * @property {string} [sortBy] - Campo de orden
 * @property {boolean} [isDescending] - Orden descendente
 * @property {number} [pageNumber] - Número de página (default: 1)
 * @property {number} [pageSize] - Cantidad de registros por página (default: 10)
 */

// =============================================================================
// SERVICIOS GENERALES (Service Catalog)
// =============================================================================

/**
 * Imagen asociada a un servicio
 * @typedef {Object} ServiceImageDto
 * @property {number} id - Identificador de la imagen
 * @property {number} serviceId - Identificador del servicio asociado
 * @property {string} imageUrl - URL pública de la imagen
 */

/**
 * Servicio del catálogo general del sistema
 * @typedef {Object} ServiceDto
 * @property {number} id - Identificador único del servicio
 * @property {string} name - Nombre del servicio
 * @property {string} [description] - Descripción detallada
 * @property {number} durationMinutes - Duración base en minutos
 * @property {boolean} isActive - Estado de disponibilidad en el sistema
 * @property {ServiceImageDto[]} [images] - Galería de imágenes del servicio
 */

/**
 * Payload para crear un nuevo servicio base
 * @typedef {Object} CreateServiceDto
 * @property {string} name - Nombre del servicio
 * @property {string} [description] - Descripción
 * @property {number} durationMinutes - Duración base en minutos (> 0)
 */

/**
 * Payload para actualizar un servicio base
 * @typedef {Object} UpdateServiceDto
 * @property {string} name - Nombre del servicio
 * @property {string} [description] - Descripción
 * @property {number} durationMinutes - Duración base en minutos (> 0)
 */

/**
 * Filtros para la búsqueda en el catálogo general de servicios
 * @typedef {Object} ServiceFilterDto
 * @property {string} [name] - Filtro por nombre
 * @property {number} [minDurationMinutes] - Duración mínima
 * @property {number} [maxDurationMinutes] - Duración máxima
 * @property {number} [isActive] - Estado (1: activo, 0: inactivo)
 * @property {string} [sortBy] - Campo de orden
 * @property {boolean} [isDescending] - Orden descendente
 * @property {number} [pageNumber] - Número de página (default: 1)
 * @property {number} [pageSize] - Tamaño de página (default: 10)
 */

// =============================================================================
// PROVEEDORES Y SERVICIOS DEL PROVEEDOR (Provider / ProviderService)
// =============================================================================

/**
 * Servicio configurado y personalizado por un proveedor
 * @typedef {Object} ProviderServiceDto
 * @property {number} id - ID de la asociación proveedor-servicio
 * @property {number} providerId - ID del proveedor
 * @property {number} serviceId - ID del servicio base del catálogo
 * @property {string} name - Nombre del servicio
 * @property {string} [description] - Descripción del servicio
 * @property {number} durationMinutes - Duración personalizada del proveedor
 * @property {number} durationMinutesBase - Duración base original del catálogo
 * @property {number} price - Precio establecido por el proveedor
 * @property {number} status - Estado de disponibilidad (1: activo, 0: inactivo)
 * @property {ServiceImageDto[]} [images] - Imágenes del servicio
 */

/**
 * Información completa del perfil y servicios de un proveedor
 * @typedef {Object} ProviderDto
 * @property {number} id - Identificador del proveedor
 * @property {string} firstName - Nombre
 * @property {string} lastName - Apellido
 * @property {string} [pictureURL] - Foto de perfil
 * @property {ProviderServiceDto[]} service - Lista de servicios habilitados
 * @property {ProviderServiceDto[]} [items] - Alias compatible con colecciones de servicios
 * @property {WorkSchedulesDto[]} works - Franjas de horarios laborales configuradas
 * @property {DateRangeDto[]} restrictedDates - Períodos restringidos / no disponibles
 */

/**
 * Filtros para listado paginado de proveedores
 * @typedef {Object} ProviderFilterDto
 * @property {string} [name] - Búsqueda por nombre o apellido
 * @property {string} [sortBy] - Campo de orden
 * @property {boolean} [isDescending] - Orden descendente
 * @property {boolean} [includeServices] - Si incluye servicios asociados en la respuesta
 * @property {boolean} [includeWorkSchedules] - Si incluye horarios laborales
 * @property {boolean} [includeRestrictedDates] - Si incluye fechas restringidas
 * @property {number} [pageNumber] - Número de página (default: 1)
 * @property {number} [pageSize] - Tamaño de página (default: 10)
 */

/**
 * Payload para asociar un servicio del catálogo al proveedor con precio y duración propia
 * @typedef {Object} CreateProviderServiceDto
 * @property {number} serviceId - ID del servicio base
 * @property {number} durationMinutes - Duración específica en minutos
 * @property {number} price - Precio configurado
 */

/**
 * Payload para modificar la duración y precio de un servicio del proveedor
 * @typedef {Object} UpdateProviderServiceDto
 * @property {number} durationMinutes - Nueva duración en minutos
 * @property {number} price - Nuevo precio
 */

/**
 * Filtros para el listado de servicios de proveedores
 * @typedef {Object} ProviderServiceFilterDto
 * @property {string} [name] - Nombre del servicio
 * @property {number} [minDurationMinutes] - Duración mínima
 * @property {number} [maxDurationMinutes] - Duración máxima
 * @property {number} [minPrice] - Precio mínimo
 * @property {number} [maxPrice] - Precio máximo
 * @property {number} [isActive] - Estado (1: activo, 0: inactivo)
 * @property {string} [sortBy] - Campo de ordenamiento
 * @property {boolean} [isDescending] - Orden descendente
 * @property {number} [pageNumber] - Número de página (default: 1)
 * @property {number} [pageSize] - Tamaño de página (default: 10)
 */

// =============================================================================
// HORARIOS LABORALES (WorkSchedules)
// =============================================================================

/**
 * Franja horaria laboral de un proveedor
 * @typedef {Object} WorkSchedulesDto
 * @property {number} id - Identificador de la franja horaria
 * @property {number} providerId - ID del proveedor propietario
 * @property {number} dayOfWeek - Día de la semana (0: Domingo, 1: Lunes, ..., 6: Sábado)
 * @property {string} startTime - Hora de inicio en formato TimeOnly (HH:mm:ss o HH:mm)
 * @property {string} endTime - Hora de fin en formato TimeOnly (HH:mm:ss o HH:mm)
 * @property {boolean} isActive - Si la franja está actualmente activa
 */

/**
 * Payload para crear una nueva franja horaria laboral
 * @typedef {Object} CreateWorkSchedulesDto
 * @property {number} dayOfWeek - Día de la semana (0 a 6)
 * @property {string} startTime - Hora de inicio (HH:mm:ss o HH:mm)
 * @property {string} endTime - Hora de fin (HH:mm:ss o HH:mm)
 */

/**
 * Payload para actualizar una franja horaria existente
 * @typedef {Object} UpdateWorkSchedulesDto
 * @property {number} dayOfWeek - Día de la semana (0 a 6)
 * @property {string} startTime - Nueva hora de inicio (HH:mm:ss)
 * @property {string} endTime - Nueva hora de fin (HH:mm:ss)
 */

/**
 * Filtros para consultar franjas horarias de proveedores
 * @typedef {Object} WorkSchedulesFilterDto
 * @property {number} [providerId] - Filtrar por ID de proveedor (si consulta Admin/Recepción/Cliente)
 * @property {number} [dayOfWeek] - Filtrar por día específico de la semana (0 a 6)
 * @property {number} [isActive] - Filtrar por estado (1: activo, 0: inactivo)
 * @property {string} [sortBy] - Campo de ordenamiento
 * @property {boolean} [isDescending] - Orden descendente
 * @property {number} [pageNumber] - Número de página (default: 1)
 * @property {number} [pageSize] - Cantidad de registros por página (default: 10)
 */

// =============================================================================
// TURNOS Y CITAS (Shifts)
// =============================================================================

/**
 * Posibles estados en los que puede encontrarse un turno
 * @typedef {'pending' | 'confirmed' | 'canceled' | 'completed' | 'no_show'} ShiftStatus
 */

/**
 * Servicio individual incluido dentro de un turno
 * @typedef {Object} ShiftItemDto
 * @property {number} id - Identificador del ítem del turno
 * @property {number} shiftId - ID del turno al que pertenece
 * @property {number} serviceId - ID del servicio
 * @property {string} nameService - Nombre del servicio al momento de la reserva
 * @property {number} durationMinutes - Duración aplicada
 * @property {number} priceAtMoment - Precio pactado/congelado al momento de la reserva
 * @property {ServiceImageDto[]} [images] - Imágenes asociadas al servicio
 */

/**
 * Item para solicitud de creación de turno
 * @typedef {Object} CreateShiftItemDto
 * @property {number} serviceId - ID del servicio contratado
 */

/**
 * Item para reprogramación o modificación de un turno existente
 * @typedef {Object} UpdateShiftItemDto
 * @property {number} serviceId - ID del servicio
 */

/**
 * Payload para la reserva de un nuevo turno
 * @typedef {Object} CreateShiftDto
 * @property {number} providerId - ID del proveedor seleccionado
 * @property {string} startAt - Fecha y hora de inicio en formato ISO 8601 UTC
 * @property {CreateShiftItemDto[]} items - Lista de servicios a realizar (mínimo 1)
 */

/**
 * Payload para reprogramar o actualizar un turno
 * @typedef {Object} UpdateShiftDto
 * @property {number} [providerId] - ID del proveedor (opcional si cambia)
 * @property {string} startAt - Nueva fecha y hora de inicio (formato ISO 8601 UTC)
 * @property {UpdateShiftItemDto[]} items - Lista de servicios actualizados (mínimo 1)
 */

/**
 * Datos completos de un turno o cita agendada
 * @typedef {Object} ShiftDto
 * @property {number} id - Identificador único del turno
 * @property {number} providerId - ID del proveedor
 * @property {string} providerFullName - Nombre completo del proveedor
 * @property {number} clientId - ID del cliente
 * @property {string} clientFullName - Nombre completo del cliente
 * @property {string} startAt - Fecha y hora de inicio (ISO 8601 UTC)
 * @property {string} endAt - Fecha y hora estimada de finalización (ISO 8601 UTC)
 * @property {ShiftStatus} status - Estado actual del turno ('pending', 'confirmed', etc.)
 * @property {string} createdAt - Fecha de creación del turno (ISO 8601 UTC)
 * @property {ShiftItemDto[]} items - Servicios incluidos en el turno
 * @property {number} totalAmount - Monto total sumado de los servicios
 * @property {number} createdById - ID del usuario que creó la reserva
 * @property {string} createdByRole - Rol con el que se creó la reserva ('Cliente', 'Administrador', etc.)
 * @property {number} [confirmedById] - ID del usuario que confirmó el turno
 * @property {number} [canceledById] - ID del usuario que canceló el turno
 * @property {UserResumDto} createdByUser - Resumen del usuario creador
 * @property {UserResumDto} [confirmedByUser] - Resumen del usuario que confirmó
 * @property {UserResumDto} [canceledByUser] - Resumen del usuario que canceló
 */

/**
 * Filtros para el listado y búsqueda de turnos
 * @typedef {Object} ShiftFilterDto
 * @property {number} [serviceId] - Filtrar por servicio específico
 * @property {string} [dateFrom] - Fecha/hora desde (ISO 8601 UTC)
 * @property {string} [dateTo] - Fecha/hora hasta (ISO 8601 UTC)
 * @property {number} [minPrice] - Monto mínimo total del turno
 * @property {number} [maxPrice] - Monto máximo total del turno
 * @property {string | ShiftStatus[]} [statuses] - Estados permitidos (string separado por coma o array de estados)
 * @property {string} [providerName] - Búsqueda por nombre del proveedor
 * @property {string} [clientName] - Búsqueda por nombre del cliente
 * @property {number} [createdById] - ID del usuario creador
 * @property {number} [canceledById] - ID del usuario que canceló
 * @property {string} [sortBy] - Campo de ordenamiento (ej. 'StartAt')
 * @property {boolean} [isDescending] - Orden descendente
 * @property {number} [pageNumber] - Número de página (default: 1)
 * @property {number} [pageSize] - Tamaño de página (default: 10)
 */