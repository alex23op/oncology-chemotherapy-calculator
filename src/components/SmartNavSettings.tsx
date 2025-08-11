import { useState } from "react";
import { Settings2 } from "lucide-react";
import { useSmartNav } from "@/context/SmartNavContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export const SmartNavSettings = () => {
  const { t } = useTranslation();
  const {
    autoCollapseEnabled,
    autoJumpEnabled,
    calendarFirst,
    setAutoCollapseEnabled,
    setAutoJumpEnabled,
    setCalendarFirst,
  } = useSmartNav();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Smart navigation settings">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('smartNav.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{t('smartNav.autoCollapse')}</p>
              <p className="text-xs text-muted-foreground">{t('smartNav.autoCollapseDesc')}</p>
            </div>
            <Switch checked={autoCollapseEnabled} onCheckedChange={v => setAutoCollapseEnabled(!!v)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{t('smartNav.autoJump')}</p>
              <p className="text-xs text-muted-foreground">{t('smartNav.autoJumpDesc')}</p>
            </div>
            <Switch checked={autoJumpEnabled} onCheckedChange={v => setAutoJumpEnabled(!!v)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{t('smartNav.calendarFirst')}</p>
              <p className="text-xs text-muted-foreground">{t('smartNav.calendarFirstDesc')}</p>
            </div>
            <Switch checked={calendarFirst} onCheckedChange={v => setCalendarFirst(!!v)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
