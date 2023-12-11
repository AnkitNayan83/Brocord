import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface paramsType {
    params: { serverId: string };
}

const ServerIDPage = async ({ params }: paramsType) => {
    const serverId = params.serverId;
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            Member: {
                some: {
                    profileId: profile.id,
                },
            },
        },
        include: {
            Channel: {
                where: {
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!server) {
        return redirect("/");
    }

    const initialChanel = server?.Channel[0];

    if (initialChanel?.name !== "general") {
        return null;
    }

    return redirect(`/servers/${serverId}/channels/${initialChanel.id}`);
};

export default ServerIDPage;
