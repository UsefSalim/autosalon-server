/**
 *
 * @param {*} req
 * @param {*} res
 * @root : https://localhost:5000/api/client
 * @desc: profile Client
 * @method : GET
 * @type : Private
 */
exports.clientProfileController = (req, res) => {
  res.status(200).json(res.currentUser);
};
