export function FormSuccess({ title, message }: { title: string; message: string }) {
  return (
    <div
      className="rounded-xl border border-leaf-500/40 bg-leaf-500/10 p-6 text-center"
      role="status"
    >
      <p className="text-lg font-semibold text-leaf-500">{title}</p>
      <p className="mt-2 text-sm text-white/70">{message}</p>
    </div>
  );
}
