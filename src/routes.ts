import { type RouteConfig, index, route } from "@react-router/dev/routes";
export default [
  index("./routes/Login.tsx"),
  route("/login", "./routes/Login.tsx"),
  route("/about", "./routes/About.tsx"),
  route("/contact", "./routes/Contact.tsx"),
  route("/vision", "./routes/Vision.tsx"),

  // pattern ^           ^ module file
] satisfies RouteConfig;
