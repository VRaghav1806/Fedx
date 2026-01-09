import { Request, Response } from 'express';
export declare const getCases: (req: Request, res: Response) => Promise<void>;
export declare const createCase: (req: Request, res: Response) => Promise<void>;
export declare const updateCase: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCase: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=caseController.d.ts.map