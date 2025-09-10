import { createApi } from "@/utils/router";
import { createUserAPI } from "./api/create-user.api";

createApi().post("/user").noAuth(createUserAPI);