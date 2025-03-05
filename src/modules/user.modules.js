

import {DataTypes} from "sequelize"
/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 * @returns 
 */
const defineUser = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING
  });
  return User;
};

export default defineUser;