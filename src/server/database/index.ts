import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { userTable, sessionTable, accountTable, verificationTable } from "./tables/user.table";
import { fileTable } from "./tables/file";
import { fileTypeTable } from "./tables/file_type";
import { privacyLevelTable } from "./tables/privacy_level";
import { fileUserAccessTable } from "./tables/file_user_access";
import { collectionTable, collectionGroupTable } from "./tables/collection";
import { collectionFileTable } from "./tables/collection_file";
import { collectionUserTable } from "./tables/collection_user";
import { accessLevelTable } from "./tables/access-level";
import { groupTable, userGroupTable, groupAccessLevelTable } from "./tables/group";
import { userUploadTable } from "./tables/user-upload";
import { fileGroupTable } from "./tables/file_group";
import { tagTable } from "./tables/tag";
import { fileTagTable } from "./tables/file_tag";
import { collectionTagTable } from "./tables/collection_tag";

let databaseInstance: any = null;

async function getDatabase() {
  if (!databaseInstance) {
    // Use DATABASE_URL if available, otherwise fall back to individual variables
    const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:root@localhost:5432/media_archiving?sslmode=disable";
    
    const pool = new Pool({
      connectionString: databaseUrl,
    });
    
    databaseInstance = drizzle(pool, {
      schema: {
        userTable,
        sessionTable,
        accountTable,
        verificationTable,
        fileTable,
        fileTypeTable,
        privacyLevelTable,
        fileUserAccessTable,
        collectionTable,
        collectionGroupTable,
        collectionFileTable,
        collectionUserTable,
        accessLevelTable,
        groupTable,
        userGroupTable,
        groupAccessLevelTable,
        userUploadTable,
        fileGroupTable,
        tagTable,
        fileTagTable,
        collectionTagTable,
      },
    });
  }
  return databaseInstance;
}

export { getDatabase };

export {
  userTable,
  sessionTable,
  accountTable,
  verificationTable,
  fileTable,
  fileTypeTable,
  privacyLevelTable,
  fileUserAccessTable,
  collectionTable,
  collectionGroupTable,
  collectionFileTable,
  collectionUserTable,
  accessLevelTable,
  groupTable,
  userGroupTable,
  groupAccessLevelTable,
  userUploadTable,
  fileGroupTable,
  tagTable,
  fileTagTable,
  collectionTagTable,
};
