function studentsController(req, res, next) {
    let contextObj = {
        layout: 'admin',
        // timesAndPrices,
        positionOnAsset: req.user.assetPositions[`${assetName}`],
        active: {
            'prices': true,
        }};
    contextObj.active[`${assetName}`] = true;
    res.render('admin/students', contextObj);
}

module.exports = {studentsController};