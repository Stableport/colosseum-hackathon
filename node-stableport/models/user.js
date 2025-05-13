const { v4: uuid } = require('uuid');

// Mock database using in-memory object
// In a production app, this would be replaced with a real database
let users = {};

exports.create = async (userData) => {
  const userId = uuid();
  const user = {
    id: userId,
    email: userData.email,
    linkedExchanges: userData.linkedExchanges || [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  users[userId] = user;
  return user;
};

exports.findById = async (userId) => {
  return users[userId] || null;
};

exports.findByEmail = async (email) => {
  return Object.values(users).find(user => user.email === email) || null;
};

exports.findByExchangeId = async (exchangeId, exchangeUserId) => {
  return Object.values(users).find(user => 
    user.linkedExchanges.some(ex => 
      ex.exchangeId === exchangeId && ex.userId === exchangeUserId
    )
  ) || null;
};

exports.update = async (userId, userData) => {
  if (!users[userId]) {
    throw new Error('User not found');
  }
  
  const updatedUser = {
    ...users[userId],
    ...userData,
    updatedAt: new Date()
  };
  
  users[userId] = updatedUser;
  return updatedUser;
};

exports.linkExchange = async (userId, exchangeData) => {
  if (!users[userId]) {
    throw new Error('User not found');
  }
  
  const user = users[userId];
  const exchangeIndex = user.linkedExchanges.findIndex(ex => 
    ex.exchangeId === exchangeData.exchangeId
  );
  
  if (exchangeIndex !== -1) {
    // Update existing exchange link
    user.linkedExchanges[exchangeIndex] = {
      ...user.linkedExchanges[exchangeIndex],
      ...exchangeData,
      linkedAt: new Date()
    };
  } else {
    // Add new exchange link
    user.linkedExchanges.push({
      ...exchangeData,
      linkedAt: new Date()
    });
  }
  
  user.updatedAt = new Date();
  return user;
};

exports.unlinkExchange = async (userId, exchangeId) => {
  if (!users[userId]) {
    throw new Error('User not found');
  }
  
  const user = users[userId];
  user.linkedExchanges = user.linkedExchanges.filter(ex => ex.exchangeId !== exchangeId);
  user.updatedAt = new Date();
  
  return user;
};