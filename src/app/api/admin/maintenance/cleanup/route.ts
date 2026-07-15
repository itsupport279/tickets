import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-super-admin";

export async function POST(req: NextRequest) {
  const check = await requireSuperAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json().catch(() => null);
  const { type } = body;

  if (!type) {
    return NextResponse.json(
      { error: "Cleanup type not specified" },
      { status: 400 },
    );
  }

  try {
    let result = { type, message: "", count: 0 };

    switch (type) {
      case "orphaned_notes": {
        // Find and delete notes for non-existent tickets
        const validTicketIds = await prisma.ticket.findMany({
          select: { id: true },
        });
        const validIds = new Set(validTicketIds.map((t) => t.id));

        const orphanedNotes = await prisma.note.findMany();
        const toDelete = orphanedNotes
          .filter((n) => !validIds.has(n.ticketId))
          .map((n) => n.id);

        if (toDelete.length > 0) {
          await prisma.note.deleteMany({
            where: { id: { in: toDelete } },
          });
        }

        result = {
          ...result,
          message: `Deleted ${toDelete.length} orphaned note(s)`,
          count: toDelete.length,
        };
        break;
      }

      case "orphaned_login_logs": {
        // Find and delete login logs for non-existent admins
        const validAdminIds = await prisma.admin.findMany({
          select: { id: true },
        });
        const validIds = new Set(validAdminIds.map((a) => a.id));

        const orphanedLogs = await prisma.adminLoginLog.findMany();
        const toDelete = orphanedLogs
          .filter((l) => !validIds.has(l.adminId))
          .map((l) => l.id);

        if (toDelete.length > 0) {
          await prisma.adminLoginLog.deleteMany({
            where: { id: { in: toDelete } },
          });
        }

        result = {
          ...result,
          message: `Deleted ${toDelete.length} orphaned login log(s)`,
          count: toDelete.length,
        };
        break;
      }

      case "unused_workflow_statuses": {
        // Delete workflow statuses for deactivated organizations
        const inactiveOrgs =
          await prisma.organizationSettings.findMany({
            where: { isActive: false },
            select: { id: true },
          });

        const toDelete = await prisma.workflowStatus.deleteMany({
          where: {
            organizationSettingsId: { in: inactiveOrgs.map((o) => o.id) },
          },
        });

        result = {
          ...result,
          message: `Deleted ${toDelete.count} workflow status(es) from inactive organizations`,
          count: toDelete.count,
        };
        break;
      }

      case "admin_org_cleanup": {
        // Remove admin-organization assignments for deleted organizations
        const validOrgs = await prisma.organizationSettings.findMany({
          select: { organization: true },
        });
        const validOrgNames = new Set(validOrgs.map((o) => o.organization));

        const invalidAssignments =
          await prisma.adminOrganization.findMany();
        const toDelete = invalidAssignments
          .filter(
            (a) =>
              a.organization !== "*" &&
              !validOrgNames.has(a.organization),
          )
          .map((a) => a.id);

        if (toDelete.length > 0) {
          await prisma.adminOrganization.deleteMany({
            where: { id: { in: toDelete } },
          });
        }

        result = {
          ...result,
          message: `Removed ${toDelete.length} invalid admin-organization assignment(s)`,
          count: toDelete.length,
        };
        break;
      }

      case "full_cleanup": {
        // Run all cleanup operations
        const cleanups = await Promise.all([
          prisma.note.deleteMany({
            where: {
              ticketId: {
                notIn: (await prisma.ticket.findMany({ select: { id: true } })).map(
                  (t) => t.id,
                ),
              },
            },
          }),
          prisma.adminLoginLog.deleteMany({
            where: {
              adminId: {
                notIn: (await prisma.admin.findMany({ select: { id: true } })).map(
                  (a) => a.id,
                ),
              },
            },
          }),
          prisma.workflowStatus.deleteMany({
            where: {
              organizationSettings: { isActive: false },
            },
          }),
        ]);

        const totalCount = cleanups.reduce((sum, c) => sum + c.count, 0);
        result = {
          ...result,
          message: `Full cleanup completed: removed ${totalCount} total orphaned record(s)`,
          count: totalCount,
        };
        break;
      }

      default:
        return NextResponse.json(
          { error: "Unknown cleanup type" },
          { status: 400 },
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cleanup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
