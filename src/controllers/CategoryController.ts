
import { Request, Response } from 'express';

import { protect } from '../utils/auth';
import { returnError } from '../utils/returnError';
import { get, post, controller, patch, use } from './decorators';

import CategoryModel from '../models/Category';
import { sendServerResponse } from '../utils/sendServerResponse';
import { validateAddCategory } from '../utils/validation/category/add';

@controller('/categories')
export class CategoryController {
    @use(protect)
    @post('/')
    async createCategory(req: Request, res: Response) {
        try {
            const { errors, isValid } = validateAddCategory(req.body);

            if (!isValid) {
                return sendServerResponse(res, {
                    statusCode: 400,
                    success: false,
                    errors,
                    msg: 'Invalid category data!'
                });
            }
            const category = await CategoryModel.create({ name: req.body.name, type: req.body.type.toUpperCase() });

            return sendServerResponse(res, {
                statusCode: 201,
                success: true,
                msg: 'Category created successfully',
                data: category
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to create category');
        }
    }

    @use(protect)
    @patch('/:id')
    async updateCategory(req: Request, res: Response) {
        try {
            const { errors, isValid } = validateAddCategory(req.body);

            if (!isValid) {
                return sendServerResponse(res, {
                    statusCode: 400,
                    success: false,
                    errors,
                    msg: 'Invalid category data!'
                });
            }
            const category = await CategoryModel.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, type: req.body.type.toUpperCase() } }, { new: true, runValidators: true });

            return sendServerResponse(res, {
                statusCode: 200,
                success: true,
                msg: 'Category updated successfully',
                data: category
            });
            
        } catch (err) {
            return returnError(err, res, 500, 'Failed to update category');
        }
    }

    @get('/:categoryType')
    async getCategoriesByType(req: Request, res: Response) {
        try {
            const categories = await CategoryModel.find({ type: req.params.categoryType.toUpperCase() });
            return sendServerResponse(res, { 
                statusCode: 200, 
                success: true, 
                data: categories,
                count: categories.length
            });
        } catch (err) {
            return returnError(err, res, 500, 'Failed to get categories');
        }
    }
}