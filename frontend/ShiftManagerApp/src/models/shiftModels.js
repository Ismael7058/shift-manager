
/**
 * @template T
 * @typedef {Object} PaginatedDto
 * @property {T[]} items
 * @property {number} totalCount
 * @property {number} pageNumber
 * @property {number} pageSize
 * @property {number} totalPages
 */

/**
 * @typedef {Object} ShiftDto
 * @property {number} id
 * @property {number} providerId
 * @property {string} providerFullName
 * @property {number} clientId
 * @property {string} clientFullName
 * @property {string} startAt
 * @property {string} endAt
 * @property {'pending' | 'confirmed' | 'completed' | 'canceled' | 'no_show'} status - Estado del turno
 * @property {string} createdAt
 * @property {ShiftItemDto[]} items
 * @property {number} totalAmount
 */

/**
 * @typedef {Object} ShiftItemDto
 * @property {number} id
 * @property {number} shiftId
 * @property {number} serviceId
 * @property {string} nameService
 * @property {number} durationMinutes
 * @property {number} priceAtMoment
 */

/**
 * @typedef {Object} ShiftFilterDto
 * @property {string} [searchTerm]
 * @property {string} [sortBy]
 * @property {boolean} [isDescending]
 * @property {number} [pageNumber]
 * @property {number} [pageSize]
 * @property {string} [dateFrom] - Formato ISO string
 * @property {string} [dateTo] - Formato ISO string
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {number} [serviceId]
 * @property {string[]} [statuses]
 */

/**
 * @typedef {Object} ShiftItemCreateDto
 * @property {number} serviceId
 */

/**
 * @typedef {Object} ShiftCreateDto
 * @property {number} providerId
 * @property {number} [clientId] - Opcional si el cliente crea su propio turno
 * @property {string} startAt - Formato ISO string
 * @property {ShiftItemCreateDto[]} items
 */


export const ShiftStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  NO_SHOW: 'no_show'
};


/**
 * @typedef {Object} ServiceFilterDto
 * @property {string} name
 * @property {boolean} isActive
 * @property {string} sortBy
 * @property {boolean} isDescending
 * @property {number} pageNumber
 * @property {number} pageSize
 */

/**
 * @typedef {Object} ServiceDto
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} durationMinutes
 * @property {boolean} isActive
 */
