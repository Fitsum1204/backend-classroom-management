import { and, ilike, or, sql, eq, getTableColumns } from 'drizzle-orm';
import express from 'express';
import { departments, subjects } from '../db/schema';
import { db } from '../db';

const router = express.Router();

//Get aall subjects with optional search, filter and pagination
router.get('/', async (req, res) => {
  try {
    const { search, department, page, limit } = req.query;

    if (
      Array.isArray(search) ||
      Array.isArray(department) ||
      Array.isArray(page) ||
      Array.isArray(limit)
    ) {
      return res
        .status(400)
        .json({ error: 'Query parameters must be single values.' });
    }

    if (search !== undefined && typeof search !== 'string') {
      return res.status(400).json({ error: 'Search must be a string.' });
    }

    if (department !== undefined && typeof department !== 'string') {
      return res.status(400).json({ error: 'Department must be a string.' });
    }

    const parsedPage = page === undefined ? 1 : Number(page);
    const parsedLimit = limit === undefined ? 10 : Number(limit);
    const maxLimit = 100;

    if (
      !Number.isFinite(parsedPage) ||
      !Number.isInteger(parsedPage) ||
      parsedPage < 1
    ) {
      return res
        .status(400)
        .json({ error: 'Page must be a positive integer.' });
    }

    if (
      !Number.isFinite(parsedLimit) ||
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > maxLimit
    ) {
      return res
        .status(400)
        .json({ error: `Limit must be a positive integer up to ${maxLimit}.` });
    }

    const currentPage = parsedPage;
    const limitPage = parsedLimit;

    const offset = (currentPage - 1) * limitPage;
    const filterConditions = [];
    //if fsearch query exits ,filter by subject name or subject code
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }
    //if department query exits ,filter by department id
    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    //combine all filter conditions using AND operator
    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);
    const totalCount = countResult[0]?.count || 0;

    const subjectList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .limit(limitPage)
      .offset(offset);
    res.status(200).json({
      data: subjectList,
      pagination: {
        page: currentPage,
        limit: limitPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPage),
      },
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

export default router;
