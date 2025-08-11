import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Syringe, Microscope, Heart, Activity } from 'lucide-react';
import { Regimen, Drug } from '@/types/regimens';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface TreatmentCalendarProps {
  regimen: Regimen;
  startDate: Date;
  cycleNumber: number;
  className?: string;
}

interface CalendarEvent {
  id: string;
  date: Date;
  type: 'infusion' | 'lab' | 'imaging' | 'visit' | 'gcsf' | 'monitoring';
  title: string;
  description: string;
  drugs?: string[];
  urgent?: boolean;
}

export const TreatmentCalendar: React.FC<TreatmentCalendarProps> = ({
  regimen,
  startDate,
  cycleNumber,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate));
  const { t, i18n } = useTranslation();

  const generateCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const cycleStartDate = new Date(startDate);
    
    // Parse cycle schedule (e.g., "Day 1, 8, 15 q21 days")
    const scheduleMatch = regimen.schedule.match(/Day\s+([\d,\s]+)/);
    const dayNumbers = scheduleMatch 
      ? scheduleMatch[1].split(',').map(d => parseInt(d.trim()))
      : [1];

    const cycleLengthMatch = regimen.schedule.match(/q(\d+)/);
    const cycleLength = cycleLengthMatch ? parseInt(cycleLengthMatch[1]) : 21;

    // Add infusion days for current cycle
    dayNumbers.forEach(dayNum => {
      const infusionDate = new Date(cycleStartDate);
      infusionDate.setDate(infusionDate.getDate() + (dayNum - 1));
      
      events.push({
        id: `infusion_cycle${cycleNumber}_day${dayNum}`,
        date: infusionDate,
        type: 'infusion',
        title: t('calendar.events.cycleDay', { cycle: cycleNumber, day: dayNum }),
        description: t('calendar.events.chemoAdministration'),
        drugs: regimen.drugs.map(d => d.name)
      });

      // Add pre-chemo labs (day before infusion)
      const labDate = new Date(infusionDate);
      labDate.setDate(labDate.getDate() - 1);
      
      events.push({
        id: `labs_cycle${cycleNumber}_day${dayNum}`,
        date: labDate,
        type: 'lab',
        title: t('calendar.events.pretreatmentLabs'),
        description: t('calendar.events.labsDesc')
      });
    });

    // Add G-CSF if indicated (day after chemo for 3-5 days)
    if (regimen.drugs.some(d => d.drugClass === 'chemotherapy')) {
      const gcsfStartDate = new Date(cycleStartDate);
      gcsfStartDate.setDate(gcsfStartDate.getDate() + dayNumbers[0]); // Day after first infusion
      
      for (let i = 0; i < 5; i++) {
        const gcsfDate = new Date(gcsfStartDate);
        gcsfDate.setDate(gcsfDate.getDate() + i);
        
        events.push({
          id: `gcsf_cycle${cycleNumber}_day${i + 1}`,
          date: gcsfDate,
          type: 'gcsf',
          title: t('calendar.events.gcsfTitle'),
          description: t('calendar.events.gcsfDesc')
        });
      }
    }

    // Add monitoring based on drugs
    regimen.drugs.forEach(drug => {
      if (drug.name === 'Doxorubicin') {
        // ECHO/MUGA every 3 cycles
        if (cycleNumber % 3 === 0) {
          const echoDate = new Date(cycleStartDate);
          echoDate.setDate(echoDate.getDate() - 7);
          
          events.push({
            id: `echo_cycle${cycleNumber}`,
            date: echoDate,
            type: 'monitoring',
            title: t('calendar.events.cardiacTitle'),
            description: t('calendar.events.cardiacDesc'),
            urgent: true
          });
        }
      }

      if (drug.name === 'Cisplatin' || drug.name === 'Carboplatin') {
        // Audiometry every 2 cycles for cisplatin
        if (drug.name === 'Cisplatin' && cycleNumber % 2 === 0) {
          const audioDate = new Date(cycleStartDate);
          audioDate.setDate(audioDate.getDate() - 3);
          
          events.push({
            id: `audio_cycle${cycleNumber}`,
            date: audioDate,
            type: 'monitoring',
            title: t('calendar.events.audioTitle'),
            description: t('calendar.events.audioDesc')
          });
        }
      }
    });

    // Add restaging scans (every 2-3 cycles)
    if (cycleNumber % 3 === 0) {
      const scanDate = new Date(cycleStartDate);
      scanDate.setDate(scanDate.getDate() + 7);
      
      events.push({
        id: `restaging_cycle${cycleNumber}`,
        date: scanDate,
        type: 'imaging',
          title: t('calendar.events.restagingTitle'),
          description: t('calendar.events.restagingDesc'),
          urgent: true
      });
    }

    // Add next cycle start
    const nextCycleDate = new Date(cycleStartDate);
    nextCycleDate.setDate(nextCycleDate.getDate() + cycleLength);
    
    events.push({
      id: `cycle${cycleNumber + 1}_start`,
      date: nextCycleDate,
      type: 'visit',
      title: t('calendar.events.cycleStart', { cycle: cycleNumber + 1 }),
      description: t('calendar.events.cycleStartDesc')
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const events = generateCalendarEvents();

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'infusion':
        return <Syringe className="h-3 w-3" />;
      case 'lab':
        return <Microscope className="h-3 w-3" />;
      case 'imaging':
        return <Activity className="h-3 w-3" />;
      case 'visit':
        return <Calendar className="h-3 w-3" />;
      case 'gcsf':
        return <Syringe className="h-3 w-3" />;
      case 'monitoring':
        return <Heart className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'infusion':
        return 'default';
      case 'lab':
        return 'secondary';
      case 'imaging':
        return 'outline';
      case 'visit':
        return 'outline';
      case 'gcsf':
        return 'secondary';
      case 'monitoring':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  // Filter events to show current and next 30 days
  const today = new Date();
  const next30Days = new Date(today);
  next30Days.setDate(today.getDate() + 30);
  
  const upcomingEvents = events.filter(event => 
    event.date >= today && event.date <= next30Days
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            {t('calendar.title')}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {t('calendar.cycleLabel', { number: cycleNumber })} • {regimen.name}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {upcomingEvents.filter(e => e.type === 'infusion').length}
            </div>
            <div className="text-xs text-muted-foreground">{t('calendar.overview.infusions')}</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-accent">
              {upcomingEvents.filter(e => e.type === 'lab').length}
            </div>
            <div className="text-xs text-muted-foreground">{t('calendar.overview.labs')}</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-warning">
              {upcomingEvents.filter(e => e.type === 'monitoring').length}
            </div>
            <div className="text-xs text-muted-foreground">{t('calendar.overview.monitoring')}</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-destructive">
              {upcomingEvents.filter(e => e.urgent).length}
            </div>
            <div className="text-xs text-muted-foreground">{t('calendar.overview.urgent')}</div>
          </div>
        </div>

        {/* Upcoming Events Timeline */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">{t('calendar.next30Days')}</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  isToday(event.date) && "bg-primary/10 border-primary",
                  isPast(event.date) && "opacity-60",
                  event.urgent && "border-destructive bg-destructive/5"
                )}
              >
                <div className="flex-shrink-0">
                  <Badge variant={getEventColor(event.type)} className="flex items-center gap-1">
                    {getEventIcon(event.type)}
                    {t(`calendar.legend.${event.type}`)}
                  </Badge>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {event.title}
                    </p>
                    {event.urgent && (
                    <Badge variant="destructive" className="text-xs">
                         {t('calendar.overview.urgent')}
                       </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  {event.drugs && event.drugs.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {event.drugs.map((drug, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {drug}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className={cn(
                    "font-medium",
                    isToday(event.date) && "text-primary",
                    isPast(event.date) && "text-muted-foreground"
                  )}>
                    {formatDate(event.date)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isToday(event.date) ? t('calendar.badges.today') : 
                     isPast(event.date) ? t('calendar.badges.past') : 
                     t('calendar.badges.inDays', { count: Math.ceil((event.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) })}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t">
          <h5 className="text-sm font-medium text-foreground mb-2">{t('calendar.legendTitle')}</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Syringe className="h-3 w-3 text-primary" />
              <span>{t('calendar.legend.infusion')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Microscope className="h-3 w-3 text-accent" />
              <span>{t('calendar.legend.lab')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-info" />
              <span>{t('calendar.legend.imaging')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-3 w-3 text-destructive" />
              <span>{t('calendar.legend.monitoring')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>{t('calendar.legend.visit')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};