const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "asd": {
    id: "asd",
    email: "bobby@example.com",
    password: "today-lazy-work"
  },
  "123": {
    id: "123",
    email: "denny@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    assert.equal(user, testUsers.user2RandomID);
  });

  it('should return undefined when looking for a non-existent email', () => {
    const user = getUserByEmail("uncle@example.com", testUsers);
    assert.equal(user, undefined);
  });
});

// urlsForUser Test
const testUrls = {
  'asdf': {
    longURL: 'http://www.google.com',
    userID: 'bobby'
  },
  '1234': {
    longURL: 'http://www.dyson.com',
    userID: 'bobby'
  },
  '5678': {
    longURL: 'http://www.instagram.com',
    userID: 'denny'
  }
};

describe('urlsForUser', () => {
  it('should return the corresponding urls for a valid user', () => {
    const userUrls = urlsForUser('bobby', testUrls);
    const expectedResult = {
      'asdf': {
        longURL: 'http://www.google.com',
        userID: 'bobby'
      },
      '1234': {
        longURL: 'http://www.dyson.com',
        userID: 'bobby'
      }
    };
    console.log(userUrls);
    assert.deepEqual(userUrls, expectedResult);
  });

  it('should return an empty obhect for a non-existent user', () => {
    const userUrls = urlsForUser('boby', testUrls);
    assert.deepEqual(userUrls, {});
  });
});