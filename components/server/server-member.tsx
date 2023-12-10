"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { Crown, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 ml-2" />,
    [MemberRole.ADMIN]: <Crown className="w-4 h-4 ml-2 text-yellow-500" />,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    return (
        <button
            className={cn(
                "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transistion mb-1",
                params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar src={member.profile.imageUrl} className="h-8 w-8" />
            <p
                className={cn(
                    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transistion",
                    params?.channelId === member.id &&
                        "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {member.profile.name}
            </p>
            {icon}
        </button>
    );
};

export default ServerMember;
