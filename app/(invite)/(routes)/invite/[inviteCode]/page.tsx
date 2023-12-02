import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InvitePageProps {
    params: {
        inviteCode: string;
    };
}

const InvitePage = async ({ params }: InvitePageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const existingUser = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            Member: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (existingUser) {
        return redirect(`/servers/${existingUser.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            Member: {
                create: [
                    {
                        profileId: profile.id,
                    },
                ],
            },
        },
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
};

export default InvitePage;
