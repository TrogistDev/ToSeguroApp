import React from "react";
import { useTranslation } from "react-i18next";

interface StepPhotosProps {
  isUploading: boolean;
  uploadedPhotos: string[];
  signedPhotoUrls: Record<string, string>;
  handlePhotoUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
  onBack: () => void;
  onNext: () => void;
}

export const StepPhotos: React.FC<StepPhotosProps> = ({
  isUploading,
  uploadedPhotos,
  signedPhotoUrls,
  handlePhotoUpload,
  onBack,
  onNext,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t("steps.photos.title")}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("steps.photos.subtitle")}</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">{t("steps.photos.uploadLabel")}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none"
        />
      </label>

      {isUploading && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {t("steps.photos.uploading")}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {uploadedPhotos.map((photoUrl) => (
          <div
            key={photoUrl}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <img
              src={signedPhotoUrls[photoUrl] || photoUrl}
              alt={t("steps.photos.photoPreview")}
              className="h-36 w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {t("common.back")}
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
};
