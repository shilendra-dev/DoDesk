// client/app/(dashboard)/[workspaceSlug]/page.tsx
import { redirect } from 'next/navigation'

interface WorkspacePageProps {
  params: Promise<{
    workspaceSlug: string
  }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceSlug } = await params
  
  // If we reach here, workspace is valid (validated by layout)
  // Just redirect to myissues
  redirect(`/${workspaceSlug}/myissues`)
}