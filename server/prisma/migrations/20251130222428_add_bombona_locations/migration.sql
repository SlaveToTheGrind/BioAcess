-- CreateTable
CREATE TABLE "Portal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "apiKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME
);

-- CreateTable
CREATE TABLE "ReadEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "rfidId" INTEGER,
    "portalId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rssi" INTEGER,
    "antenna" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReadEvent_rfidId_fkey" FOREIGN KEY ("rfidId") REFERENCES "Rfid" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ReadEvent_portalId_fkey" FOREIGN KEY ("portalId") REFERENCES "Portal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bombona" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serial" TEXT NOT NULL,
    "label" TEXT,
    "rfidId" INTEGER,
    "ownerId" INTEGER,
    "contents" TEXT,
    "currentLocation" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bombona_rfidId_fkey" FOREIGN KEY ("rfidId") REFERENCES "Rfid" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bombona_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Movement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bombonaId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "actor" TEXT,
    "location" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,
    CONSTRAINT "Movement_bombonaId_fkey" FOREIGN KEY ("bombonaId") REFERENCES "Bombona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rfid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "label" TEXT,
    "metadata" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" INTEGER,
    "lastSeenAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rfid_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Rfid" ("active", "createdAt", "id", "label", "lastSeenAt", "metadata", "ownerId", "uid") SELECT "active", "createdAt", "id", "label", "lastSeenAt", "metadata", "ownerId", "uid" FROM "Rfid";
DROP TABLE "Rfid";
ALTER TABLE "new_Rfid" RENAME TO "Rfid";
CREATE UNIQUE INDEX "Rfid_uid_key" ON "Rfid"("uid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Portal_apiKey_key" ON "Portal"("apiKey");

-- CreateIndex
CREATE INDEX "ReadEvent_uid_idx" ON "ReadEvent"("uid");

-- CreateIndex
CREATE INDEX "ReadEvent_portalId_timestamp_idx" ON "ReadEvent"("portalId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Bombona_serial_key" ON "Bombona"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "Bombona_rfidId_key" ON "Bombona"("rfidId");

-- CreateIndex
CREATE INDEX "Movement_bombonaId_timestamp_idx" ON "Movement"("bombonaId", "timestamp");
