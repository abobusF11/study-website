"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/features/auth/hooks/useAuth';
import { motion } from 'framer-motion';
import { useMethodist } from '@/app/features/metodist/hooks/useMethodist';
import {AddMethodistRequest, Methodist, UpdateMethodistRequest} from "@/app/features/metodist/types/MethodistTypes";

export default function MethodistsPage() {
  const [methodists, setMethodists] = useState<Methodist[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ login: string; password: string }>({ login: '', password: '' });
  const [isAdding, setIsAdding] = useState(false);
  
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { addMethodist, getMethodists, changeMethodist } = useMethodist();

  useEffect(() => {
    if (isLoading) return;
    const isAdmin = user?.role === 'admin';
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
      return;
    }
    fetchMethodists();
  }, [router, user, isAuthenticated, isLoading]);

  const fetchMethodists = async () => {
    try {
      setLoading(true);
      const data = await getMethodists();
      setMethodists(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке методистов');
      console.error('Ошибка при загрузке методистов:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (methodist: Methodist) => {
    setEditingId(methodist.id);
    setEditValues({ 
      login: methodist.login, 
      password: '' 
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({ login: '', password: '' });
  };

  const saveChanges = async (id: number) => {
    try {
      setLoading(true);
      if (editValues.password) {
        const methodists: UpdateMethodistRequest = {
          id: id,
          login: editValues.login,
          password: editValues.password
        };
        await changeMethodist(methodists);
      }
      await fetchMethodists();
      setEditingId(null);
      setEditValues({ login: '', password: '' });
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении изменений');
      console.error('Ошибка при сохранении изменений:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethodist = async () => {
    try {
      setLoading(true);
      const methodist: AddMethodistRequest = {
        login: editValues.login,
        password: editValues.password
      };
      await addMethodist(methodist);
      await fetchMethodists();
      setIsAdding(false);
      setEditValues({ login: '', password: '' });
    } catch (err: any) {
      setError(err.message || 'Ошибка при добавлении методиста');
      console.error('Ошибка при добавлении методиста:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && methodists.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Методисты</h1>
        <div className="text-center py-4">Загрузка данных...</div>
      </div>
    );
  }

  if (error && methodists.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Методисты</h1>
        <div className="text-center py-4 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-8">Методисты</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            disabled={isAdding || editingId !== null}
          >
            Добавить методиста
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Логин</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пароль</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isAdding && (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Новый</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="text"
                      value={editValues.login}
                      onChange={(e) => setEditValues({ ...editValues, login: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Введите логин"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="password"
                      value={editValues.password}
                      onChange={(e) => setEditValues({ ...editValues, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Введите пароль"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddMethodist}
                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition"
                        disabled={loading}
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition"
                        disabled={loading}
                      >
                        Отмена
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {methodists.map(methodist => (
                <tr key={methodist.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{methodist.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === methodist.id ? (
                      <input
                        type="text"
                        value={editValues.login}
                        onChange={(e) => setEditValues({ ...editValues, login: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      methodist.login
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === methodist.id ? (
                      <input
                        type="password"
                        value={editValues.password}
                        onChange={(e) => setEditValues({ ...editValues, password: e.target.value })}
                        placeholder="Новый пароль"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      "********"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === methodist.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveChanges(methodist.id)}
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition"
                          disabled={loading}
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition"
                          disabled={loading}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(methodist)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition"
                        disabled={isAdding}
                      >
                        Редактировать
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {loading && methodists.length > 0 && (
          <div className="text-center py-4">Обновление данных...</div>
        )}
      </motion.div>
    </div>
  );
}