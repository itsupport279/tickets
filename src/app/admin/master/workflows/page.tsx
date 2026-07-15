import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EditWorkflowForm } from "@/components/EditWorkflowForm";
import { StatusIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Workflows | Master Admin",
};

export default async function WorkflowsPage() {
  const session = await auth();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <Link href="/admin" className="text-sm text-black/60 hover:underline">
          ← Back to dashboard
        </Link>
        <p className="mt-6 text-sm text-black/60">
          Only the super admin can manage workflows.
        </p>
      </main>
    );
  }

  const organizations = await prisma.organizationSettings.findMany({
    orderBy: { organization: "asc" },
    include: {
      workflowStatuses: { orderBy: { order: "asc" } },
    },
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link href="/admin/master" className="text-sm text-black/60 hover:underline">
        ← Back to Master Dashboard
      </Link>

      <div className="mt-4 mb-8 flex items-center gap-4">
        <div className="w-14 h-14">
          <StatusIcon className="w-full h-full" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ticket Workflows
          </h1>
          <p className="text-sm text-black/60">
            Configure status workflows for each organization
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="rounded-lg border border-black/10 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">{org.description}</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black/80 mb-2">
                Available Statuses
              </label>
              <div className="space-y-2">
                {org.workflowStatuses.length > 0 ? (
                  org.workflowStatuses.map((status) => (
                    <div
                      key={status.id}
                      className="flex items-center justify-between rounded bg-black/[.02] px-3 py-2"
                    >
                      <div>
                        <div className="font-medium">{status.label}</div>
                        <div className="text-xs text-black/60 font-mono">
                          {status.statusValue}
                        </div>
                      </div>
                      <div className="text-xs text-black/60">
                        {status.isDefault && (
                          <span className="inline-block rounded bg-green-100 px-2 py-1 font-medium text-green-700">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-black/50">
                    No statuses configured
                  </p>
                )}
              </div>
            </div>

            <EditWorkflowForm organization={org} />
          </div>
        ))}
      </div>
    </main>
  );
}
