/*
'uniE600' : info
'uniE601' : write
'uniE602' : home
'uniE603' : fly-arrow
'uniE604' : chat
'uniE606' : thumbs-up
'uniE607' : emotions
'uniE608' : delete
'uniE609' : album
'uniE60A' : refresh
'uniE60B': 'write',
'uniE60C': 'forward',
'uniE60D': 'bubble',
'uniE60E': 'love',
'uniE60F': 'settings-dark',
'uniE610': 'settings-light',
'uniE611': 'camera',
'uniE612': 'chat2',
'uniE613': 'home-light',
'uniE614': 'bubble-dark',
'uniE615': 'world-globe',
'uniE616': 'down-menu',
'uniE617': 'back',
'uniE618': 'next',
'uniE619': 'chain-bond',
'uniE61A': 'at',
'uniE61B': 'location'
*/

let map = {
    'info': '58880',
    'write': '58881',
    'home': '58882',
    'fly-arrow': '58883',
    'chat': '58884',
    'thumbs-up': '58886',
    'emotions': '58887',
    'delete' : '58888',
    'album' : '58889',
    'refresh' : '58890',
     'write2' : '58891',
    'forward' : '58892',
    'bubble' : '58893',
    'love' : '58894',
    'settings-dark' : '58895',
    'settings-light' : '58896',
    'camera' : '58897',
    'chat2' : '58898',
    'home-light' : '58899',
    'bubble-dark' : '58900',
    'world-globe' : '58901',
    'down-menu' : '58902',
    'back' : '58903',
    'next' : '58904',
    'chain-bond': '58905',
    'at': '58906',
    'location': '58907',
    'x': '120',
};
module.exports = name => String.fromCharCode(map[name]);
module.exports.map = map
