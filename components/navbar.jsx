import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const Navbar = () => {
    return (
        <div className="flex sticky  justify-between items-center p-2   ">
            <div className="invisible">
            <p></p>
            </div>
            <div className="flex flex-row justify-center items-center md:hidden">
                <Link href="/dashboard" className="  ">
                    <div className="relative w-8 h-8 mr-4">
                        <Image fill alt="Logo" src="/logo.png" />
                    </div>
                </Link>
                    <h1 className={cn("text-lg font-bold", montserrat.className)}>
                        AI APPAREL
                    </h1>
                
            </div>
            
            <div className="flex w-fit justify-end md:mr-2">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
}

export default Navbar;
