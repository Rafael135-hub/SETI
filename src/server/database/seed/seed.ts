import { getDatabase, privacyLevelTable, accessLevelTable, groupTable, userGroupTable, groupAccessLevelTable, userTable } from "../index";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
    const database = await getDatabase();

    // Update privacy levels to only private and public
    await database.delete(privacyLevelTable);

    await database.insert(privacyLevelTable)
        .values([
            { privacyLevel: "public" },
            { privacyLevel: "private" },
        ])
        .onConflictDoNothing({ target: privacyLevelTable.privacyLevel });

    // Create access levels
    await database.insert(accessLevelTable)
        .values([
            { accessLevel: "View", description: "Can view files and collections" },
            { accessLevel: "Create", description: "Can create files and collections" },
            { accessLevel: "Edit", description: "Can edit files and collections" },
            { accessLevel: "Delete", description: "Can delete files and collections" },
            { accessLevel: "Admin", description: "Has all access levels and special privileges" },
        ])
        .onConflictDoNothing({ target: accessLevelTable.accessLevel });

    const getOrCreateGroup = async (groupName: string, description: string) => {
        const [existing] = await database
            .select()
            .from(groupTable)
            .where(eq(groupTable.groupName, groupName));
        if (existing) return existing;
        const [created] = await database
            .insert(groupTable)
            .values({ groupName, description })
            .onConflictDoNothing({ target: groupTable.groupName })
            .returning();
        return created || existing;
    };

    const getOrCreateUser = async (name: string, email: string) => {
        const [existing] = await database
            .select()
            .from(userTable)
            .where(eq(userTable.email, email));
        if (existing) return existing;
        const [created] = await database
            .insert(userTable)
            .values({ name, email, emailVerified: true })
            .onConflictDoNothing({ target: userTable.email })
            .returning();
        return created || existing;
    };

    // Create default groups
    const mamAdminGroup = await getOrCreateGroup(
        "MAM Admin",
        "Media Asset Management Administrators"
    );
    const mamDefaultGroup = await getOrCreateGroup(
        "MAM Default",
        "Default group for all users"
    );

    const accessLevels = await database.select().from(accessLevelTable);
    const viewLevel = accessLevels.find((lvl) => lvl.accessLevel === "View");

    if (mamAdminGroup) {
        await database.insert(groupAccessLevelTable)
            .values(accessLevels.map(al => ({
                groupId: mamAdminGroup.id,
                accessLevelId: al.id
            })))
            .onConflictDoNothing();
    }

    const carolinaUser = await getOrCreateUser(
        "Moretti Carolina",
        "Carolina.Moretti@br.bosch.com"
    );
    const rafaelUser = await getOrCreateUser(
        "Moreira Rafael",
        "rafael.moreira3@br.bosch.com"
    );

    if (carolinaUser && mamAdminGroup) {
        await database.insert(userGroupTable)
            .values({
                userId: carolinaUser.id,
                groupId: mamAdminGroup.id
            })
            .onConflictDoNothing();
    }

    if (rafaelUser && mamAdminGroup) {
        await database.insert(userGroupTable)
            .values({
                userId: rafaelUser.id,
                groupId: mamAdminGroup.id
            })
            .onConflictDoNothing();
    }

    // Create test user for MAM Default group with only View access
    const testUser = await getOrCreateUser("Test User", "test@example.com");

    if (mamDefaultGroup) {
        if (testUser) {
            await database.insert(userGroupTable)
                .values({
                    userId: testUser.id,
                    groupId: mamDefaultGroup.id
                })
                .onConflictDoNothing();
        }

        if (viewLevel) {
            await database.insert(groupAccessLevelTable)
                .values({
                    groupId: mamDefaultGroup.id,
                    accessLevelId: viewLevel.id
                })
                .onConflictDoNothing();
        }
    }

    if (viewLevel) {
        const allGroups = await database.select().from(groupTable);
        if (allGroups.length) {
            await database.insert(groupAccessLevelTable)
                .values(allGroups.map((group) => ({
                    groupId: group.id,
                    accessLevelId: viewLevel.id,
                })))
                .onConflictDoNothing();
        }
    }
}
