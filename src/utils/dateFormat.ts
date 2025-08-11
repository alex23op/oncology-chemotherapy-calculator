import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateInput?: string | Date | null): string => {
  if (!dateInput) return '';
  let d: Date;
  if (typeof dateInput === 'string') {
    // Try ISO first, fallback to native Date parsing
    try {
      d = parseISO(dateInput);
      if (!isValid(d)) d = new Date(dateInput);
    } catch {
      d = new Date(dateInput);
    }
  } else {
    d = dateInput;
  }
  if (!isValid(d)) return '';
  return format(d, 'dd/MM/yyyy');
};

export const formatDateTime = (dateInput?: string | Date | null): string => {
  if (!dateInput) return '';
  let d: Date;
  if (typeof dateInput === 'string') {
    try {
      d = parseISO(dateInput);
      if (!isValid(d)) d = new Date(dateInput);
    } catch {
      d = new Date(dateInput);
    }
  } else {
    d = dateInput;
  }
  if (!isValid(d)) return '';
  return format(d, 'dd/MM/yyyy HH:mm');
};
