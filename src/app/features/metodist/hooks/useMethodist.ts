import api from "@/lib/api";
import {AddMethodistRequest, MethodistData, UpdateMethodistRequest} from "../types/MethodistTypes";

export function useMethodist() {
  // Функция для добавления нового методиста (только для админа)
  const addMethodist = async (methodistData: AddMethodistRequest) => {
    try {
      const response = await api.post('/methodists', methodistData);
      return response.data;
    } catch (error: any) {
      console.error('Ошибка при добавлении методиста:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при добавлении методиста');
    }
  };

  // Функция для изменения пароля методиста (только для админа)
  const changeMethodist = async (methodist: UpdateMethodistRequest) => {
    try {
      const response = await api.put(
          `/methodists/${methodist.id}`,
          {
            id: methodist.id,
            login: methodist.login,
            password: methodist.password,
          }
      );
      return response.data;
    } catch (error: any) {
      console.error('Ошибка при изменении пароля методиста:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при изменении пароля методиста');
    }
  };

  // Функция для получения списка всех методистов (только для админа)
  const getMethodists = async () => {
    try {
      const response = await api.get('/methodists');
      return response.data;
    } catch (error: any) {
      console.error('Ошибка при получении списка методистов:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при получении списка методистов');
    }
  };

  return {
    addMethodist,
    changeMethodist,
    getMethodists,
  }
}