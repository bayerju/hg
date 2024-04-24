"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { SearchUsers, SimpleUser } from "../combobox_multi";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export function ClearingForm() {
  const utils = api.useUtils();
  const router = useRouter();
  const [involvedUsers, setInvolvedUsers] = useState<SimpleUser[]>([]);
  const [name, setName] = useState("");
  const createClearing = api.clearing.create.useMutation({
    onSuccess: async () => {
      await utils.clearing.get.invalidate();
      router.push("/");
    },
  });
  return (
    <div>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Bezeichnung"
      />
      <SearchUsers
        placeholder="Wer ist beteiligt"
        selectedUsers={involvedUsers}
        setSelectedUsers={setInvolvedUsers}
      />
      <Button
        type="submit"
        onClick={(e) => {
          createClearing.mutateAsync({
            name: name,
            involvedUsers: involvedUsers,
          });
        }}
      >
        Clearing erstellen
      </Button>
    </div>
  );
}
