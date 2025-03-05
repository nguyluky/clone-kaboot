// const { Sequelize } = require("sequelize");
// const config = require("../config/database");

import {Sequelize, DataTypes} from "sequelize"
import config from "../config/database.js"
import defineUser from "./user.modules.js"

export const sequelize = new Sequelize(config);

export const User = defineUser(sequelize, DataTypes);

