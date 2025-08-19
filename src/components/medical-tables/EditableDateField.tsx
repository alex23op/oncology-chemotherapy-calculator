import React, { useState } from 'react';
import { DatePickerField } from '../DatePickerField';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Calendar, Edit } from 'lucide-react';
import { formatDate, toISODate, parseISODate } from '@/utils/dateFormat';

interface EditableDateFieldProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export const EditableDateField: React.FC<EditableDateFieldProps> = ({
  value,
  onChange,
  placeholder = "ZZ/LL/AAAA",
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [textValue, setTextValue] = useState(formatDate(value));

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const handleTextBlur = () => {
    // Try to parse the text value and update
    const parts = textValue.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      if (year.length === 4) {
        const isoDate = `${year}-${month}-${day}`;
        const parsed = parseISODate(isoDate);
        if (parsed) {
          onChange(isoDate);
        }
      }
    }
    setIsEditing(false);
  };

  const handleCalendarChange = (isoDate: string) => {
    onChange(isoDate);
    setTextValue(formatDate(isoDate));
    setIsCalendarOpen(false);
  };

  if (isCalendarOpen) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <DatePickerField
          value={value}
          onChange={handleCalendarChange}
          placeholder={placeholder}
          className="text-xs"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsCalendarOpen(false)}
          className="h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleTextBlur();
            } else if (e.key === 'Escape') {
              setTextValue(formatDate(value));
              setIsEditing(false);
            }
          }}
          placeholder={placeholder}
          className="text-xs h-6 w-24"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-xs">{formatDate(value) || placeholder}</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
        title="Editează manual"
      >
        <Edit className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsCalendarOpen(true)}
        className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
        title="Deschide calendarul"
      >
        <Calendar className="h-3 w-3" />
      </Button>
    </div>
  );
};