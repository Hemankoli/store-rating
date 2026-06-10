CREATE TABLE IF NOT EXISTS profile (
  id         VARCHAR(36)  NOT NULL PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  address    VARCHAR(400) NOT NULL,
  role       VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'user', 'store_owner')),
  "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  name        VARCHAR(60)  NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  address     VARCHAR(400) NOT NULL,
  "ownerId"   VARCHAR(36)  UNIQUE,
  "createdAt" TIMESTAMP    NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("ownerId") REFERENCES profile(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS rating (
  id          VARCHAR(36) NOT NULL PRIMARY KEY,
  value       INT         NOT NULL,
  "storeId"   VARCHAR(36) NOT NULL,
  "userId"    VARCHAR(36) NOT NULL,
  "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW(),
  UNIQUE ("storeId", "userId"),
  FOREIGN KEY ("storeId") REFERENCES store(id)   ON DELETE CASCADE,
  FOREIGN KEY ("userId")  REFERENCES profile(id) ON DELETE CASCADE
);
