var client = require('..')
var assert = require('assert')
var nock = require('nock')

const c = client.create('http://test')

it ('should call service', () => {
  nock('http://test').get('/m').reply(200, 'ok')
  return c.m().then(data => assert.equal('ok', data))
})

it ('should consume json', () => {
  nock('http://test').get('/m').reply(200, { r: 'ok' })
  return c.m().then(data => assert.equal('ok', data.r))
})

it ('should support named arguments', () => {
  nock('http://test').get('/m').query({ a1: 1, a2: 'a' }).reply(200, 'ok')
  return c.m({ a1: 1, a2: 'a' }).then(data => assert.equal('ok', data))
})

it ('should stringify object arguments', () => {
  nock('http://test').get('/m').query({ a1: 1, a2: 'a', a3: JSON.stringify({x: 'y'}) }).reply(200, 'ok')
  return c.m({ a1: 1, a2: 'a', a3: {x: 'y'} }).then(data => assert.equal('ok', data))
})

it ('should throw exception on non ok responses', () => {
  nock('http://test').get('/m').reply(500, 'non ok')
  return c.m().catch(err => assert.equal('500 - "non ok"', err.message))
})

it ('should support post', () => {
  nock('http://test').post('/m').twice().reply(200, 'ok')
  return Promise.all([
    c.mǃ().then(data => assert.equal('ok', data)),
    c['m!']().then(data => assert.equal('ok', data))
  ])
})

it ('should form encode arguments when posting', () => {
  nock('http://test').post('/m', { a1: '1', a2: JSON.stringify({x: 'y'}) }).reply(200, 'ok')
  return c.mǃ({ a1: 1, a2: {x: 'y'} }).then(data => assert.equal('ok', data))
})
