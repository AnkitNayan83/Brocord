import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    Member: (Member & { profile: Profile })[];
};
