const express = require('express');
const {
  index,
  create,
  show,
  update,
  destroy,
} = require('../controllers/foods');

const router = express.Router();

// /foods
router.get('/', index);
router.post('/', create);

// /foods/:id
router.get('/:id', show);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;