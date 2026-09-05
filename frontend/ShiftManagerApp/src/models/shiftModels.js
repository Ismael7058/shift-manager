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
 * @typedef {'pending' | 'confirmed' | 'completed' | 'canceled' | 'no_show'} ShiftStatus
 */

/**
 * @typedef {Object} AuthTokenDto
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {string} expiration - Formato DateOnly (ISO string YYYY-MM-DD)
 * @property {UserDto} user
 * @property {string} roleActive
 */

/**
 * @typedef {Object} LoginDto
 * @property {string} identifier
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterDto
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth - Formato DateOnly (ISO string YYYY-MM-DD)
 * @property {string|number} gender
 * @property {string} [phoneNumber]
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 */

/**
 * @typedef {Object} RoleDto
 * @property {string} name
 */

/**
 * @typedef {Object} RoleResponseDto
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} ProviderDto
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {ProviderServiceDto[]} items
 * @property {WorkSchedulesDto[]} works
 * @property {DateRangeDto[]} restrictedDates
 */

/**
 * @typedef {Object} ProviderFilterDto
 * @property {string} [name]
 * @property {string} [sortBy]
 * @property {boolean} isDescending
 * @property {boolean} includeServices
 * @property {boolean} includeWorkSchedules
 * @property {boolean} includeRestrictedDates
 * @property {number} pageNumber
 * @property {number} pageSize
 */

/**
 * @typedef {Object} CreateProviderServiceDto
 * @property {number} serviceId
 * @property {number} durationMinutes
 * @property {number} price
 */

/**
 * @typedef {Object} ProviderServiceDto
 * @property {number} id
 * @property {number} providerId
 * @property {number} serviceId
 * @property {string} name
 * @property {string} [description]
 * @property {number} durationMinutes
 * @property {number} durationMinutesBase
 * @property {number} price
 * @property {number} status
 */

/**
 * @typedef {Object} ProviderServiceFilterDto
 * @property {string} [name]
 * @property {number} [minDurationMinutes]
 * @property {number} [maxDurationMinutes]
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {number} [isActive]
 * @property {string} [sortBy]
 * @property {boolean} isDescending
 * @property {number} pageNumber
 * @property {number} pageSize
 */

/**
 * @typedef {Object} UpdateProviderServiceDto
 * @property {number} durationMinutes
 * @property {number} price
 */

/**
 * @typedef {Object} CreateServiceDto
 * @property {string} name
 * @property {string} [description]
 * @property {number} durationMinutes
 */

/**
 * @typedef {Object} ServiceImageDto
 * @property {number} id
 * @property {number} serviceId
 * @property {string} imageUrl
 */

/**
 * @typedef {Object} ServiceDto
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 * @property {number} durationMinutes
 * @property {boolean} isActive
 * @property {ServiceImageDto[]} [images] 
 */

/**
 * @typedef {Object} ServiceFilterDto
 * @property {string} [name]
 * @property {number} [minDurationMinutes]
 * @property {number} [maxDurationMinutes]
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {number} [isActive]
 * @property {string} [sortBy]
 * @property {boolean} isDescending
 * @property {number} pageNumber
 * @property {number} pageSize
 */

/**
 * @typedef {Object} UpdateServiceDto
 * @property {string} name
 * @property {string} [description]
 * @property {number} durationMinutes
 */

/**
 * @typedef {Object} DateRangeDto
 * @property {string} startAt - Formato ISO string
 * @property {string} endAt - Formato ISO string
 */

/**
 * @typedef {Object} UpdateStatusDto
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} CreateShiftDto
 * @property {number} providerId
 * @property {string} startAt - Formato ISO string
 * @property {CreateShiftItemDto[]} items
 */

/**
 * @typedef {Object} CreateShiftItemDto
 * @property {number} serviceId
 */

