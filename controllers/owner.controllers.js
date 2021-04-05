/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/owner
 * @desc: profile owner
 * @method : GET
 * @type : Private
 */

exports.ownerProfileController = (req, res) => {
  res.status(200).json(res.currentUser);
};
