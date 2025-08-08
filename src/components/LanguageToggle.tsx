import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

export const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  return (
    <div className="min-w-[140px]">
      <Select value={i18n.language.startsWith('ro') ? 'ro' : 'en'} onValueChange={(lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
      }}>
        <SelectTrigger aria-label={t('header.language')}>
          <SelectValue placeholder={t('header.language') as string} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">🇬🇧 {t('header.english')}</SelectItem>
          <SelectItem value="ro">🇷🇴 {t('header.romanian')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
