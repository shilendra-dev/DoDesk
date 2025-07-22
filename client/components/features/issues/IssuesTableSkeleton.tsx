import { Skeleton } from "@/components/ui/atoms/skeleton"

export function IssuesTableSkeleton() {
  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">
              <Skeleton className="h-4 w-4" />
            </th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Title</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">State</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Created</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Assignee</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
            <th className="p-3 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="border-b border-border">
              <td className="p-3">
                <Skeleton className="h-4 w-4" />
              </td>
              <td className="p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </td>
              <td className="p-3">
                <Skeleton className="h-6 w-20" />
              </td>
              <td className="p-3">
                <Skeleton className="h-6 w-16" />
              </td>
              <td className="p-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </td>
              <td className="p-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="p-3">
                <Skeleton className="h-8 w-8" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 