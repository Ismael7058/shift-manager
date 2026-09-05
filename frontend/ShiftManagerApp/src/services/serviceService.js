import { apiFetch } from "./api";

export const ServiceService = {
  /**
   * Obtiene una lista de servicios
   * @param {ServiceFilterDto} filter
   * @returns {Promise<PaginatedDto<ServiceDto>>}
   */
  getServices: (filter) =>
    apiFetch(`/services?Name=${filter.name}&MinDurationMinutes=${filter.minDurationMinutes}&MaxDurationMinutes=${filter.maxDurationMinutes}&MinPrice=${filter.minPrice}&MaxPrice=${filter.maxPrice}&IsActive=${filter.isActive}&SortBy=${filter.sortBy}&IsDescending=${filter.isDescending}&PageNumber=${filter.pageNumber}&PageSize=${filter.pageSize}`),

  /**
   * Obtiene un servicio por id
   * @param {number} serviceId 
   * @returns {Promise<ServiceDto>}
   */
  getService: (serviceId) =>
    apiFetch(`/services/${serviceId}`),

  /**
   * Crea un servicio
   * @param {CreateServiceDto} create 
   * @returns 
   */
  createService: (create) =>
    apiFetch(
      '/services',
      {
        method: 'POST',
        body: JSON.stringify({
          Name: create.name,
          Description: create.description,
          DurationMinutes: create.durationMinutes
        })
      }
    ),

  /**
   * Actualiza un servicio
   * @param {number} serviceId 
   * @param {UpdateServiceDto} update
   * @returns {Promise<ServiceDto>}
   */
  updateService: (serviceId, update) =>
    apiFetch(
      `/services/${serviceId}`,
      {
        method: 'PUT',
        body: JSON.stringify(update)
      }
    ),

  /**
   * Cambia el estado de un servicio
   * @param {number} serviceId 
   * @param {UpdateStatusDto} status
   * @returns {Promise<any>}
   */
  chagenStatusService: (serviceId, status) =>
    apiFetch(
      `/services/${serviceId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(status)
      }
    ),

  /**
   * Sube una o múltiples imágenes a un servicio
   * @param {number} serviceId 
   * @param {File[]|FileList|FormData} files - Array o FileList de archivos o FormData directo
   * @returns {Promise<ServiceImageDto[]>}
   */
  uploadImages: (serviceId, files) => {
    const formData = files instanceof FormData ? files : new FormData();

    if (!(files instanceof FormData)) {
      const fileList = Array.isArray(files) ? files : Array.from(files);
      fileList.forEach((file) => formData.append('files', file));
    }

    return apiFetch(`/services/${serviceId}/images`, {
      method: 'POST',
      body: formData
    });
  },


  /**
   * Elimina una imagen específica de un servicio
   * @param {number} serviceId 
   * @param {number} imageId 
   * @returns {Promise<null>}
   */
  deleteImage: (serviceId, imageId) =>
    apiFetch(`/services/${serviceId}/images/${imageId}`, {
      method: 'DELETE'
    })
};
