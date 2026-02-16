-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LinkedInAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cookie" TEXT,
    "status" TEXT NOT NULL DEFAULT 'disconnected',
    "riskLevel" TEXT NOT NULL DEFAULT 'low',
    "dailyLimit" INTEGER NOT NULL DEFAULT 50,
    "usedToday" INTEGER NOT NULL DEFAULT 0,
    "lastSync" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LinkedInAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "linkedinId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "company" TEXT,
    "location" TEXT,
    "profileUrl" TEXT,
    "notes" TEXT,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Prospect_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProspectActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prospectId" TEXT NOT NULL,
    "accountId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "content" TEXT,
    "scheduledAt" DATETIME,
    "executedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProspectActivity_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProspectActivity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LinkedInAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AutomationRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "conditions" TEXT,
    "actions" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "schedule" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AutomationRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentTopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "searchInterval" INTEGER NOT NULL DEFAULT 3600,
    "lastCrawl" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContentArticle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "author" TEXT,
    "engagement" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentArticle_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ContentTopic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_linkedinId_key" ON "Prospect"("linkedinId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentArticle_url_key" ON "ContentArticle"("url");
