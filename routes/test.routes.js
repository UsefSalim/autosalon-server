const express = require('express');

const router = express.Router();

const {
  getAll,
  addtest,
  delettest,
  deletAlltests,
  getOne,
  updatetest,
} = require('../controllers/test.controllers');

/// * ------------------------- test Route

/* ! @Route  : GET => /
     Desc    : Get all tests 
     @Access : Pubic
*/
router.get('/', getAll);

/* ! @Route  : GET => /:id
     Desc    : Get One  test
     @Access : Pubic
*/
router.get('/:id', getOne);

/* ! @Route  : POST => /add
     Desc    : Create test
     @Access : Pubic
*/

router.post('/add', addtest);

/* ! @Route  : POST => /:id
     Desc    : Delete One test
     @Access : Pubic
*/
router.delete('/:id', delettest);

/* ! @Route  : DELETE => /
     Desc    : Delete All tests
     @Access : Pubic
*/
router.delete('/', deletAlltests);

/* ! @Route  : UPDATE => /:id
     Desc    : UPDATE  test
     @Access : Pubic
*/
router.put('/:id', updatetest);

module.exports = router;
