const DB = require('../lib/DB');

exports.addSurcharge = async (req, res, next) => {
    try {
        const data = req.body;
        const rows = await DB.frontend()('surcharges').insert(data).returning('id');
        res.send({
            surchargeId: rows[0],
        });
        res.end();
    } catch (error) {
        console.error(`Error occured: ${error.toString()}`);
        next(error);
    }
}

exports.getSurcharge = async (req, res, next) => {
    try {
        const surchargeId = req.params.id;
        const rows = await DB.frontend()('surcharges').select(
            'surcharges.id',
            'surcharges.amount',
            'surcharges.comment',
            'surcharges.email',
            'surcharges.phone',
            'surcharges.is_paid',
            'surcharges.currency',
        )
            .where({ id: surchargeId })

        if (rows[0]) {
            res.send(rows[0]);
        } else {
            throw `Surcharge with id ${surchargeId} is not found`;
        }
        res.end();
    } catch (error) {
        console.error(`Error occured: ${error.toString()}`);
        next(error);
    }
};