
import {DataTypes} from "sequelize"

/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 * @returns 
 */
const defineAdmin = (sequelize) => {
  const Admin = sequelize.define("Admin", {
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

export default User;