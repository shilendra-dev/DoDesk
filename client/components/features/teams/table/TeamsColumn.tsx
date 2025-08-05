"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Team } from "@/types/workspace"
import { Button } from "@/components/ui/atoms/button"
import { MoreHorizontal } from "lucide-react"
import { TeamNameCell, TeamMembershipCell, TeamMembersCell } from "@/components/ui/atoms/rowElements"

export const TeamsColumns: ColumnDef<Team>[] = [
  {
    id: "team-info",
    header: "Name",
    enableSorting: true,
    size: 400,
    cell: ({ row }) => {
      const team = row.original
      return (
        <div className="flex items-center">
          <TeamNameCell team={team} />
        </div>
      )
    },
  },
  {
    id: "membership-and-members",
    header: "Membership & Members",
    enableSorting: false,
    size: 300,
    cell: ({ row }) => {
      const team = row.original
      return (
        <div className="flex items-center justify-end gap-4">
          <TeamMembershipCell team={team} />
          <TeamMembersCell team={team} />
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    size: 60,
    cell: ({ row }) => {
      const _team = row.original
      return (
        <div className="flex items-center justify-center w-8">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              // TODO: Implement team actions menu
            }}
          >
            <MoreHorizontal size={14} />
          </Button>
        </div>
      )
    },
  },
]