/**
 * Open Purchase Database Utilities
 * Generic CRUD utility functions for database operations
 */

// Type definitions
export interface DatabaseRecord {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  where?: Record<string, any>;
}

export interface UpdateData {
  [key: string]: any;
}

// Error handling class
export class DatabaseError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Validation utilities
export const validateRecord = (record: Partial<DatabaseRecord>): void => {
  if (!record) {
    throw new DatabaseError('Record cannot be null or undefined', 'INVALID_RECORD');
  }

  // Validate ID if present
  if (record.id && typeof record.id !== 'string') {
    throw new DatabaseError('Record ID must be a string', 'INVALID_ID');
  }

  // Ensure required timestamps are valid dates if present
  if (record.createdAt && !(record.createdAt instanceof Date)) {
    throw new DatabaseError('createdAt must be a valid Date object', 'INVALID_TIMESTAMP');
  }
  
  if (record.updatedAt && !(record.updatedAt instanceof Date)) {
    throw new DatabaseError('updatedAt must be a valid Date object', 'INVALID_TIMESTAMP');
  }
};

export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    // Basic sanitization for strings - remove potentially dangerous characters
    return input.replace(/[<>]/g, '');
  }
  return input;
};

// CRUD Utility Functions

/**
 * Create a new record in the database
 * @param collection - The database collection/table name
 * @param data - The data to insert
 * @returns Promise<DatabaseRecord> - The created record with ID
 */
export const createRecord = async (
  collection: string, 
  data: Partial<DatabaseRecord>
): Promise<DatabaseRecord> => {
  try {
    validateRecord(data);
    
    // Sanitize input data
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizeInput(data[key]);
      return acc;
    }, {} as Record<string, any>);
    
    // Add timestamps
    const now = new Date();
    const record: DatabaseRecord = {
      ...sanitizedData,
      id: data.id || generateId(),
      createdAt: data.createdAt || now,
      updatedAt: now,
    };
    
    // Here we would typically call the actual database operation
    // For example: await db.collection(collection).insertOne(record);
    console.log(`Creating record in ${collection}:`, record);
    
    // Mock implementation - return the record as if it was created
    return record;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to create record in ${collection}`, 
      'CREATE_ERROR', 
      { collection, originalError: error }
    );
  }
};

/**
 * Read records from the database
 * @param collection - The database collection/table name
 * @param options - Query options including filters, limits, etc.
 * @returns Promise<DatabaseRecord[]> - Array of matching records
 */
export const readRecords = async (
  collection: string, 
  options: QueryOptions = {}
): Promise<DatabaseRecord[]> => {
  try {
    // Validate options
    if (options.limit !== undefined && (typeof options.limit !== 'number' || options.limit <= 0)) {
      throw new DatabaseError('Limit must be a positive number', 'INVALID_OPTION');
    }
    
    if (options.offset !== undefined && (typeof options.offset !== 'number' || options.offset < 0)) {
      throw new DatabaseError('Offset must be a non-negative number', 'INVALID_OPTION');
    }
    
    // Apply sanitization to where clause
    let sanitizedWhere = {};
    if (options.where) {
      sanitizedWhere = Object.keys(options.where).reduce((acc, key) => {
        acc[key] = sanitizeInput(options.where![key]);
        return acc;
      }, {} as Record<string, any>);
    }
    
    // Mock implementation - return empty array as if no records found
    console.log(`Reading records from ${collection} with options:`, { ...options, where: sanitizedWhere });
    
    return [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to read records from ${collection}`, 
      'READ_ERROR', 
      { collection, originalError: error }
    );
  }
};

/**
 * Update an existing record in the database
 * @param collection - The database collection/table name
 * @param id - The ID of the record to update
 * @param data - The data to update
 * @returns Promise<DatabaseRecord> - The updated record
 */
export const updateRecord = async (
  collection: string, 
  id: string, 
  data: UpdateData
): Promise<DatabaseRecord> => {
  try {
    if (!id || typeof id !== 'string') {
      throw new DatabaseError('ID must be a non-empty string', 'INVALID_ID');
    }
    
    if (!data || Object.keys(data).length === 0) {
      throw new DatabaseError('Update data cannot be empty', 'EMPTY_UPDATE');
    }
    
    // Sanitize input data
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizeInput(data[key]);
      return acc;
    }, {} as Record<string, any>);
    
    // Add update timestamp
    const now = new Date();
    const updateData = {
      ...sanitizedData,
      updatedAt: now,
    };
    
    // Here we would typically call the actual database operation
    // For example: await db.collection(collection).updateOne({ id }, { $set: updateData });
    console.log(`Updating record ${id} in ${collection}:`, updateData);
    
    // Mock implementation - return a record as if it was updated
    return {
      id,
      ...updateData,
    } as DatabaseRecord;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to update record ${id} in ${collection}`, 
      'UPDATE_ERROR', 
      { collection, id, originalError: error }
    );
  }
};

/**
 * Delete a record from the database
 * @param collection - The database collection/table name
 * @param id - The ID of the record to delete
 * @returns Promise<boolean> - True if deletion was successful
 */
export const deleteRecord = async (collection: string, id: string): Promise<boolean> => {
  try {
    if (!id || typeof id !== 'string') {
      throw new DatabaseError('ID must be a non-empty string', 'INVALID_ID');
    }
    
    // Here we would typically call the actual database operation
    // For example: await db.collection(collection).deleteOne({ id });
    console.log(`Deleting record ${id} from ${collection}`);
    
    // Mock implementation - return true as if deletion was successful
    return true;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to delete record ${id} from ${collection}`, 
      'DELETE_ERROR', 
      { collection, id, originalError: error }
    );
  }
};

/**
 * Generate a unique ID for records
 * @returns string - A unique identifier
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Check if a record exists in the database
 * @param collection - The database collection/table name
 * @param id - The ID of the record to check
 * @returns Promise<boolean> - True if record exists
 */
export const recordExists = async (collection: string, id: string): Promise<boolean> => {
  try {
    const records = await readRecords(collection, { 
      where: { id },
      limit: 1 
    });
    return records.length > 0;
  } catch (error) {
    throw new DatabaseError(
      `Failed to check existence of record ${id} in ${collection}`, 
      'EXISTS_ERROR', 
      { collection, id, originalError: error }
    );
  }
};

// Export all utility functions
export default {
  createRecord,
  readRecords,
  updateRecord,
  deleteRecord,
  validateRecord,
  sanitizeInput,
  generateId,
  recordExists,
  DatabaseError,
};