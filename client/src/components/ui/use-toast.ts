export function useToast() {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      alert(`${title}\n${description}`);
    }
  };
} 