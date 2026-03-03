import { Request, Response, NextFunction } from 'express';
import {aj} from '../config/arcjet';
import { ArcjetNodeRequest, slidingWindow } from '@arcjet/node';
const securityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }
    try {
         const role:RateLimitRole = req.user?.role ?? 'gust';    
        let limit:number;
        let message:string;
        switch (role) {
            case 'admin':
                limit = 20; // 200 requests per minute for admin
                message = 'Admin rate limit exceeded. Please try again later.';
                break;
            case 'teacher':
                limit = 10; // 100 requests per minute for teacher  
                message = 'Teacher rate limit exceeded. Please try again later.';
                break;
            case 'student':
                limit = 5; // 50 requests per minute for student
                message = 'Student rate limit exceeded. Please try again later.';
                break;
            case 'guest':
                limit = 1; // 10 requests per minute for guest
                message = 'Guest rate limit exceeded. Please try again later.';
                break;} 
                const client = aj.withRule(
                    slidingWindow({
                        mode: 'LIVE',
                        interval: '1m', // 1 minute window
                        max: limit, // Set the max requests based on role
                        
                    }),
                )
                const arcjetRequest: ArcjetNodeRequest = {
                    headers: req.headers,
                    method: req.method,
                    url: req.originalUrl??req.url,
                    socket:{remoteAddress:req.socket.remoteAddress??req.ip??'0.0.0.0'},
                };
                const decision = await client.protect(arcjetRequest);
                if (decision.isDenied() && decision.reason.isBot()) {
                    return res.status(403).json({ error: 'Access denied. Bot        traffic is not allowed.' });
                }
                if (decision.isDenied() && decision.reason.isShield()) {
                    return res.status(403).json({ error: 'Access denied. Shield        traffic is not allowed.' });
                }
                if (decision.isDenied() && decision.reason.isRateLimit()) {
                    return res.status(403).json({ error: 'Access denied. Rate limit        exceeded.' });
                }
                next();
    } catch (e) {
        console.error('Error in security middleware:', e);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}  
export default securityMiddleware;