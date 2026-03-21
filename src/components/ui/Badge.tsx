export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>;
}

// Modal.tsx
export function Modal({ children }: { children: React.ReactNode }) {
  return <div className="modal">{children}</div>;
}

// Input.tsx
export function Input({ placeholder }: { placeholder?: string }) {
  return <input placeholder={placeholder} />;
}

// Select.tsx
export function Select({ children }: { children: React.ReactNode }) {
  return <select>{children}</select>;
}
