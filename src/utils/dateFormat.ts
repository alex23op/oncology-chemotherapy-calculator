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

export const toISODate = (dateInput?: string | Date | null): string => {
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
  return format(d, 'yyyy-MM-dd');
};

export const parseISODate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null;
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? d : null;
  } catch {
    const d = new Date(dateStr);
    return isValid(d) ? d : null;
  }
};

export const toLocalISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
