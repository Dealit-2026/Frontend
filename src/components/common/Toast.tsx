"use client";

type ToastProps = {
  message: string;
  visible: boolean;
};

export default function Toast({ message, visible }: ToastProps) {
  if (!visible || !message) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}
