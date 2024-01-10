import { toast } from "sonner";

export const showSuccessMessage = (message: string) => {
  toast.success(message);
};

export const showErrorMessage = (message: string) => {
  toast.error(message);
};