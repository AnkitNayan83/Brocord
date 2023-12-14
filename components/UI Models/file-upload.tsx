"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { Button } from "../ui/button";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "serverImage" | "messageFile";
    name?: string;
}

const FileUpload = ({ endpoint, value, onChange, name }: FileUploadProps) => {
    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20">
                <Image fill src={value} alt="Upload" className="rounded-full" />
                <Button
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm h-5 w-5 hover:bg-red-500/70"
                    type="button"
                    onClick={() => onChange("")}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    if (value && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-14 w-14 fill-indigo-200 stroke-indigo-400" />
                <a href={value} target="_blank" rel="noopener noreferrer">
                    <p>{value}</p>
                </a>
                <Button
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm h-4 w-4 hover:bg-red-500/70"
                    type="button"
                    onClick={() => onChange("")}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                console.log(error);
            }}
        />
    );
};

export default FileUpload;
