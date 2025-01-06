const {ActivityCTMA} = require('../models/activity.model');
const {ProjectCTMA} = require('../models/projects.model');
const {TaskCTMA} = require('../models/tasks.model');
const {UserCTMA} = require('../models/users.model');
const { error } = require('./response.service');

const models = {
    ActivityCTMA,
    ProjectCTMA,
    TaskCTMA,
    UserCTMA
}
module.exports = {
    find(opts = { model: "", query: {}, sort: {}, attributes: [] }) {
        return new Promise(async (resolve) => {
            try {
                if (!opts.attributes || opts.attributes.length === 0) {
                    error(`::DATABASE ERROR :: Attributes is required in (find) method. ${opts.model}`);
                }

                let query = opts.query && Object.entries(opts.query).length >= 1 ? opts.query : {};
                let getData;
                if (opts.attributes) { 
                    getData = await models[opts.model].find(query).sort(opts.sort).select(opts.attributes).lean().exec();
                }
                else {
                    getData = await models[opts.model].find(query).sort(opts.sort).lean().exec();
                }

                return resolve(getData);
            } catch (e) {
                error(`::DATABASE ERROR :: catch error in (find) method. ${e}`);
                return resolve(false);
            }
        });
    },

    findOne(opts = { model: "", query: {}, sort: {}, attributes: [] }) {
        return new Promise(async (resolve) => {
            try {
                if (!opts.attributes || opts.attributes.length === 0) {
                    error(`::DATABASE ERROR :: Attributes is required in (findOne) method. ${opts.model}`);
                }
                let query =
                    opts.query && Object.entries(opts.query).length >= 1
                        ? opts.query
                        : {};

                let getData;
                if (opts.attributes) { 
                    getData = await models[opts.model].findOne(query).sort(opts.sort).select(opts.attributes).lean().exec();
                }
                else {
                    getData = await models[opts.model].findOne(query).sort(opts.sort).lean().exec();
                }
                return resolve(getData);
            } catch (e) {
                error(`::DATABASE ERROR :: catch error in (findOne) method. ${e}`);
                return resolve(false);
            }
        });
    },

    updateOne(opts = { model: "", query: {}, data: {} }) {
        return new Promise(async (resolve) => {
            try {
                let query =
                    opts.query && Object.entries(opts.query).length >= 1
                        ? opts.query
                        : {};
                let data = opts.data ? opts.data : {};
                return resolve(await models[opts.model].updateOne(query, data));
            } catch (e) {
                error(`::DATABASE ERROR :: catch error in (updateOne) method. ${e}`);
                return resolve(false);
            }
        });
    },

    updateMany(opts = { model: "", data: {}, query: {}, options: {} }) {
        return new Promise(async (resolve) => {
            try {
                let query =
                    opts.query && Object.entries(opts.query).length >= 1
                        ? opts.query
                        : {};
                let data = opts.data ? opts.data : {};
                return resolve(
                    await models[opts.model].updateMany(query, data, opts.options),
                );
            } catch (e) {
                mongoDbError(`::DATABASE ERROR :: catch error in (updateMany) method. ${e}`);
                return resolve(false);
            }
        });
    },

    create(opts = { model: "", data: {} }) {
        return new Promise(async (resolve) => {
            try {
                return opts.data
                    ? resolve(await models[opts.model].create(opts.data))
                    : false;
            } catch (e) {
                console.log(e)
                error(`::DATABASE ERROR :: catch error in (create) method. ${e}`);
                return resolve(false);
            }
        });
    },

    aggregation(opts = { model: "", query: [] }) {
        return new Promise(async (resolve) => {
            try {
                return resolve(await models[opts.model].aggregate(opts.query));
            } catch (e) {
                error(`::DATABASE ERROR :: catch error in (aggregation) method. ${e}`);
                return resolve(false);
            }
        });
    },

    upsert(opts = { model: "", data: {}, query: {} }) {
        return new Promise(async (resolve) => {
            try {
                const options = {
                    new: true, 
                    upsert: true, 
                    setDefaultsOnInsert: true,
                };
                let query =
                    opts.query && Object.entries(opts.query).length >= 1
                        ? opts.query
                        : {};
                let getData = await models[opts.model].findOneAndUpdate(query, opts.data, options);
                return resolve(getData);
            } catch (e) {
                error(`::DATABASE ERROR :: catch error in (upsert) method. ${e}`);
                return resolve(false);
            }
        });
    }
};