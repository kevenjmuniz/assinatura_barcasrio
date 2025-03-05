
// This is a re-export from sonner, which is the toast library we're actually using
import { toast } from "sonner";

export { toast };

export const useToast = () => {
  return { toast };
};
