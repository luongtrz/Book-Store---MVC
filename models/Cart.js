module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'books',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'carts',
    schema: 'public',
    timestamps: false,
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    Cart.belongsTo(models.Book, { foreignKey: 'book_id' });
  };

  return Cart;
};