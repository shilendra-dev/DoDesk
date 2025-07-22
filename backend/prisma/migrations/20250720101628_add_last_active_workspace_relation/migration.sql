-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastActiveWorkspaceId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lastActiveWorkspaceId_fkey" FOREIGN KEY ("lastActiveWorkspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
