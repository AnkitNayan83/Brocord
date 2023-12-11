"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../UI Models/create-server-model";
import InviteServerModal from "../UI Models/invite-server-model";
import ServerSettingsModal from "../UI Models/server-setting-model";
import ManageMemberModal from "../UI Models/manage-member-modal";
import CreateChanelModal from "../UI Models/create-chanel-modal";
import LeaveServerModal from "../UI Models/leave-server-modal";
import DeleteServerModal from "../UI Models/delete-server-modal";
import DeleteChannelModal from "../UI Models/delete-channel-modal";
import EditChannelModal from "../UI Models/edit-channel-modal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <CreateServerModal />
            <InviteServerModal />
            <ServerSettingsModal />
            <ManageMemberModal />
            <CreateChanelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
        </>
    );
};

export default ModalProvider;