/**
 * @typedef {Object} ShiftDto
 * @property {number} id
 * @property {number} providerId
 * @property {string} providerFullName
 * @property {number} clientId
 * @property {string} clientFullName
 * @property {string} startAt - Formato ISO string
 * @property {string} endAt - Formato ISO string
 * @property {ShiftStatus} status
 * @property {string} createdAt - Formato ISO string
 * @property {ShiftItemDto[]} items
 * @property {number} totalAmount
 */

/**
 * @typedef {Object} ShiftFilterDto
 * @property {number} [serviceId]
 * @property {string} [dateFrom] - Formato ISO string
 * @property {string} [dateTo] - Formato ISO string
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {ShiftStatus[]} [statuses]
 * @property {string} [providerName]
 * @property {string} [clientName]
 * @property {string} [sortBy]
 * @property {boolean} isDescending
 * @property {number} pageNumber
 * @property {number} pageSize
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
 * @typedef {Object} UpdateShiftDto
 * @property {number} [providerId]
 * @property {string} startAt - Formato ISO string
 * @property {UpdateShiftItemDto[]} items
 */

/**
 * @typedef {Object} UpdateShiftItemDto
 * @property {number} serviceId
 */

/**
 * @typedef {Object} CreateUserDto
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth - Formato DateOnly (ISO string YYYY-MM-DD)
 * @property {string|number} gender
 * @property {string} [phoneNumber]
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 * @property {number[]} rolesId
 */

/**
 * @typedef {Object} EditEmailDto
 * @property {string} email
 */

/**
 * @typedef {Object} EditPasswordDto
 * @property {string} newPassword
 * @property {string} confirmPassword
 */

/**
 * @typedef {Object} EditPasswordProfileDto
 * @property {string} oldPassword
 * @property {string} newPassword
 * @property {string} confirmPassword
 */

/**
 * @typedef {Object} EditUsernameDto
 * @property {string} username
 */

/**
 * @typedef {Object} UpdateUserDto
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth - Formato DateOnly (ISO string YYYY-MM-DD)
 * @property {string|number} gender
 * @property {string} [phoneNumber]
 */

/**
 * @typedef {Object} UserDto
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth - Formato DateOnly (ISO string YYYY-MM-DD)
 * @property {string} gender
 * @property {string} [phoneNumber]
 * @property {string} username
 * @property {string} email
 * @property {string} [pictureURL]
 * @property {string[]} roles
 */

/**
 * @typedef {Object} UserFilterDto
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [username]
 * @property {number} [role]
 * @property {number} [isActive]
 * @property {string} [sortBy]
 * @property {boolean} isDescending
 * @property {number} pageNumber
 * @property {number} pageSize
 */

/**
 * @typedef {Object} CreateWorkSchedulesDto
 * @property {number} dayOfWeek
 * @property {string} startTime - Formato TimeOnly (ISO string HH:mm:ss)
 * @property {string} endTime - Formato TimeOnly (ISO string HH:mm:ss)
 */

/**
 * @typedef {Object} UpdateWorkSchedulesDto
 * @property {number} dayOfWeek
 * @property {string} startTime - Formato TimeOnly (ISO string HH:mm:ss)
 * @property {string} endTime - Formato TimeOnly (ISO string HH:mm:ss)
 */

/**
 * @typedef {Object} WorkSchedulesDto
 * @property {number} id
 * @property {number} providerId
 * @property {number} dayOfWeek
 * @property {string} startTime - Formato TimeOnly (ISO string HH:mm:ss)
 * @property {string} endTime - Formato TimeOnly (ISO string HH:mm:ss)
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} WorkSchedulesFilterDto
 * @property {number} [providerId]
 * @property {number} [dayOfWeek]
 * @property {number} [isActive]
 * @property {string} [sortBy]
 * @property {boolean} isDescending
 * @property {number} pageNumber
 * @property {number} pageSize
 */

/**
 * @typedef {Object} ClientFilterDto
 * @property {string} [name]
 * @property {string} [sortBy]
 * @property {boolean} isDescending
 * @property {number} pageNumber
 * @property {number} pageSize
 */

/**
 * @typedef {Object} ClientDto
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} username
 * @property {string} email
 * @property {string} [pictureURL]
 */