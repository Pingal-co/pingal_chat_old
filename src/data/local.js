module.exports = [
  {
    _id: Math.round(Math.random() * 1000000),
    body: 'Local 1',
    channels: ['User1', 'User2'],
    timestamp: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'Developer',
    },
    location: {
       latitude: 48.864601,
       longitude: 2.398704
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    body: 'More',
    channels: ['Pingal', 'Arts', 'Jokes', 'react-native'],

    timestamp: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'Pingal',
    },
  },
];
