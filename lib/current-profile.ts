import { auth } from "@clerk/nextjs";
import { db } from "./db";

export const currentProfile = async () => {
    const { userId } = auth();

    if (!userId) {
        return null;
    }

    const user = await db.profile.findUnique({
        where: {
            userId: userId,
        },
    });

    return user;
};
