
import { relations } from "drizzle-orm";
import { pgTable, integer,varchar, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
    createdAt:timestamp('created_at').defaultNow().notNull(),
updatedAt:timestamp('updated_at').defaultNow().$onUpdate(()=>new Date()).notNull(),
}
export const departements = pgTable('departements', {
    id:integer('id').primaryKey().generatedAlwaysAsIdentity(),
code:varchar('code',{length:50}).notNull().unique(),
name:varchar('name',{length:255}).notNull(),
description:varchar('description',{length:255}),
...timestamps

})

export const subjects = pgTable('subjects', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer('department_id').notNull().references(() => departements.id, { onDelete: 'restrict' }),
    name: varchar('name', {length: 255}).notNull(),
    code: varchar('code', {length: 50}).notNull().unique(),
    description: varchar('description', {length: 255}),
    ...timestamps
});

export const departementRelations = relations(departements,({many})=>({subjects:many(subjects)}))

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
    department: one(departements, {
        fields: [subjects.departmentId],
        references: [departements.id],
    })
    
}));

export type Departement = typeof departements.$inferSelect;
export type NewDepartement = typeof departements.$inferInsert;

export type Subjects = typeof subjects.$inferSelect;
export type NewSubjects = typeof subjects.$inferInsert;


