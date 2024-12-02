module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    phone: {
      type: DataTypes.TEXT,
    },
    address: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'contacts',
    timestamps: false,
  });

  Contact.associate = (models) => {
    Contact.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Contact;
};