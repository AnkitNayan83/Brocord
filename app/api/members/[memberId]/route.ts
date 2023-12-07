import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url); // query
        const { role } = await req.json(); // body

        const serverId = searchParams.get("serverId");

        if (!serverId) return new NextResponse("server id not found", { status: 400 });

        if (!params.memberId) {
            return new NextResponse("member id not found", { status: 400 });
        }

        if (!profile) return new NextResponse("Unauthenticated", { status: 403 });

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                Member: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id,
                            },
                        },
                        data: {
                            role,
                        },
                    },
                },
            },
            include: {
                Member: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse("Server Down", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url); // query

        const serverId = searchParams.get("serverId");

        if (!serverId) return new NextResponse("server id not found", { status: 400 });

        if (!params.memberId) {
            return new NextResponse("member id not found", { status: 400 });
        }

        if (!profile) return new NextResponse("Unauthenticated", { status: 403 });

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                Member: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id,
                        },
                    },
                },
            },
            include: {
                Member: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log(error);
        return new NextResponse("Server Down", { status: 500 });
    }
}
