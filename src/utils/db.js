import { supabase } from './client';

export const getAllRecords = async () => {
  const { data } = await supabase.from('study-record').select('*');
  return data;
};

export const insertNewRecord = async (record) => {
  const { error } = await supabase.from('study-record').insert(record);
  if (error) {
    console.error(error);
  }
};

export const deleteRecord = async (id) => {
  const { error } = await supabase.from('study-record').delete().eq('id', id);
  if (error) {
    console.error(error);
  }
};