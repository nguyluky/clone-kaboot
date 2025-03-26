const express = require('express');
const router = express.Router();

const canvaRoutes = require('./canvaRoutes');
const sessionRoutes = require('./sessionRoutes');
const playerRoutes = require('./playerRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const questionRoutes = require('./questionRoutes');
const authRoutes = require('./authRoutes');

router.use('/canvas', canvaRoutes);
router.use('/sessions', sessionRoutes);
router.use('/players', playerRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/questions', questionRoutes);
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'Clone Kaboot API' });
});

module.exports = router;
