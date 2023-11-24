import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

const state = true;

export default function Home() {
    return (
        <div>
            <h1 className="text-red-500 font-bold text-2xl">Hello world</h1>
            <Button className={cn("bg-red-500 ml-2", state && "bg-green-500")}>Button</Button>
            <UserButton afterSignOutUrl="/" />
            <ThemeIcon />
        </div>
    );
}
