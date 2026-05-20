import React from 'react';
import { useReportStore } from '../../store/useReportStore';
import { Input } from '../ui/Input';

const COMMON_BRANDS = ['Toyota', 'Honda', 'Ford', 'Volkswagen', 'Fiat'];

export const VehicleForm = () => {
  const { formData, updateFormData } = useReportStore();

  // Lógica de sugestão preditiva simples
  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData({ vehicleBrand: value });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold">Dados do Veículo</h3>
      
      <Input 
        placeholder="Placa / Matrícula"
        value={formData.vehiclePlate}
        onChange={(e) => updateFormData({ vehiclePlate: e.target.value })}
      />

      <div className="relative">
        <Input 
          placeholder="Marca (ex: Toyota)"
          value={formData.vehicleBrand}
          onChange={handleBrandChange}
        />
        {/* Sugestões rápidas se o usuário digitar algo comum */}
        {formData.vehicleBrand && COMMON_BRANDS.includes(formData.vehicleBrand) && (
          <div className="text-xs text-blue-500 mt-1">Sugestão detectada: {formData.vehicleBrand}</div>
        )}
      </div>

      <Input 
        placeholder="Modelo"
        value={formData.vehicleModel}
        onChange={(e) => updateFormData({ vehicleModel: e.target.value })}
      />

      <Input 
        type="number"
        placeholder="Ano"
        value={formData.vehicleYear || ''}
        onChange={(e) => updateFormData({ vehicleYear: Number(e.target.value) })}
      />
    </div>
  );
};
