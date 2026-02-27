import { and, ilike, or, sql,eq, getTableColumns } from 'drizzle-orm';
import express from 'express'
import { departements, subjects } from '../db/schema';
import { db } from '../db';

const router =express.Router();

//Get aall subjects with optional search, filter and pagination
router.get('/',async (req, res) => {
    try {
       const{ search, departement, page = 1, limit = 10 } = req.query;
       const currentPage = Math.max(1,+page);
       const limitPage = Math.max(1,+limit);

       const offset = (currentPage - 1) * limitPage;
         const filterConditions = [];
    //if fsearch query exits ,filter by subject name or subject code
    if (search) {
        filterConditions.push(
            or(
                ilike(subjects.name, `%${search}%`),
                ilike(subjects.code, `%${search}%`)
            )
        );
    }
    //if departement query exits ,filter by departement id
    if (departement) {
        filterConditions.push(ilike(departements.name, `%${departement}%`));
    }
    
    //combine all filter conditions using AND operator
    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db.select({count :sql<number>`count(*)`})
    .from(subjects)
    .leftJoin(departements, eq(subjects.departmentId, departements.id))
    .where(whereClause);
    const totalCount = countResult[0]?.count || 0;

    const subjectList = await db.select({
        ...getTableColumns(subjects),
        departement:{...getTableColumns(departements)}
    }).from(subjects).leftJoin(departements, eq(subjects.departmentId, departements.id))
    .where(whereClause)
    .limit(limitPage)
    .offset(offset);
    res.status(200).json({
        data:subjectList,
        pagination:{
            page:currentPage,
            limit:limitPage,
            total:totalCount,
            totalPages:Math.ceil(totalCount/limitPage)
        }
    });
    } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });        
    }
})

export default router;