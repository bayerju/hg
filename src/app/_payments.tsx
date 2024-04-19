"use client";

import { useEffect, useState } from "react";
import { text } from "stream/consumers";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { RouterOutput } from "~/server/api/trpc";
import { api } from "~/trpc/react";
import { ArrayElement } from "~/lib/types";
import { Separator } from "~/components/ui/separator";

export function Payments() {
  const payments = api.spending.getAll.useQuery();
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  useEffect(() => {
    if (!payments.data) return;
    const score = payments.data.reduce((acc, iPayment) => {
      return acc + calcAffect(iPayment);
    }, 0);
    setScore(score);
  }, [payments.data]);
  const calcAffect = (
    aPayment: ArrayElement<RouterOutput["spending"]["getAll"]>,
  ) => {
    if (!aPayment.haveIPayed) {
      return 0 - aPayment.amount / 100 / aPayment.usersAffected.length;
    }
    if (!aPayment.amIAffected) {
      return aPayment.amount / 100 / aPayment.usersPayed.length;
    }

    return (
      0 +
      aPayment.amount / 100 / aPayment.usersPayed.length -
      aPayment.amount / 100 / aPayment.usersAffected.length
    );
  };
  const listClassNames = (isNegative: boolean) => {
    return cn(`${isNegative ? "text-red-500" : ""} `);
  };

  if (payments.isLoading) {
    return <div className=" text-">Loading...</div>;
  }

  return (
    <div>
      <ul>
        {payments.data?.map((iPayment) => {
          const result = calcAffect(iPayment);
          if (iPayment.id === selectedPayment) {
            return (
              <li key={iPayment.id}>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className={cn(
                    "bg-slate-300",
                    "grid w-full justify-between gap-2",
                  )}
                >
                  <div>
                    {iPayment.name}:{" "}
                    {iPayment.amount ? iPayment.amount / 100 : "Error"}€
                  </div>
                  <div>{result}</div>
                  <div className=" col-span-2">
                    {iPayment.usersAffected.map((iUser) => (
                      <Badge variant={"destructive"}>
                        {iUser.user?.username}
                      </Badge>
                    ))}
                    {iPayment.usersPayed.map((iUser) => (
                      <Badge variant={"bezahlt"}>{iUser.user?.username}</Badge>
                    ))}
                  </div>
                </button>
              </li>
            );
          }
          return (
            <li key={iPayment.id}>
              <button
                type="button"
                onClick={() => setSelectedPayment(iPayment.id)}
                className={"flex w-full grid-cols-2 justify-between gap-2"}
              >
                <div>
                  {iPayment.name}:{" "}
                  {iPayment.amount ? iPayment.amount / 100 : "Error"}€
                </div>
                <div className={listClassNames(result < 0)}>{result}</div>
              </button>
            </li>
          );
        })}
      </ul>
      <Separator />
      {!score && <div>loading...</div>}
      {score && (
        <div className={cn("flex w-full justify-end")}>
          score: <span className={listClassNames(score < 0)}>{score}</span>
        </div>
      )}
    </div>
  );
}
