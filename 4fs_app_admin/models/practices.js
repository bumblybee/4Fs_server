// This model was generated by Lumber. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Practices = sequelize.define('practices', {
    practice: {
      type: DataTypes.STRING,
    },
    dayOne: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dayTwo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dayThree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dayFour: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dayFive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    daySix: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    daySeven: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    goal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    performed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isShared: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'practices',
    underscored: true,
    schema: process.env.DATABASE_SCHEMA,
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Practices.associate = (models) => {
    Practices.belongsTo(models.practiceWeeks, {
      foreignKey: {
        name: 'practiceWeekIdKey',
        field: 'practiceWeekId',
      },
      as: 'practiceWeek',
    });
    Practices.belongsTo(models.users, {
      foreignKey: {
        name: 'userIdKey',
        field: 'userId',
      },
      as: 'user',
    });
  };

  return Practices;
};
