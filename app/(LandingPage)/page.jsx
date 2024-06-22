import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      Landing Page (Unprotected)
      <div>
        <Link href="/sign-in">
          <Button>LOGIN</Button>
        </Link>
        <Link href="/sign-up">
          <Button>REGISTER</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
