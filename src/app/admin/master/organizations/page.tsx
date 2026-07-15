import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EditOrganizationForm } from "@/components/EditOrganizationForm";
import { CreateOrganizationForm } from "@/components/CreateOrganizationForm";
import { AdminIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Organizations | Master Admin",
};

export default async function OrganizationsPage() {
  const session = await auth();
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <Link href="/admin" className="text-sm text-black/60 hover:underline">
          ← Back to dashboard
        </Link>
        <p className="mt-6 text-sm text-black/60">
          Only the super admin can manage organizations.
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
          <AdminIcon className="w-full h-full" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Organization Settings
          </h1>
          <p className="text-sm text-black/60">
            Manage configuration for {organizations.length} organization
            {organizations.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <CreateOrganizationForm />
      </div>

      <div className="space-y-8">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="rounded-lg border border-black/10 p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{org.description}</h2>
                <p className="text-sm text-black/60">{org.organization}</p>
              </div>
              {org.isActive ? (
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Active
                </span>
              ) : (
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                  Inactive
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black/80">
                    Email Domain
                  </label>
                  <div className="mt-1 rounded bg-black/[.02] px-3 py-2 text-sm">
                    {org.emailDomain}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black/80">
                    Ticket Prefix
                  </label>
                  <div className="mt-1 rounded bg-black/[.02] px-3 py-2 text-sm font-mono">
                    {org.referencePrefix}
                  </div>
                </div>
              </div>

              {org.workflowStatuses.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-black/80">
                    Workflow Statuses
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {org.workflowStatuses.map((status) => (
                      <span
                        key={status.id}
                        className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        {status.label}
                        {status.isDefault && (
                          <span className="ml-1 text-blue-600">✓</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <EditOrganizationForm organization={org} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
