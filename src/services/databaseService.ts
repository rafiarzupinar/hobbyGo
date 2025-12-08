import { supabase } from '@/lib/supabase';

export const databaseService = {
  /**
   * Insert a new record
   * @param table - Table name
   * @param data - Data to insert
   */
  insert: async (table: string, data: any) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  },

  /**
   * Select records
   * @param table - Table name
   * @param query - Query options
   */
  select: async (table: string, query: { columns?: string; filter?: any; limit?: number; orderBy?: { column: string; ascending?: boolean } } = {}) => {
    let queryBuilder = supabase.from(table).select(query.columns || '*');

    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach((key) => {
        queryBuilder = queryBuilder.eq(key, query.filter[key]);
      });
    }

    // Apply ordering
    if (query.orderBy) {
      queryBuilder = queryBuilder.order(query.orderBy.column, {
        ascending: query.orderBy.ascending ?? true,
      });
    }

    // Apply limit
    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  /**
   * Update records
   * @param table - Table name
   * @param filter - Filter to match records
   * @param data - Data to update
   */
  update: async (table: string, filter: any, data: any) => {
    let queryBuilder = supabase.from(table).update(data);

    // Apply filters
    Object.keys(filter).forEach((key) => {
      queryBuilder = queryBuilder.eq(key, filter[key]);
    });

    const { data: result, error } = await queryBuilder.select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  },

  /**
   * Delete records
   * @param table - Table name
   * @param filter - Filter to match records
   */
  delete: async (table: string, filter: any) => {
    let queryBuilder = supabase.from(table).delete();

    // Apply filters
    Object.keys(filter).forEach((key) => {
      queryBuilder = queryBuilder.eq(key, filter[key]);
    });

    const { error } = await queryBuilder;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  /**
   * Subscribe to realtime changes
   * @param table - Table name
   * @param callback - Callback function for changes
   */
  subscribe: (table: string, callback: (payload: any) => void) => {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  },

  /**
   * Unsubscribe from realtime changes
   */
  unsubscribe: (channel: any) => {
    supabase.removeChannel(channel);
  },

  /**
   * Execute a custom RPC function
   * @param functionName - Function name
   * @param params - Function parameters
   */
  rpc: async (functionName: string, params: any = {}) => {
    const { data, error } = await supabase.rpc(functionName, params);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },
};

export default databaseService;
