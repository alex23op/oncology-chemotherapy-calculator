import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTSafe } from "@/i18n/tSafe";
import { logger } from "@/utils/logger";

const NotFound = () => {
  const location = useLocation();
  const tSafe = useTSafe();

  useEffect(() => {
    logger.error("404 Error: User attempted to access non-existent route", {
      component: 'NotFound',
      route: location.pathname
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">{tSafe('notFound.title', '404 - Page Not Found')}</h1>
        <p className="text-xl text-muted-foreground mb-4">{tSafe('notFound.subtitle', 'The page you are looking for does not exist')}</p>
        <a href="/" className="text-primary hover:underline">
          {tSafe('notFound.backHome', 'Back to Home')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
