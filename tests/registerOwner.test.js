const { registerOwner } = require('../src/controllers/auth.controllers');
/* eslint-disable no-undef */
test('registerOwner validation errors', () => {
  const result = registerOwner({});
  expect(result).toBe({ ErrorOwnerRegister });
});
