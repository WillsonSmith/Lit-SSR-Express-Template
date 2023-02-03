-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "challenge" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "webAuthTokenId" INTEGER NOT NULL,
    CONSTRAINT "Challenge_webAuthTokenId_fkey" FOREIGN KEY ("webAuthTokenId") REFERENCES "WebAuthToken" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Challenge" ("challenge", "createdAt", "id", "webAuthTokenId") SELECT "challenge", "createdAt", "id", "webAuthTokenId" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE UNIQUE INDEX "Challenge_challenge_key" ON "Challenge"("challenge");
CREATE UNIQUE INDEX "Challenge_webAuthTokenId_key" ON "Challenge"("webAuthTokenId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
