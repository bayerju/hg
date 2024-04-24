"use client";
import { ArrayElement } from "~/lib/types";
import { RouterOutput } from "~/server/api/trpc";

export function ClearingCard(props: {
  clearing: ArrayElement<RouterOutput["clearing"]["get"]>;
}) {
  return <div>test</div>;
}
