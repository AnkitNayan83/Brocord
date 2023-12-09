import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("server id not found", { status: 404 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id, //admin cannot leave
                },
                Member: {
                    some: {
                        profileId: profile.id, // to check whether this user is a member of this server or not
                    },
                },
            },
            data: {
                Member: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
