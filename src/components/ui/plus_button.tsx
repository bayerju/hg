"use client";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Separator } from "./separator";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./popover";

export function PlusButton() {
  const [open, setOpen] = React.useState(false);
  function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className=" absolute bottom-5 right-0 p-5 "
        // onClick={() => setOpen((prev) => !prev)}
      >
        <CirclePlus size={48} />

        <PopoverContent>
          <div className="grid gap-3">
            <Link
              href={"/add/clearing"}
              className=""
              onClick={() => setOpen(false)}
            >
              Abrechnung hinzufügen
            </Link>
            <Separator orientation="horizontal" />
            <Link
              href={"/add/payment"}
              className=""
              onClick={() => setOpen(false)}
            >
              Ausgabe hinzufügen
            </Link>
          </div>
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
}
