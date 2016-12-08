module.exports = [
  {
    _id: Math.round(Math.random() * 1000000),
    body: 'I am in Arts',
    channels: ['Photography', 'History'],
    timestamp: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 1,
      name: 'Developer',
    },
    //channels: ['ai', 'erlang'],
    location: {
       latitude: 48.864601,
       longitude: 2.398704
    },
  },
  {
    _id: Math.round(Math.random() * 1000000),
    body: 'A cool photo',
    channels: ['MyPhotos'],

    timestamp: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    user: {
      _id: 2,
      name: 'Pingal',
    },
   
  },
];