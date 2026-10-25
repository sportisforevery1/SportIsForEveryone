const keys: Record<string, string> = {
  "/films": "films",
  "/interviews": "interviews",
  "/stories": "stories",
  "/where-she-stands": "whereSheStands",
  "/education": "education",
  "/academy": "academy",
  "/events": "events",
  "/shop": "shop",
  "/about": "about",
  "/work-with-us": "workWithUs",
  "/donate": "donate",
  "/join": "join",
  "/database": "database",
};

export function navMessageKey(href: string): string {
  return keys[href] || "about";
}
