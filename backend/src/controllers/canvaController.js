const canvaModel = require('../models/canvaModel');

class CanvaController {
    async getAllCanvas(req, res) {
        try {
            const canvases = await canvaModel.getAllCanva();
            res.status(200).json(canvases);
        } catch (error) {
            console.error('Error in getAllCanvas controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCanvaById(req, res) {
        try {
            const { id } = req.params;
            const canvas = await canvaModel.getCanvaById(id);

            if (!canvas) {
                return res.status(404).json({ message: 'Canvas not found' });
            }

            res.status(200).json(canvas);
        } catch (error) {
            console.error('Error in getCanvaById controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCanvaDetail(req, res) {
        try {
            const { id } = req.params;
            const canvas = await canvaModel.getCanvaDetail(id);

            if (!canvas) {
                return res.status(404).json({ message: 'Canvas not found' });
            }

            res.status(200).json(canvas);
        } catch (error) {
            console.error('Error in getCanvaDetail controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createCanva(req, res) {
        try {
            const { title, category, description } = req.body;

            if (!title || !category || !description) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const canvaId = await canvaModel.createCanva({ title, category, description });

            res.status(201).json({
                id: canvaId,
                message: 'Canvas created successfully'
            });
        } catch (error) {
            console.error('Error in createCanva controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCanva(req, res) {
        try {
            const { id } = req.params;
            const { title, category, description } = req.body;

            if (!title && !category && !description) {
                return res.status(400).json({ message: 'No fields to update' });
            }

            const canvas = await canvaModel.getCanvaById(id);

            if (!canvas) {
                return res.status(404).json({ message: 'Canvas not found' });
            }

            const updatedData = {
                title: title || canvas.title,
                category: category || canvas.category,
                description: description || canvas.description
            };

            await canvaModel.updateCanva(id, updatedData);

            res.status(200).json({ message: 'Canvas updated successfully' });
        } catch (error) {
            console.error('Error in updateCanva controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteCanva(req, res) {
        try {
            const { id } = req.params;

            const canvas = await canvaModel.getCanvaById(id);

            if (!canvas) {
                return res.status(404).json({ message: 'Canvas not found' });
            }

            await canvaModel.deleteCanva(id);

            res.status(200).json({ message: 'Canvas deleted successfully' });
        } catch (error) {
            console.error('Error in deleteCanva controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CanvaController();
