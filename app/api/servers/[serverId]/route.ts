import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        if (!profile) return new NextResponse("Unauthorized", { status: 401 });

        if (!name || !imageUrl) {
            return new NextResponse("All credentials are required", { status: 404 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
