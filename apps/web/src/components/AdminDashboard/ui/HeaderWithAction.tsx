import { Button } from "../../ui/Button";

interface Props {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  btnText: string;
  onOpenModal: () => void;
}

export const HeaderWithAction: React.FC<Props> = ({ title, subtitle, btnText, onOpenModal }) => (
  <div className="flex justify-between items-center flex-wrap gap-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div>
      <h1 className="text-2xl font-black text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    <Button
      onClick={onOpenModal}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl w-full sm:w-auto"
    >
      {btnText}
    </Button>
  </div>
);
