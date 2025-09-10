import { createApi } from "@/utils/router";
import { createUserAPI } from "./api/create-user.api";
import { getCurrentUserAPI } from "./api/get-current-user.api";

createApi().post("/user").noAuth(createUserAPI);
createApi().get("/user").authSecure(getCurrentUserAPI);
