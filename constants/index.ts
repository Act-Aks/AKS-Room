import routes from "./routes";

export const sidebarLinks = [
  {
    imgUrl: "/icons/home.svg",
    label: "Home",
    route: routes.Home,
  },
  {
    imgUrl: "/icons/upcoming.svg",
    label: "Upcoming",
    route: routes.Upcoming,
  },
  {
    imgUrl: "/icons/previous.svg",
    label: "Previous",
    route: routes.Previous,
  },
  {
    imgUrl: "/icons/video.svg",
    label: "Recordings",
    route: routes.Recordings,
  },
  {
    imgUrl: "/icons/add-meeting.svg",
    label: "Personal Room",
    route: routes.PersonalRoom,
  },
];
