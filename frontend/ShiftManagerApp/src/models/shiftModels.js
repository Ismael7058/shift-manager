
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
 * @property {'pending' | 'confirmed' | 'completed' | 'canceled' | 'noshow'} status
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


export const ShiftStatuses = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'NoShow'
};
