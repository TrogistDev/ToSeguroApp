import React from "react";
import { useAccidentReport } from "./hooks/useAccidentReport";
import { StepPersonalData } from "./steps/StepPersonalData";
import { StepPhotos } from "./steps/StepPhotos";
import { StepFinalize } from "./steps/StepFinalize";

export const AccidentReportForm: React.FC = () => {
  const {
    formData,
    step,
    setStep,
    updateFormData,
    addressInput,
    suggestions,
    isUploading,
    uploadedPhotos,
    signedPhotoUrls,
    handleAddressInput,
    handleSelectAddress,
    handlePhotoUpload,
    handleFinishReport,
  } = useAccidentReport();

  return (
    <div className="max-w-2xl mx-auto  bg-white rounded-xl shadow-sm border border-gray-100 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Relatar Sinistro</h2>
        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          Passo {step} de 3
        </span>
      </div>

      {step === 1 && (
        <StepPersonalData
          formData={formData}
          addressInput={addressInput}
          suggestions={suggestions}
          updateFormData={updateFormData}
          handleAddressInput={handleAddressInput}
          handleSelectAddress={handleSelectAddress}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepPhotos
          isUploading={isUploading}
          uploadedPhotos={uploadedPhotos}
          signedPhotoUrls={signedPhotoUrls}
          handlePhotoUpload={handlePhotoUpload}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StepFinalize
          formData={formData}
          updateFormData={updateFormData}
          onBack={() => setStep(2)}
          onFinish={handleFinishReport}
        />
      )}
    </div>
  );
};
