// @flow

const moment = require('moment');
const DB = require('../lib/DB');

const SLEEP = 5000;
const LIFETIME = 30000;
const STATUS_OK = 'ok';
const STATUS_ERROR = 'error';
const STATUS_PROGRESS = 'in_progress';
const STATUS_UNPROCESSED = 'unprocessed';

class Worker {
    constructor() {
        this.stopped = true;
        this.timer = null;
    }

    async getUnprocessedSurcharges() {
        try {
            const rows = await DB.frontend()('surcharges')
                .select(
                    'surcharges.id',
                    'surcharges.service_status',
                    'surcharges.is_paid',
                    'surcharges.service_class',
                    'surcharges.followed_at',
                ).where(
                    { service_status: STATUS_UNPROCESSED },
                ).orWhere(
                    { service_status: STATUS_PROGRESS },
                );
            console.info(`Worker: got ${rows.length} unprocessed surcharges`)
            return rows;
        } catch (error) {
            console.error(`Worker: error ${error}`)
        }

    }

    start() {
        console.info('Worker: starting');
        this.stopped = false;
        this.startLoop();
    }

    stop() {
        this.stopped = true;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        console.info('Worker: stopped');
    }

    startLoop() {
        return this.loop().catch(error => {
            console.error(`Worker: loop error ${error.toString()}`);
        }).finally(() => {
            if (!this.stopped) {
                this.timer = setTimeout(() => {
                    this.startLoop();
                }, SLEEP);
            }
        });
    }

    async loop() {
        if (!this.stopped) {
            const surcharges = await this.getUnprocessedSurcharges();
            if (surcharges.length) {
                surcharges.forEach(async surcharge => {
                    const {
                        id,
                        service_status: serviceStatus,
                        service_class: serviceClass,
                        is_paid: isPaid,
                        followed_at: followedAt,
                    } = surcharge;
                    if (
                        (
                            serviceStatus === STATUS_PROGRESS ||
                                serviceStatus === STATUS_UNPROCESSED
                        ) && isPaid
                    ) {
                        console.info(`Worker: surcharge(${id}) is paid`)
                        await DB.frontend()('surcharges').update({
                            service_status: STATUS_OK,
                        }).where({ id });
                        switch (serviceClass) {
                            case 'insurances_service':
                                console.info('Buying Insurances');
                                break;
                            case 'taxi_service':
                                console.info('Ordering taxi');
                                break;
                            default:
                                break;
                        }
                    } else if (
                        !isPaid &&
                        moment().diff(followedAt) > LIFETIME
                    ) {
                        console.info(`Worker: surcharge(${id}) reached end of life`)
                        await DB.frontend()('surcharges').update({
                            service_status: STATUS_ERROR,
                        }).where({ id });
                    } else if (serviceStatus === STATUS_UNPROCESSED) {
                        await DB.frontend()('surcharges').update({
                            service_status: STATUS_PROGRESS,
                        }).where({ id });
                    }
                });
            }
        }
    }
}

module.exports = Worker;
