"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { z } from "zod";
import { SimpleUserSchema } from "~/types/simple_user";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export type SimpleUser = z.infer<typeof SimpleUserSchema>;

export function SearchUsers(props: {
  placeholder: string;
  selectedUsers: SimpleUser[];
  setSelectedUsers: (
    users: SimpleUser[] | ((users: SimpleUser[]) => SimpleUser[]),
  ) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchUsername, setSearchUsername] = React.useState("");
  const users = api.user.findByUsername.useQuery(
    { username: searchUsername },
    { enabled: searchUsername.length > 0 },
  );

  const { selectedUsers, setSelectedUsers, placeholder } = props;

  return (
    <div>
      <div className="pb-2">
        {selectedUsers.length > 0 &&
          selectedUsers.map((iUser) => (
            <button
              value={iUser.id}
              onClick={(e) => {
                const value = e.currentTarget.value;
                setSelectedUsers((prev) =>
                  prev.filter((iUser) => iUser.id.toString() != value),
                );
              }}
            >
              <Badge variant={"secondary"}>{iUser.username}</Badge>
            </button>
          ))}
      </div>
      <Input
        className=""
        value={searchUsername}
        placeholder={placeholder}
        onChange={(e) => setSearchUsername(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      />

      <ul
        className={
          users.data && users.data.length >= 1
            ? cn(
                "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                { hidden: !open && searchUsername.length >= 0 },
                "absolute",
              )
            : "hidden"
        }
      >
        {users.data &&
          users.data.length >= 1 &&
          users.data
            .filter(
              (iUser) =>
                !selectedUsers.find(
                  (iSelectedUser) => iUser.id === iSelectedUser.id,
                ),
            )
            .map((iUser) => (
              <li key={iUser.id}>
                <button
                  value={iUser.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    const value = e.currentTarget.value;
                    console.log("click", value);
                    setSelectedUsers((prev) => [...prev, iUser]);
                    setSearchUsername("");
                  }}
                >
                  {iUser.username}
                </button>
              </li>
            ))}
      </ul>
    </div>
  );
}
