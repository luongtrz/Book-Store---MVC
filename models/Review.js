module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'reviews',
    schema: 'public',
    timestamps: false,
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Book, {
      foreignKey: 'book_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Review;
};
