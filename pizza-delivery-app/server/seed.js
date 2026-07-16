const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Pizza = require('./models/Pizza');
const Inventory = require('./models/Inventory');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const pizzas = [
  {
    name: 'Margherita',
    description: 'Classic delight with 100% real mozzarella cheese',
    prices: { small: 199, medium: 299, large: 399 },
    category: 'classic',
    isVeg: true
  },
  {
    name: 'Farm Fresh',
    description: 'Onion, crisp capsicum, mushroom & fresh tomato',
    prices: { small: 249, medium: 349, large: 449 },
    category: 'veg',
    isVeg: true
  },
  {
    name: 'Paneer Tikka',
    description: 'Tandoori paneer, capsicum, red paprika & mint mayo',
    prices: { small: 299, medium: 449, large: 599 },
    category: 'veg',
    isVeg: true
  },
  {
    name: 'Veggie Supreme',
    description: 'Black olives, capsicum, mushroom, sweet corn, jalapeno',
    prices: { small: 299, medium: 499, large: 649 },
    category: 'veg',
    isVeg: true
  },
  {
    name: 'Chicken Tikka',
    description: 'Chicken tikka, onion, tomato, green chillies',
    prices: { small: 349, medium: 549, large: 699 },
    category: 'non-veg',
    isVeg: false
  },
  {
    name: 'Pepperoni Feast',
    description: 'Loaded with double pepper barbecue chicken & pepperoni',
    prices: { small: 399, medium: 599, large: 799 },
    category: 'non-veg',
    isVeg: false
  },
  {
    name: 'BBQ Chicken',
    description: 'Pepper barbecue chicken with extra cheese',
    prices: { small: 299, medium: 449, large: 599 },
    category: 'non-veg',
    isVeg: false
  },
  {
    name: 'Meat Lovers',
    description: 'Chicken sausage, pepperoni, grilled chicken rashers',
    prices: { small: 399, medium: 649, large: 849 },
    category: 'non-veg',
    isVeg: false
  },
  {
    name: 'Truffle Mushroom',
    description: 'Wild mushrooms, truffle oil, parmesan cheese',
    prices: { small: 449, medium: 699, large: 899 },
    category: 'premium',
    isVeg: true
  },
  {
    name: 'Lobster Thermidor',
    description: 'Lobster chunks, creamy thermidor sauce, mozzarella',
    prices: { small: 599, medium: 899, large: 1199 },
    category: 'premium',
    isVeg: false
  },
  {
    name: 'Smoked Salmon',
    description: 'Smoked salmon, capers, dill, cream cheese',
    prices: { small: 549, medium: 799, large: 1049 },
    category: 'premium',
    isVeg: false
  },
  {
    name: 'Four Cheese Gold',
    description: 'Mozzarella, cheddar, gouda, blue cheese with gold flakes',
    prices: { small: 649, medium: 949, large: 1299 },
    category: 'premium',
    isVeg: true
  }
];

const inventoryItems = [
  { type: 'base', name: 'Thin Crust', quantity: 100 },
  { type: 'base', name: 'Thick Crust', quantity: 100 },
  { type: 'base', name: 'Cheese Burst', quantity: 100 },
  { type: 'base', name: 'Whole Wheat', quantity: 100 },
  { type: 'sauce', name: 'Tomato', quantity: 100 },
  { type: 'sauce', name: 'Pesto', quantity: 100 },
  { type: 'sauce', name: 'BBQ', quantity: 100 },
  { type: 'sauce', name: 'White Garlic', quantity: 100 },
  { type: 'cheese', name: 'Mozzarella', quantity: 100 },
  { type: 'cheese', name: 'Cheddar', quantity: 100 },
  { type: 'cheese', name: 'Parmesan', quantity: 100 },
  { type: 'cheese', name: 'Gouda', quantity: 100 },
  { type: 'vegetable', name: 'Onion', quantity: 200 },
  { type: 'vegetable', name: 'Capsicum', quantity: 200 },
  { type: 'vegetable', name: 'Mushroom', quantity: 200 },
  { type: 'vegetable', name: 'Olive', quantity: 200 },
  { type: 'vegetable', name: 'Jalapeno', quantity: 200 },
  { type: 'vegetable', name: 'Corn', quantity: 200 },
  { type: 'vegetable', name: 'Tomato', quantity: 200 },
  { type: 'vegetable', name: 'Spinach', quantity: 200 }
];

const seedData = async () => {
  try {
    // Clear collections
    await User.deleteMany();
    await Admin.deleteMany();
    await Pizza.deleteMany();
    await Inventory.deleteMany();
    
    console.log('Collections cleared');

    // Create Admin
    await Admin.create({
      name: 'Admin',
      email: 'admin@pizzahub.com',
      password: 'admin123'
    });
    console.log('Admin created');

    // Create Pizzas
    await Pizza.insertMany(pizzas);
    console.log('Pizzas seeded');

    // Create Inventory
    await Inventory.insertMany(inventoryItems);
    console.log('Inventory seeded');

    console.log('Data Seeding Completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedData();
