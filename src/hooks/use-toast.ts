
import { toast as sonnerToast } from "sonner";

type ToastType = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export const toast = (props: ToastType) => {
  if (props.variant === "destructive") {
    return sonnerToast.error(props.title, {
      description: props.description,
      action: props.action
    });
  }
  
  return sonnerToast(props.title || "", {
    description: props.description,
    action: props.action
  });
};

export const useToast = () => {
  return { toast };
};
