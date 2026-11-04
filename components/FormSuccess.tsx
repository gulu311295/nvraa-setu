import { alertSuccessClass, cardClass } from "@/components/ui/form-styles";

export function FormSuccess({ title, message }: { title: string; message: string }) {
  return (
    <div className={`${cardClass} ${alertSuccessClass} text-center`} role="status">
      <p className="text-lg font-semibold text-leaf-300">{title}</p>
      <p className="mt-2 text-sm text-white/70">{message}</p>
    </div>
  );
}
