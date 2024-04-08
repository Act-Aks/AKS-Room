import routes from "@/constants/routes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Route = keyof typeof routes;
type RouteParams = Record<string, any>;

export const generatePath = (route: Route, params?: RouteParams) => {
  let path = routes[route];

  if (!params) {
    return path;
  }

  Object.keys(params).forEach((key) => {
    path = path.replace(`:${key}`, params[key]);
  });

  return path;
};
