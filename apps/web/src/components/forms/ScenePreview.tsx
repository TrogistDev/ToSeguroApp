// apps/web/src/components/forms/ScenePreview.tsx
import React from 'react';
import { useReportStore } from '../../store/useReportStore';

export const ScenePreview = () => {
  const { formData } = useReportStore();

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray de_gray-500">Dados da Cena (JSON Raw):</h4>
      <pre className="p-3 bg-black text-green-400 text-xs rounded overflow-x-auto max-h-40">
        {JSON.stringify(formData.sceneData, null, 2)}
      </pre>
    </div>
  );
};
