import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!serverId) return new NextResponse("server id missing", { status: 404 });

        if (!params.channelId) return new NextResponse("channel ID not found", { status: 404 });

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
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });

        if (!server) return new NextResponse("channel not found", { status: 404 });

        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    {
        params,
    }: {
        params: { channelId: string };
    }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { name, type } = await req.json();

        if (!profile) return new NextResponse("Unauthenticated", { status: 403 });

        const serverId = searchParams.get("serverId");

        if (!serverId) return new NextResponse("Server id not found", { status: 400 });

        if (!params.channelId) return new NextResponse("channel id not found", { status: 400 });

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
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general",
                            },
                        },
                        data: {
                            name,
                            type,
                        },
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
