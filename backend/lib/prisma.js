// lib/prisma.js
// Importing Prisma Client from a custom output path as defined in schema.prisma:
// generator client {
//   provider = "prisma-client-js"
//   output   = "./prisma/generated/prisma"
// }
// For more details, see:
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client
const { PrismaClient } = require('../prisma/generated/prisma');
const prisma = new PrismaClient();
module.exports = prisma;
