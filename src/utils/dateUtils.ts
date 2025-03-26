
import { format, addDays, isSameDay, parseISO, isValid } from "date-fns";
import { it } from "date-fns/locale";

export const formatDate = (date: Date | string): string => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, "d MMMM yyyy", { locale: it }) : "";
};

export const formatTimeAgo = (date: Date | string): string => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return "";
  
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Oggi";
  if (diffInDays === 1) return "Ieri";
  if (diffInDays < 7) return `${diffInDays} giorni fa`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} settimane fa`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} mesi fa`;
  return `${Math.floor(diffInDays / 365)} anni fa`;
};

export const getNextTestDate = (lastTest: Date | null, riskLevel: "low" | "medium" | "high"): Date => {
  const today = new Date();
  
  if (!lastTest) {
    // If no previous test, base it only on risk level
    switch (riskLevel) {
      case "high": return addDays(today, 14); // 2 weeks
      case "medium": return addDays(today, 30); // 1 month
      case "low": return addDays(today, 90); // 3 months
      default: return addDays(today, 180); // 6 months
    }
  }
  
  // If there's a previous test date
  switch (riskLevel) {
    case "high": return addDays(lastTest, 30); // 1 month from last test
    case "medium": return addDays(lastTest, 90); // 3 months from last test
    case "low": return addDays(lastTest, 180); // 6 months from last test
    default: return addDays(lastTest, 180); // 6 months from last test
  }
};

export const getUpcomingEvents = (tests: any[], encounters: any[]) => {
  const now = new Date();
  const upcomingTests = tests
    .filter(test => new Date(test.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  const recentEncounters = encounters
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return { upcomingTests, recentEncounters };
};
