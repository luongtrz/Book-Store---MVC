module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date_order: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    status: {
      type: DataTypes.ENUM('Pending', 'Transporting', 'Delivered', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'orders',
    schema: 'public',
    timestamps: false,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Order.belongsTo(models.Book, {
      foreignKey: 'book_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Order;
};