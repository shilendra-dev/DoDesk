import { respondError, respondOk } from '@/utils/response.js'
import { z } from 'zod'
import fetchUserByEmail from '@/resources/user/queries/fetchUserByEmail.js'
import bcrypt from 'bcryptjs'
import createUser from '../queries/createUser'
import { User } from 'better-auth/*'
import { ControllerFunction } from '@/types/controllers/base.types'
import handleInvitationOnSignup from '../services/handleInvitationOnSignup'

type CreateUserResponse = {
    user: Omit<User, "password">
}

const createUserSchema = z.object({
    email: z.email("Email is required").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    name: z.string().min(1, "Name is required")
})

type CreateUserRequest = z.infer<typeof createUserSchema>;

export const createUserAPI: ControllerFunction<CreateUserResponse> = async (req) => {
    const parsed = createUserSchema.safeParse(req.body as CreateUserRequest);

    //if validation failed return error
    if (!parsed.success) {
        const errorMessage = parsed.error.issues[0].message;
        return respondError(400, errorMessage);
    }
    //validation passedz
    const { email, password, name } = parsed.data;

    try {
        //check if user already exists
        const existingUser = await fetchUserByEmail(email);

        if (existingUser) {
            return respondError(409, "Account already exists");
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create user
        const user = await createUser(email, hashedPassword, name);
        if (!user) {
            return respondError(500, "Failed to create user");
        }

        const userWithoutPassword = {
            id: user.id,
            email: user.email,
            name: user.name,
        }

        //if invitation status is pending then add user to workspace
        const workspaceId = await handleInvitationOnSignup(user.id, email);
        if (workspaceId) {
            return respondOk(userWithoutPassword, "User successfully signed up and added to the workspace");
        }

        return respondOk(userWithoutPassword, "User successfully signed up");
    } catch (error) {
        console.error("Error creating user:", error);
        return respondError(500, "Failed to create user");
    }
}