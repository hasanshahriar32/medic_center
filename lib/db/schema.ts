import { pgTable, uuid, varchar, integer, text, timestamp, decimal, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firebaseUid: varchar("firebase_uid", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age"),
  medicalCondition: text("medical_condition"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sensor data table
export const sensorData = pgTable("sensor_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dataType: varchar("data_type", { length: 50 }).notNull(), // 'eeg', 'ecg', 'heartRate', 'bloodPressure', 'temperature'
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  signalQuality: integer("signal_quality"), // 0-100 percentage
  metadata: jsonb("metadata").default('{}'),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => ({
  userTimestampIdx: index("idx_sensor_data_user_timestamp").on(table.userId, table.timestamp.desc()),
  typeTimestampIdx: index("idx_sensor_data_type_timestamp").on(table.dataType, table.timestamp.desc()),
}));

// Alerts table
export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(), // 'critical', 'warning', 'info'
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("active").notNull(), // 'active', 'acknowledged', 'resolved'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
}, (table) => ({
  userStatusIdx: index("idx_alerts_user_status").on(table.userId, table.status),
  statusCreatedIdx: index("idx_alerts_status_created").on(table.status, table.createdAt.desc()),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sensorData: many(sensorData),
  alerts: many(alerts),
}));

export const sensorDataRelations = relations(sensorData, ({ one }) => ({
  user: one(users, {
    fields: [sensorData.userId],
    references: [users.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  user: one(users, {
    fields: [alerts.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SensorData = typeof sensorData.$inferSelect;
export type NewSensorData = typeof sensorData.$inferInsert;
export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
