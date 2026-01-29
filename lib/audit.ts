import { supabase } from './supabase';

export const logAction = async (
  entityType: string, 
  entityId: string, 
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'ANULAR',
  oldData?: any,
  newData?: any
) => {
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from('audit_logs').insert([{
    usuario_id: user?.id,
    entidad_tipo: entityType,
    entidad_id: entityId,
    accion: action,
    datos_anteriores: oldData,
    datos_nuevos: newData
  }]);
};