import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { name, type } = await req.json();

        if (!profile) return new NextResponse("Unauthenticated", { status: 403 });

        const serverId = searchParams.get("serverId");

        if (!serverId) return new NextResponse("Server id not found", { status: 400 });

        if (name === "general") return new NextResponse("Name cannot be general", { status: 403 });

        const server = await db.server.update({
            where: {
                id: serverId,
                Member: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                Channel: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
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
